import { Link } from "@aragon/ui";
import { useEffect, useState } from "react";
import { Web3 } from "../utils/web3";
import { decoders } from "../utils/decoders";

interface DaoItemProps {
  timestamp: Date;
  networkName: string;
  hash: string;
  data: string;
}

const appendAragonId = (name: string) => name + ".aragonid.eth";

function DaoTableRow({ timestamp, networkName, hash, data }: DaoItemProps) {
  const [daoName, setDaoName] = useState("");

  useEffect(() => {
    let cancel = false;

    async function getDaoName() {
      const methodId = data.slice(0, 10);
      const decoder = decoders.get(methodId);
      if (decoder) {
        const decoded = decoder.decodeFunctionData(
          decoder.fragments[0].name,
          data
        );

        if (!cancel) {
          setDaoName(appendAragonId(decoded.id));
        }
      }
    }

    getDaoName();

    return () => {
      cancel = true;
    };
  }, [data]);

  //if (!daoName) return null;

  return (
    <tr>
      <td>{timestamp.toDateString()}</td>
      <td>
        <Link href={Web3.getExplorerUrlByTransaction(networkName, hash)}>
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
