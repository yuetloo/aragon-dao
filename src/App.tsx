import { useCallback, useEffect, useState } from "react";
import { Main, Box, Header, Link, DropDown } from "@aragon/ui";
import { providers, utils } from "ethers";
import { networks, getLogUrl, getExplorerUrlByTransaction } from "./networks";

const abi = [
  `function newTokenAndInstance(
  string _tokenName,
  string _tokenSymbol,
  string id,
  address[] _holders,
  uint256[] _stakes,
  uint64[3] _votingSettings,
  uint64 _financePeriod,
  bool _useAgentAsVault
)`,
  `function newInstance(
  string id,
  address[] memory _holders,
  uint256[] memory _stakes,
  uint64[3] memory _votingSettings,
  uint64 _financePeriod,
  bool _useAgentAsVault
)`,
];

const appendAragonId = (name: string) => name + ".aragonid.eth";

type DaoInfo = {
  name?: string;
  hash: string;
  timestamp: Date;
  blockNumber: number;
};

const networkNames = Array.from(networks.keys());

function App() {
  const [result, setResult] = useState<DaoInfo[]>([]);
  const [selectedNetwork, setNetworkIndex] = useState<number>(0);

  useEffect(() => {
    async function getData() {
      const networkType = networkNames[selectedNetwork];
      const network = networks.get(networkType);
      if (!network) return;

      const provider = new providers.JsonRpcProvider(network.rpcUrl);
      const iface = new utils.Interface(abi);
      const response = await fetch(getLogUrl(networkType), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const sigNewTokenAndInstance = iface.getSighash("newTokenAndInstance");
      const sigNewInstance = iface.getSighash("newInstance");

      const jsonResult = await response.json();
      const names: DaoInfo[] = await Promise.all(
        jsonResult.result.map(async (res: any) => {
          const hash = res.transactionHash;
          const timestamp = new Date(parseInt(res.timeStamp) * 1000);
          const tx = await provider.getTransaction(hash);
          if (tx.data) {
            if (tx.data.startsWith(sigNewTokenAndInstance)) {
              const decoded = iface.decodeFunctionData(
                "newTokenAndInstance",
                tx.data
              );
              return { hash, name: appendAragonId(decoded.id), timestamp };
            }

            if (tx.data.startsWith(sigNewInstance)) {
              const decoded = iface.decodeFunctionData("newInstance", tx.data);
              return { hash, name: appendAragonId(decoded.id), timestamp };
            }
          }
          return { hash, timestamp, blockNumber: parseInt(res.blockNumber) };
        })
      );

      setResult(names.filter(({ name }) => Boolean(name)));
    }

    getData();
  }, [selectedNetwork]);

  const handleNetworkChange = useCallback((index: number) => {
    setNetworkIndex(index);
    setResult([]);
  }, []);

  return (
    <div className="scroll-view-container">
      <div className="scroll-view">
        <Main scrollView={true}>
          <Header
            primary="Aragon DAO"
            secondary={
              <DropDown
                placeholder="ArbitrumTestnet"
                items={networkNames}
                selected={selectedNetwork}
                onChange={handleNetworkChange}
              />
            }
          />
          <div>total: {result.length}</div>
          <Box>
            <table>
              <tbody>
                <tr>
                  <td>
                    <b>Date</b>
                  </td>
                  <td>
                    <b>TX hash</b>
                  </td>
                  <td>
                    <b>ENS name</b>
                  </td>
                </tr>
                {result.map((res, i) => {
                  return (
                    <tr key={i}>
                      <td>{res.timestamp?.toDateString()}</td>
                      <td>
                        <Link
                          href={getExplorerUrlByTransaction(
                            networkNames[selectedNetwork],
                            res.hash
                          )}
                        >
                          {res.hash}
                        </Link>
                      </td>
                      <td>
                        <span> {res.name ? res.name : ""}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Box>
        </Main>
      </div>
    </div>
  );
}

export default App;
