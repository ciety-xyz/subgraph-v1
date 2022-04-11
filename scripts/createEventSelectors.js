import { filter, flatMap, object, go, join, map } from 'fxjs';
import { readFileSync, writeFileSync } from 'fs';

const CONTRACT_TOPICS = {
  OmnuumVRFManager: 'VRF',
  OmnuumNFT1155: 'NFT',
  SenderVerifier: 'VERIFIER',
  TicketManager: 'TICKET',
  OmnuumMintManager: 'MINTMANAGER',
  OmnuumExchange: 'EXCHANGE',
  OmnuumWallet: 'WALLET',
  RevealManager: 'REVEAL',
  OmnuumCAManager: 'CAMANAGER',
  NftFactory: 'NFTFACTORY',
};

(async () => {
  const targetAbis = Object.keys(CONTRACT_TOPICS);

  const res = go(
    targetAbis,
    map((abiName) => {
      return [
        abiName,
        go(
          JSON.parse(readFileSync(`./abis/${abiName}.json`, 'utf8')),
          filter((item) => item.type === 'event'),
          map((item) => `${CONTRACT_TOPICS[abiName]}_${item.name}`)
        ),
      ];
    }),
    object
  );

  writeFileSync('./eventSelectors.json', JSON.stringify(res), 'utf8');
})();
