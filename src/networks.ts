export const networks = new Map([
  [
    "ArbitrumTestnet",
    {
      rpcUrl: "https://rinkeby.arbitrum.io/rpc",
      explorerUrl: "https://testnet.arbiscan.io",
      apiUrl: "https://api-testnet.arbiscan.io/api",
      apiKey: "4GJTTHSHGA5T1HYR5FPWYF8Q3QEERGK2ZM",
      // FIFSResolvingRegistrar (AragonID)
      aragonIdAddress: "0x9060373BD2Eaf09965E1c6791348941F89C8Bd5a",
      fromBlock: 5601238,
    },
  ],
  [
    "Polygon",
    {
      rpcUrl:
        "https://polygon-mainnet.g.alchemy.com/v2/SY5Q3m-zAgxioTcOuGcAmJGns4JHYtmV",
      explorerUrl: "https://polygonscan.com",
      apiUrl: "https://api.polygonscan.com/api",
      apiKey: "2TQMPNQB5UPFE1IVIW53ZBB1WVXQD6A29P",
      // FIFSResolvingRegistrar (AragonID)
      aragonIdAddress: "0xB1b9fB937A11873380b3B87a1eF8063a66e54822",
      fromBlock: 18617853,
    },
  ],
  [
    "Mumbai",
    {
      rpcUrl:
        "https://polygon-mumbai.g.alchemy.com/v2/hk9vh9U3GZGWC8Un2i0-ICRoOJkCUQg_",
      explorerUrl: "https://mumbai.polygonscan.com",
      apiUrl: "https://api-testnet.polygonscan.com/api",
      apiKey: "2TQMPNQB5UPFE1IVIW53ZBB1WVXQD6A29P",
      // FIFSResolvingRegistrar (AragonID)
      aragonIdAddress: "0xB0CeC6F20Ea617D0CdeFef6521AaD99d21876Ad5",
      fromBlock: 17883970,
    },
  ],
  [
    "Ethereum",
    {
      rpcUrl: "https://mainnet.infura.io/v3/7c338dd2f00a443c906e6f081cf11b07",
      explorerUrl: "https://etherscan.io",
      apiUrl: "https://api.etherscan.io/api",
      apiKey: "HCDV8YBBWDK369IPAA8QMBE2DIEP94CEB7",
      // FIFSResolvingRegistrar (AragonID)
      aragonIdAddress: "0x546aA2EaE2514494EeaDb7bbb35243348983C59d",
      fromBlock: 10000000,
    },
  ],
]);

// topic = ClaimSubdomain
const topic =
  "0xe27a5a369e0d2c5056ccfcbd5f83f145f43350142d42aaf46ff9a9e461d543df";
export function getLogUrl(networkType: string): string {
  const network = networks.get(networkType);

  return network
    ? `${network.apiUrl}?` +
        `module=logs&action=getLogs&fromBlock=${network.fromBlock}` +
        `&address=${network.aragonIdAddress}` +
        `&topic0=${topic}` +
        `&apikey=${network.apiKey}`
    : "";
}

export function getExplorerUrlByTransaction(
  networkType: string,
  txHash: string = ""
): string {
  const network = networks.get(networkType);

  return network ? `${network.explorerUrl}/tx/${txHash}` : "";
}
