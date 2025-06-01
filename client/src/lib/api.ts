const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface PortfolioData {
  address: string;
  summary: {
    numTokens: number;
    numNFTs: number;
    numOtherObjects: number;
    numTx: number;
    totalInSUI: number;
    totalOutSUI: number;
  };
  tokens: Array<{
    objectId: string;
    coinType: string;
    balance: string | null;
  }>;
  nfts: Array<{
    objectId: string;
    type: string;
    fields: Record<string, unknown>;
  }>;
  others: Array<{
    objectId: string;
    type: string;
    fields: Record<string, unknown>;
  }>;
  txs: Array<{
    digest: string;
    timestamp: string;
    kind: string;
    events: unknown[];
    balanceChanges: unknown[];
  }>;
}

export interface GasData {
  totalGasSpent: string;
  averageGasPerTx: string;
  gasEfficiency: number;
  recommendations: string[];
}

export interface StakingData {
  totalStaked: string;
  estimatedAPY: string;
  validatorCount: number;
  recommendations: string[];
}

export async function getPortfolio(address: string): Promise<PortfolioData> {
  const response = await fetch(`${API_BASE_URL}/api/sui-portfolio?address=${address}`);
  if (!response.ok) {
    throw new Error("Failed to fetch portfolio data");
  }
  return response.json();
}

export async function getGasData(address: string): Promise<GasData> {
  const response = await fetch(`${API_BASE_URL}/api/sui-gas?address=${address}`);
  if (!response.ok) {
    throw new Error("Failed to fetch gas data");
  }
  return response.json();
}

export async function getStakingData(address: string): Promise<StakingData> {
  const response = await fetch(`${API_BASE_URL}/api/sui-staking?address=${address}`);
  if (!response.ok) {
    throw new Error("Failed to fetch staking data");
  }
  return response.json();
}
