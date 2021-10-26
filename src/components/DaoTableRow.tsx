import { Link } from "@aragon/ui";
import { providers, utils } from "ethers";
import { useEffect, useState } from "react";
import { getExplorerUrlByTransaction, networks } from "../networks";

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

interface DaoItemProps {
  rowIndex: number;
  timestamp: Date;
  networkName: string;
  hash: string;
}

const appendAragonId = (name: string) => name + ".aragonid.eth";

function DaoTableRow({ rowIndex, timestamp, networkName, hash }: DaoItemProps) {
  const [daoName, setDaoName] = useState("");

  useEffect(() => {
    let cancel = false;

    async function getDaoName() {
      const network = networks.get(networkName);
      if (!network) return;

      const provider = new providers.JsonRpcProvider(network.rpcUrl);
      const iface = new utils.Interface(abi);

      const sigNewTokenAndInstance = iface.getSighash("newTokenAndInstance");
      const sigNewInstance = iface.getSighash("newInstance");

      const tx = await provider.getTransaction(hash);
      if (tx.data) {
        let functionName;
        if (tx.data.startsWith(sigNewTokenAndInstance)) {
          functionName = "newTokenAndInstance";
        }
        if (tx.data.startsWith(sigNewInstance)) {
          functionName = "newInstance";
        }

        if (functionName) {
          const decoded = iface.decodeFunctionData(functionName, tx.data);

          if (!cancel) {
            setDaoName(appendAragonId(decoded.id));
          }
        }
      }
    }

    getDaoName();

    return () => {
      cancel = true;
    };
  }, [hash, networkName]);

  //if (!daoName) return null;

  return (
    <tr key={rowIndex}>
      <td>{timestamp.toDateString()}</td>
      <td>
        <Link href={getExplorerUrlByTransaction(networkName, hash)}>
          {hash}
        </Link>
      </td>
      <td>
        <span>{daoName}</span>
      </td>
    </tr>
  );
}

export default DaoTableRow;
