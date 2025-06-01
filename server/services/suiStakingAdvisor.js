const { SuiClient, getFullnodeUrl } = require("@mysten/sui/client");

const provider = new SuiClient({
  url: process.env.SUI_RPC_URL || getFullnodeUrl("mainnet"),
});

// Lấy số dư SUI chưa stake và đã stake (Sui native staking)
async function getStakingSummary(address) {
  // 1. Lấy tổng SUI balance
  const coins = await provider.getCoins({ owner: address });
  const suiBalance = coins.data
    .filter((coin) => coin.coinType === "0x2::sui::SUI")
    .reduce((sum, c) => sum + Number(c.balance), 0);

  // 2. Lấy staking positions (bằng cách lọc object staking)
  const objects = await provider.getOwnedObjects({
    owner: address,
    options: { showType: true },
  });

  let staked = 0;
  for (const obj of objects.data) {
    if (obj.data?.type?.includes("::staking")) {
      staked += Number(obj.data.content?.fields?.principal || 0);
    }
  }

  return {
    suiBalance: suiBalance / 1e9,
    stakedSui: staked / 1e9,
    totalStaked: staked / 1e9,
    estimatedAPY: "6.3",
    validatorCount: staked > 0 ? 1 : 0, // Simplified, can be enhanced
  };
}

function buildStakingPrompt(address, staking) {
  const totalSui = staking.suiBalance + staking.stakedSui;
  const stakingRatio = totalSui > 0 ? (staking.stakedSui / totalSui) * 100 : 0;
  const optimalStakingRatio = 70; // 70% is generally optimal
  const currentAPY = 6.3; // Current Sui staking APY

  const potentialEarnings = (staking.suiBalance * (currentAPY / 100)) / 12; // Monthly
  const currentEarnings = (staking.stakedSui * (currentAPY / 100)) / 12;
  const missedEarnings = potentialEarnings;

  const stakingHealth =
    stakingRatio >= 70
      ? "Excellent"
      : stakingRatio >= 50
      ? "Good"
      : stakingRatio >= 30
      ? "Fair"
      : "Poor";

  return `🏦 STAKING ANALYSIS FOR WALLET: ${address}

📊 STAKING METRICS OVERVIEW:
• Total SUI Holdings: ${totalSui.toFixed(4)} SUI
• Currently Staked: ${staking.stakedSui.toFixed(4)} SUI (${stakingRatio.toFixed(1)}%)
• Liquid SUI Balance: ${staking.suiBalance.toFixed(4)} SUI
• Staking Health Score: ${stakingHealth}
• Current APY: ${currentAPY}%

💰 EARNINGS ANALYSIS:
• Current Monthly Earnings: ${currentEarnings.toFixed(2)} SUI
• Potential Additional Earnings: ${potentialEarnings.toFixed(2)} SUI/month
• Annual Passive Income: ${(currentEarnings * 12).toFixed(2)} SUI
${
  missedEarnings > 0
    ? `• ⚠️ Opportunity Cost: Missing ${(missedEarnings * 12).toFixed(2)} SUI/year by not staking`
    : ""
}

📈 STAKING OPTIMIZATION:
• Current Staking Ratio: ${stakingRatio.toFixed(1)}% (Recommended: ${optimalStakingRatio}%)
${
  stakingRatio < optimalStakingRatio
    ? `• To reach optimal ratio, stake additional ${(
        ((optimalStakingRatio - stakingRatio) / 100) *
        totalSui
      ).toFixed(2)} SUI`
    : "• ✅ You have achieved optimal staking ratio"
}
• Risk-Adjusted Strategy: Keep ${100 - optimalStakingRatio}% liquid for opportunities

🎯 RECOMMENDATIONS:
${
  staking.suiBalance > 10
    ? `• 🚀 Stake ${Math.min(staking.suiBalance * 0.7, staking.suiBalance - 5).toFixed(
        2
      )} SUI immediately to start earning passive income`
    : ""
}
${stakingRatio > 90 ? "• Consider keeping 10-20% liquid for DeFi opportunities and gas fees" : ""}
${
  stakingRatio < 30
    ? "• ⚠️ Priority Action: Your staking ratio is suboptimal - stake now to maximize returns"
    : ""
}
• Diversify validators to minimize risk
• Review staking rewards monthly and compound for better returns
• Monitor validator performance and APY changes
`;
}

module.exports = { getStakingSummary, buildStakingPrompt };
