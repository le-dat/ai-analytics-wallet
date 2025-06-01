# Sui Portfolio API

A simple Node.js/Express backend to fetch and summarize Sui wallet portfolios using the latest `@mysten/sui` SDK.

## Features

- Fetches all owned objects (coins, tokens, NFTs, others) for a Sui address
- Summarizes token/NFT counts and recent transactions
- Returns SUI in/out statistics

## Setup

1. Install dependencies:

   ```bash
   cd server
   npm install
   ```

2. (Optional) Set a custom Sui RPC URL:

   - Create a `.env` file:
     ```env
     SUI_RPC_URL=https://fullnode.mainnet.sui.io:443
     ```

3. Start the server:
   ```bash
   npm run dev
   # or
   npm start
   ```

The API will be available at `http://localhost:3001`.

## API Usage

### GET `/api/sui-portfolio?address=<SUI_ADDRESS>`

Returns a summary of the Sui wallet portfolio for the given address.

#### Example Response

```json
{
  "address": "0x...",
  "summary": {
    "numTokens": 2,
    "numNFTs": 1,
    "numOtherObjects": 0,
    "numTx": 20,
    "totalInSUI": 1.23,
    "totalOutSUI": 0.45
  },
  "tokens": [ ... ],
  "nfts": [ ... ],
  "others": [ ... ],
  "txs": [ ... ]
}
```

## Example Test File

You can test the API using a simple Node.js script. Save this as `test-sui-portfolio.js` in the `server` directory:

```js
// test-sui-portfolio.js
const fetch = require("node-fetch");

const address = "0x..."; // Replace with a valid Sui address

fetch(`http://localhost:3001/api/sui-portfolio?address=${address}`)
  .then((res) => res.json())
  .then((data) => {
    console.log("Portfolio:", JSON.stringify(data, null, 2));
  })
  .catch((err) => {
    console.error("Error:", err);
  });
```

Run the test:

```bash
node test-sui-portfolio.js
```

---

## License

MIT
