import { useCallback, useEffect, useState } from "react";
import { Main, Box, Header, DropDown } from "@aragon/ui";
import { networks } from "./networks";
import DaoTableRow from "./components/DaoTableRow";
import { Web3 } from "./utils/web3";

type DaoInfo = {
  hash: string;
  timestamp: Date;
  blockNumber: number;
  data: string;
};

const networkNames = Array.from(networks.keys());
const batchSize = 1000;

function App() {
  const [result, setResult] = useState<DaoInfo[]>([]);
  const [selectedNetwork, setNetworkIndex] = useState<number>(0);

  useEffect(() => {
    let cancel = false;

    async function getData() {
      const networkType = networkNames[selectedNetwork];
      const network = networks.get(networkType);
      if (!network) return;

      const web3 = new Web3(networkType);
      setResult([]);
      let skip = 0;
      let loop = true;
      do {
        const batchResult = await web3.getDomains(batchSize, skip);
        skip += batchSize;

        if (batchResult.length === 0) {
          break;
        }
        if (cancel) {
          break;
        }

        setResult((currentResult) => currentResult.concat(batchResult));
      } while (loop);
    }

    getData();

    return () => {
      cancel = true;
    };
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
                <tr key="header">
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
                    <DaoTableRow
                      key={i}
                      hash={res.hash}
                      timestamp={res.timestamp}
                      data={res.data}
                      networkName={networkNames[selectedNetwork]}
                    />
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
