const { SuiClient, getFullnodeUrl } = require("@mysten/sui/client");

// Network configuration
const NETWORKS = {
  mainnet: {
    url: process.env.SUI_RPC_URL_MAINNET || getFullnodeUrl("mainnet"),
    name: "Mainnet",
  },
  testnet: {
    url: process.env.SUI_RPC_URL_TESTNET || getFullnodeUrl("testnet"),
    name: "Testnet",
  },
  devnet: {
    url: process.env.SUI_RPC_URL_DEVNET || getFullnodeUrl("devnet"),
    name: "Devnet",
  },
};

// Get SUI client for specific network
function getSuiClient(network = "mainnet") {
  const networkConfig = NETWORKS[network] || NETWORKS.mainnet;
  return new SuiClient({
    url: networkConfig.url,
  });
}

// Get current network from environment or default
function getCurrentNetwork() {
  const network = process.env.SUI_NETWORK || "mainnet";
  return NETWORKS[network] ? network : "mainnet";
}

module.exports = {
  getSuiClient,
  getCurrentNetwork,
  NETWORKS,
};
