import { useEffect, useState } from 'react';
import { Main, Box, Header, TransactionBadge } from '@aragon/ui';
import { providers, utils } from 'ethers';

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
)`]

// topic = ClaimSubdomain
const topic = '0xe27a5a369e0d2c5056ccfcbd5f83f145f43350142d42aaf46ff9a9e461d543df'
// FIFSResolvingRegistrar (AragonID)
const address = '0xB1b9fB937A11873380b3B87a1eF8063a66e54822'
const GETLOG_URL = 'https://api.polygonscan.com/api?' +
            'module=logs&action=getLogs&fromBlock=186100' + 
            `&address=${address}` +
            `&topic0=${topic}` + 
            `&apikey=2TQMPNQB5UPFE1IVIW53ZBB1WVXQD6A29P`;


const appendAragonId = (name:string) => name + '.aragonid.eth'

type DaoInfo = {
  name?: string
  hash?: string
}

function App() {
  const [result, setResult] = useState<DaoInfo[]>([])
  
  
  useEffect(() => {
    async function getData() {
      const provider = new providers.AlchemyProvider(137)
      const iface = new utils.Interface(abi)
      const response = await fetch(GETLOG_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const sigNewTokenAndInstance = iface.getSighash('newTokenAndInstance');
      const sigNewInstance = iface.getSighash('newInstance');

      const jsonResult = await response.json();
      console.log('respnse', jsonResult.result.length);
      const names: DaoInfo[] = await Promise.all(jsonResult.result.map(async (res: any) => {
        const hash = res.transactionHash;

        const tx = await provider.getTransaction(hash)
        if(tx.data)
        {
          if( tx.data.startsWith(sigNewTokenAndInstance)) {
            const decoded = iface.decodeFunctionData("newTokenAndInstance", tx.data);
            return { hash, name: appendAragonId(decoded.id) }
          }
          
          if( tx.data.startsWith(sigNewInstance)) {
            const decoded = iface.decodeFunctionData("newInstance", tx.data);
            return { hash, name: appendAragonId(decoded.id) }
          }
        }
        return { hash };
      }))

      setResult(names);
    }

    getData()
  
  }, [])
  

  return (
    <div className="scroll-view-container">
      <div className="scroll-view">
        <Main scrollView={true}>
          <Header primary="Aragon DAO (Polygon)" />
          <div>total: {result.length}</div>
          <Box>
          <table>
            <tr><td><b>TX hash</b></td><td><b>ENS name</b></td></tr>
            {
              
              result.map((res, i) => {
                return (
                  <tr key={i}>
                  <td><TransactionBadge shorten={false} networkType='matic' transaction={res.hash} /></td>
                  <td><span> {res.name? res.name : ''}</span></td>
                  </tr>
                )
              })  
            }
            </table>
          </Box>
        </Main>
      </div>
    </div>
  );
}



export default App;
