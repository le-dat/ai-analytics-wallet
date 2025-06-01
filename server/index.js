// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { getSuiPortfolio } = require("./services/suiPortfolio");
const { getGasSummary } = require("./services/suiGasAdvisor");
const { getStakingSummary } = require("./services/suiStakingAdvisor");
const { getTaxSummary } = require("./services/suiTaxAnalyzer");
const { getPortfolioAdvice } = require("./services/aiPortfolioAdvice");
const { clearResponse } = require("./utils/lib");

const app = express();
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("combined"));

app.get("/", (req, res) => {
  res.json({ message: "OK" });
});

app.get("/api/sui-portfolio", async (req, res) => {
  const { address } = req.query;
  if (!address) return res.status(400).json({ error: "Missing address" });

  try {
    const data = await getSuiPortfolio(address);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/sui-gas", async (req, res) => {
  const { address } = req.query;
  if (!address) return res.status(400).json({ error: "Missing address" });

  try {
    const data = await getGasSummary(address);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/sui-staking", async (req, res) => {
  const { address } = req.query;
  if (!address) return res.status(400).json({ error: "Missing address" });

  try {
    const data = await getStakingSummary(address);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/sui-tax", async (req, res) => {
  const { address } = req.query;
  if (!address) return res.status(400).json({ error: "Missing address" });

  try {
    const data = await getTaxSummary(address);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/chat", async (req, res) => {
  const { address, message } = req.body;

  try {
    // If no address provided, just respond with a general message
    if (!address) {
      return res.json({
        response:
          "Please connect your wallet first so I can analyze your portfolio and provide personalized advice.",
      });
    }

    // Get portfolio advice based on address
    const { prompt, gas, staking, tax, portfolio } = await getPortfolioAdvice(address);

    // Check if user is asking about specific aspects
    const messageLower = message.toLowerCase();
    let contextualResponse = prompt;

    // Add context-specific responses
    if (messageLower.includes("gas") || messageLower.includes("fee")) {
      contextualResponse = `**Gas Analysis Focus:**\n\n${prompt}\n\n**Detailed Gas Metrics:**\n- Total Gas Spent: ${gas.totalGasSpent} SUI\n- Average Gas per Transaction: ${gas.averageGasPerTx} SUI\n- Gas Efficiency Rating: ${gas.gasEfficiency}/100`;
    } else if (messageLower.includes("stake") || messageLower.includes("staking")) {
      contextualResponse = `**Staking Analysis Focus:**\n\n${prompt}\n\n**Staking Details:**\n- Currently Staked: ${staking.totalStaked} SUI\n- Staking APY: ~${staking.estimatedAPY}%\n- Validators: ${staking.validatorCount}`;
    } else if (messageLower.includes("tax")) {
      contextualResponse = `**Tax Analysis Focus:**\n\n${prompt}\n\n**Tax Summary:**\n- Realized Gains: ${tax.realizedGains} SUI\n- Unrealized Gains: ${tax.unrealizedGains} SUI\n- Tax Events: ${tax.taxableEvents}`;
    } else if (messageLower.includes("nft")) {
      contextualResponse = `**NFT Portfolio Focus:**\n\n${prompt}\n\n**NFT Holdings:**\n- Total NFTs: ${portfolio.summary.numNFTs}\n- Collections: Multiple (see detailed analysis above)`;
    }

    res.json({
      response: contextualResponse,
      data: { gas, staking, tax, portfolio },
      userMessage: message,
    });
  } catch (e) {
    console.error("Chat API Error:", e);
    res.status(500).json({ error: e.message });
  }
});

app.listen(port, () => {
  console.log(`AI-Powered Web3 Portfolio Assistant running at http://localhost:${port}`);
});
