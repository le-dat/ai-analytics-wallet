const { getSuiClient } = require("./networkConfig");

// Tổng phí gas trong X giao dịch gần nhất (tuỳ chỉnh limit)
async function getGasSummary(address, network = "mainnet", txLimit = 30) {
  const provider = getSuiClient(network);

  const txs = await provider.queryTransactionBlocks({
    filter: { FromAddress: address },
    limit: txLimit,
    options: { showEffects: true, showInput: true },
  });

  let totalGas = 0;
  let highGasTxs = [];
  let maxGas = 0;

  for (const tx of txs.data) {
    const gasUsed = tx.effects?.gasUsed?.computationCost || 0;
    totalGas += Number(gasUsed);
    if (gasUsed > 1_000_000_000) highGasTxs.push(tx.digest); // ví dụ, >1 SUI
    if (gasUsed > maxGas) maxGas = gasUsed;
  }

  return {
    totalGas,
    totalGasSUI: totalGas / 1e9,
    avgGasSUI: totalGas / txs.data.length / 1e9,
    maxGasSUI: maxGas / 1e9,
    highGasTxs,
    gasEfficiency:
      totalGas / txs.data.length / 1e9 < 0.005
        ? 100
        : totalGas / txs.data.length / 1e9 < 0.01
        ? 85
        : totalGas / txs.data.length / 1e9 < 0.05
        ? 60
        : 30,
  };
}

function buildGasPrompt(address, summary) {
  const gasEfficiency =
    summary.avgGasSUI < 0.005
      ? "Excellent"
      : summary.avgGasSUI < 0.01
      ? "Good"
      : summary.avgGasSUI < 0.05
      ? "Average"
      : "Poor";

  const gasOptimizationPotential = summary.avgGasSUI > 0.01 ? (summary.avgGasSUI - 0.005) * 30 : 0; // Potential savings per month

  return `⛽ GAS ANALYSIS FOR WALLET: ${address}

📊 GAS METRICS OVERVIEW:
• Total Gas Spent: ${summary.totalGasSUI.toFixed(4)} SUI
• Average Gas per Transaction: ${summary.avgGasSUI.toFixed(6)} SUI
• Maximum Gas in Single Transaction: ${summary.maxGasSUI.toFixed(4)} SUI
• High-Fee Transactions (>1 SUI): ${summary.highGasTxs.length} transactions
• Gas Efficiency Rating: ${gasEfficiency}

💡 GAS OPTIMIZATION INSIGHTS:
• Current gas usage pattern indicates ${gasEfficiency.toLowerCase()} efficiency
• Potential monthly savings: ~${gasOptimizationPotential.toFixed(2)} SUI
• Peak gas transaction was ${(summary.maxGasSUI / summary.avgGasSUI).toFixed(
    1
  )}x higher than average
${
  summary.highGasTxs.length > 0
    ? `• ⚠️ Alert: ${summary.highGasTxs.length} transactions exceeded normal gas limits`
    : "• ✅ No abnormal gas spikes detected"
}

🎯 RECOMMENDATIONS:
${
  summary.avgGasSUI > 0.01
    ? "• Consider batching multiple operations to reduce per-transaction overhead"
    : ""
}
${
  summary.maxGasSUI > 1
    ? "• Review high-gas transactions to identify optimization opportunities"
    : ""
}
${
  summary.avgGasSUI < 0.005
    ? "• Your gas optimization is excellent - maintain current practices"
    : ""
}
• Monitor gas prices during off-peak hours for better rates
• Use gas estimation tools before executing complex transactions
`;
}
module.exports = { getGasSummary, buildGasPrompt };
