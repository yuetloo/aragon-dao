import { useCallback, useEffect, useState } from "react";
import { Main, Box, Header, DropDown } from "@aragon/ui";
import { networks, getLogUrl } from "./networks";
import DaoTableRow from "./components/DaoTableRow";

type DaoInfo = {
  hash: string;
  timestamp: Date;
  blockNumber: number;
};

const networkNames = Array.from(networks.keys());

function App() {
  const [result, setResult] = useState<DaoInfo[]>([]);
  const [selectedNetwork, setNetworkIndex] = useState<number>(0);

  useEffect(() => {
    let cancel = false;

    async function getData() {
      const networkType = networkNames[selectedNetwork];
      const network = networks.get(networkType);
      if (!network) return;

      const response = await fetch(getLogUrl(networkType), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const jsonResult = await response.json();

      if (!cancel) {
        setResult(
          jsonResult.result
            .map((res: any, row: number) => {
              const hash = res.transactionHash;
              const timestamp = new Date(parseInt(res.timeStamp) * 1000);
              return { row, hash, timestamp, blockNumber: res.blockNumber };
            })
            .sort((rowA: any, rowB: any) => {
              return rowB.row - rowA.row;
            })
        );
      }
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
                    <DaoTableRow
                      rowIndex={i}
                      hash={res.hash}
                      timestamp={res.timestamp}
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
