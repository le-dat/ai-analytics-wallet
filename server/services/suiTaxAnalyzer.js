const { getSuiClient } = require("./networkConfig");

// Tổng hợp mua/bán/nhận SUI trong các giao dịch gần đây (phần cơ bản, cần nâng cấp nếu làm chuyên sâu)
async function getTaxSummary(address, network = "mainnet", txLimit = 30) {
  const provider = getSuiClient(network);

  const txs = await provider.queryTransactionBlocks({
    filter: { FromAddress: address },
    limit: txLimit,
    options: { showBalanceChanges: true, showInput: true },
  });

  let totalIn = 0,
    totalOut = 0;
  for (const tx of txs.data) {
    for (const bc of tx.balanceChanges || []) {
      // SUI gửi đi hoặc nhận vào
      if (bc.owner?.AddressOwner === address && bc.coinType === "0x2::sui::SUI") {
        totalIn += Number(bc.amount);
      } else if (bc.coinType === "0x2::sui::SUI") {
        totalOut += Number(bc.amount);
      }
    }
  }

  return {
    totalInSUI: totalIn / 1e9,
    totalOutSUI: totalOut / 1e9,
    gainLossSUI: (totalIn - totalOut) / 1e9,
    realizedGains: (totalIn - totalOut) / 1e9 > 0 ? (totalIn - totalOut) / 1e9 : 0,
    unrealizedGains: 0, // Would need portfolio value tracking
    taxableEvents: Math.abs(totalOut / 1e9) > 0 ? Math.floor(totalOut / 1e9 / 10) : 0,
  };
}

function buildTaxPrompt(address, tax) {
  const netPosition = tax.gainLossSUI;
  const taxableEvents = Math.abs(tax.totalOutSUI) > 0 ? Math.floor(tax.totalOutSUI / 10) : 0;
  const estimatedTaxableGain = netPosition > 0 ? netPosition * 0.7 : 0; // Assume 70% is taxable
  const taxBracket = 0.25; // Assume 25% tax bracket
  const estimatedTaxLiability = estimatedTaxableGain * taxBracket;

  const taxEfficiency =
    netPosition > 0 && estimatedTaxLiability < netPosition * 0.15
      ? "Good"
      : netPosition > 0 && estimatedTaxLiability < netPosition * 0.25
      ? "Average"
      : "Poor";

  return `💸 TAX ANALYSIS FOR WALLET: ${address}

📊 TRANSACTION SUMMARY:
• Total SUI Received: ${tax.totalInSUI.toFixed(4)} SUI
• Total SUI Sent: ${tax.totalOutSUI.toFixed(4)} SUI
• Net Position: ${netPosition.toFixed(4)} SUI ${netPosition > 0 ? "(Gain)" : "(Loss)"}
• Estimated Taxable Events: ${taxableEvents}

💰 TAX IMPLICATIONS:
${
  netPosition > 0
    ? `• Estimated Taxable Gain: ${estimatedTaxableGain.toFixed(2)} SUI
• Potential Tax Liability: ${estimatedTaxLiability.toFixed(2)} SUI (at ${(taxBracket * 100).toFixed(
        0
      )}% rate)
• Tax Efficiency Score: ${taxEfficiency}`
    : `• Tax Loss Available: ${Math.abs(netPosition).toFixed(2)} SUI
• Can offset future gains for tax reduction`
}
• Record Keeping Status: ${
    taxableEvents > 10
      ? "⚠️ High activity - ensure proper documentation"
      : "✅ Manageable transaction volume"
  }

📈 TAX OPTIMIZATION STRATEGIES:
${
  netPosition > 0
    ? `• Consider tax-loss harvesting on underperforming assets
• Hold positions >1 year for long-term capital gains rates
• Time realizations across tax years to manage brackets`
    : `• Use losses to offset gains in other crypto positions
• Consider realizing losses before year-end`
}
• Track cost basis meticulously for accurate reporting
• Separate personal transactions from DeFi/staking rewards

🎯 RECOMMENDATIONS:
${taxableEvents > 20 ? "• 🚨 Use professional crypto tax software for accurate reporting" : ""}
${netPosition > 100 ? "• Consider quarterly tax payments to avoid penalties" : ""}
${
  Math.abs(tax.totalOutSUI) > 1000
    ? "• High transaction volume detected - maintain detailed records"
    : ""
}
• Export transaction history regularly for record keeping
• Consult with a crypto-aware tax professional
• Monitor regulatory changes in your jurisdiction
• Consider using specific identification method for cost basis

⚖️ COMPLIANCE CHECKLIST:
• [ ] Track all buy/sell transactions with dates and amounts
• [ ] Record staking rewards as income
• [ ] Document DeFi interactions and yield farming
• [ ] Maintain wallet-to-wallet transfer records
• [ ] Calculate fair market value at time of transactions
`;
}

module.exports = { getTaxSummary, buildTaxPrompt };
