const { SuiClient, getFullnodeUrl } = require("@mysten/sui/client");
const { getSuiClient } = require("./networkConfig");

// Hàm lấy tất cả object ví đang sở hữu
async function getSuiPortfolio(address, network = "mainnet") {
  const provider = getSuiClient(network);

  // 1. Lấy list object (coin, token, NFT)
  const objects = await provider.getOwnedObjects({
    owner: address,
    options: { showType: true, showOwner: true, showContent: true },
  });

  // 2. Lọc ra coin, NFT, object đặc biệt
  let tokens = [];
  let nfts = [];
  let others = [];

  for (const obj of objects.data) {
    const type = obj.data?.type || "";
    if (type.startsWith("0x2::coin::Coin<")) {
      // Lấy tên token
      const match = type.match(/<(.+)>/);
      tokens.push({
        objectId: obj.data.objectId,
        coinType: match ? match[1] : "SUI",
        balance: obj.data.content?.fields?.balance || null,
      });
    } else if (
      type.includes("::nft::") ||
      type.includes("::NFT") ||
      type.toLowerCase().includes("nft")
    ) {
      nfts.push({
        objectId: obj.data.objectId,
        type,
        fields: obj.data.content?.fields || {},
      });
    } else {
      others.push({
        objectId: obj.data.objectId,
        type,
        fields: obj.data.content?.fields || {},
      });
    }
  }

  // 3. Lấy giao dịch gần đây (limit 20)
  const txs = await provider.queryTransactionBlocks({
    filter: { FromAddress: address },
    limit: 20,
    options: { showInput: true, showEffects: true, showEvents: true, showBalanceChanges: true },
  });

  // 4. Tóm tắt số lượng giao dịch, tổng SUI nhận/chi, v.v.
  let totalIn = 0,
    totalOut = 0;
  txs.data.forEach((tx) => {
    // Lấy SUI chuyển vào/ra
    (tx.balanceChanges || []).forEach((bc) => {
      if (bc.owner?.AddressOwner === address) {
        totalIn += Number(bc.amount);
      } else {
        totalOut += Number(bc.amount);
      }
    });
  });

  return {
    address,
    summary: {
      numTokens: tokens.length,
      numNFTs: nfts.length,
      numOtherObjects: others.length,
      numTx: txs.data.length,
      totalInSUI: totalIn / 1e9, // SUI (nếu là balance nano format)
      totalOutSUI: totalOut / 1e9,
    },
    tokens,
    nfts,
    others,
    txs: txs.data.map((tx) => ({
      digest: tx.digest,
      timestamp: tx.timestampMs,
      kind: tx.transaction?.data?.transactions?.[0]?.kind,
      events: tx.events,
      balanceChanges: tx.balanceChanges,
    })),
  };
}

module.exports = { getSuiPortfolio };
