import { ethers } from "ethers";
import { networks } from "../networks";

const subgraphQuery = (first: number, skip: number) => ({
  query: `
  {
    domains(first: ${first}, skip: ${skip}, orderBy: blockNumber, orderDirection: desc)
    {
      id
      name
      txInput
      blockNumber
      createdAt
    }
  }
  `,
});

export class Web3 {
  networkType: string;
  network: any;

  constructor(networkType: string) {
    this.networkType = networkType;
    this.network = networks.get(networkType);
  }

  static getExplorerUrlByTransaction(
    networkType: string,
    txHash: string = ""
  ): string {
    const network = networks.get(networkType);

    return network ? `${network.explorerUrl}/tx/${txHash}` : "";
  }

  getDomains(first: number, skip: number) {
    return ethers.utils
      .fetchJson(
        this.network.subgraphUrl,
        JSON.stringify(subgraphQuery(first, skip))
      )
      .then((res) => {
        if (!res.data?.domains) return [];

        return res.data.domains.map((domain: any) => {
          return {
            blockNumber: domain.blockNumber,
            hash: domain.id,
            data: domain.txInput,
            name: domain.name,
            timestamp: new Date(parseInt(domain.createdAt) * 1000),
          };
        });
      });
  }

  getLatestBlock() {
    const provider = new ethers.providers.JsonRpcProvider(this.network.rpcUrl);
    return provider.getBlockNumber();
  }
}
