const { getGasSummary, buildGasPrompt } = require("./suiGasAdvisor");
const { getStakingSummary, buildStakingPrompt } = require("./suiStakingAdvisor");
const { getTaxSummary, buildTaxPrompt } = require("./suiTaxAnalyzer");
const { getSuiPortfolio } = require("./suiPortfolio");
const { ChatOpenAI } = require("@langchain/openai");
const { PromptTemplate } = require("@langchain/core/prompts");
const { RunnableSequence } = require("@langchain/core/runnables");

// Initialize LangChain components
const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,
  modelName: "gpt-4-turbo-preview",
});

const promptTemplate = PromptTemplate.fromTemplate(
  `You are an expert Web3 portfolio analyst specializing in Sui blockchain. Provide a comprehensive analysis with actionable insights.

  PORTFOLIO DATA:
  {portfolioData}

  Analyze this portfolio and provide a detailed report covering:

  📊 PORTFOLIO OVERVIEW
  • Current portfolio composition and value distribution
  • Asset allocation analysis (liquid vs staked vs locked)
  • Transaction patterns and user behavior insights
  • Risk profile assessment based on trading activity

  🔍 MARKET RESEARCH & OPPORTUNITIES
  • Current market conditions for SUI ecosystem
  • Emerging opportunities in DeFi, NFTs, or new protocols
  • Comparison with optimal portfolio strategies
  • Potential growth areas based on user's activity pattern

  💰 PROFIT OPTIMIZATION STRATEGIES
  • Yield optimization recommendations (staking, liquidity provision, farming)
  • Gas optimization techniques to reduce costs
  • Tax-efficient strategies for realized/unrealized gains
  • Risk-adjusted return improvement suggestions

  📈 STRATEGIC RECOMMENDATIONS
  • Short-term actions (1-7 days): Immediate optimizations
  • Medium-term strategy (1-3 months): Portfolio rebalancing
  • Long-term vision (3-12 months): Growth positioning
  • Specific protocols or platforms to explore

  🎯 BEHAVIORAL ANALYSIS & INSIGHTS
  • Trading pattern analysis (frequency, volume, timing)
  • Risk appetite assessment based on historical data
  • Behavioral biases identified and mitigation strategies
  • Personalized tips based on user's investment style

  ⚡ ACTION ITEMS (Prioritized)
  1. Most urgent optimization (highest impact, lowest effort)
  2. Quick wins for immediate improvement
  3. Strategic moves for portfolio growth
  4. Risk management adjustments
  5. Learning resources for identified knowledge gaps

  Format with clear sections, use data to support recommendations, and provide specific numbers/percentages where applicable.`
);

async function getPortfolioAdvice(address) {
  // 1. Get comprehensive data
  const [gas, staking, tax, portfolio] = await Promise.all([
    getGasSummary(address),
    getStakingSummary(address),
    getTaxSummary(address),
    getSuiPortfolio(address),
  ]);

  // 2. Build comprehensive portfolio data string
  const portfolioSummary = `
Portfolio Summary:
- Total Assets: ${portfolio.summary.numTokens} tokens, ${portfolio.summary.numNFTs} NFTs
- Transaction Activity: ${portfolio.summary.numTx} recent transactions
- Capital Flow: ${portfolio.summary.totalInSUI.toFixed(
    2
  )} SUI received, ${portfolio.summary.totalOutSUI.toFixed(2)} SUI sent
- Net Position: ${(portfolio.summary.totalInSUI - portfolio.summary.totalOutSUI).toFixed(2)} SUI

Token Holdings:
${portfolio.tokens
  .map(
    (t) =>
      `- ${t.coinType}: ${
        t.balance ? (Number(t.balance) / 1e9).toFixed(2) + " tokens" : "balance unavailable"
      }`
  )
  .join("\n")}

NFT Collection: ${portfolio.summary.numNFTs} items
`;

  const portfolioData = [
    portfolioSummary,
    buildGasPrompt(address, gas),
    buildStakingPrompt(address, staking),
    buildTaxPrompt(address, tax),
  ].join("\n\n");

  // 3. Generate AI advice using LangChain
  const chain = RunnableSequence.from([promptTemplate, model]);

  const aiAdvice = await chain.invoke({
    portfolioData,
  });

  // 4. Return both raw data and AI analysis
  return {
    prompt: aiAdvice.content,
    gas,
    staking,
    tax,
    portfolio,
  };
}

module.exports = { getPortfolioAdvice };
