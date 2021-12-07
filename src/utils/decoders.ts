import { ethers } from "ethers";

export const decoders = new Map([
  [
    "0x350cbe71",
    new ethers.utils.Interface([
      "function finalizeInstance(string id, uint256[2] _virtualSupplies, uint256[2] _virtualBalances, uint256[2] _slippages, uint256 _rateDAI, uint256 _floorDAI)",
    ]),
  ],
  [
    "0x8a29ac04",
    new ethers.utils.Interface([
      "function newTokenAndInstance(string _tokenName, string _tokenSymbol, string id, address[] _members, uint64[3] _votingSettings, uint64 _financePeriod, bool _useAgentAsVault)",
    ]),
  ],
  [
    "0x885b48e7",
    new ethers.utils.Interface([
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
    ]),
  ],
  [
    "0x0eb8e519",
    new ethers.utils.Interface([
      `function newInstance(
    string id,
    address[] memory _holders,
    uint256[] memory _stakes,
    uint64[3] memory _votingSettings,
    uint64 _financePeriod,
    bool _useAgentAsVault
  )`,
    ]),
  ],
  [
    "0xa0fd20de",
    new ethers.utils.Interface([
      "function newInstance(string id, address[] signers, uint256 neededSignatures)",
    ]),
  ],
]);
