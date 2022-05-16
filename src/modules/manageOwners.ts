import { Owner } from '../types/schema';
import { ADDRESS_ZERO } from '../utils/constants';
import { getLogMsg, logging, LogMsg } from '../utils/logger';

export function manageOwner(
  from: string,
  to: string,
  nftContract: string,
  tokenId: string,
  transactionId: string,
  block_number: i32
): void {
  const nftId = `${nftContract}_${tokenId}`;

  let toOwnerEntity = Owner.load(to);
  if (!toOwnerEntity) {
    toOwnerEntity = new Owner(to);
    toOwnerEntity.mintCount = 0;
    toOwnerEntity.sendCount = 0;
    toOwnerEntity.receiveCount = 0;
  }

  // Manage NFTs array
  const toNFTs = toOwnerEntity.nfts;
  if (toNFTs.indexOf(nftId) == -1) {
    toNFTs.push(nftId);
    toOwnerEntity.nfts = toNFTs;
  } else {
    logging(getLogMsg(LogMsg.___DUPLICATED), 'Transfer', nftContract, 'NFT Transfer to Self');
  }

  if (from == ADDRESS_ZERO) {
    // NFT mint
    const mintTx = toOwnerEntity.mintTransactions;
    mintTx.push(transactionId);
    toOwnerEntity.mintTransactions = mintTx;
    toOwnerEntity.mintCount++;
  } else {
    // NFT transaction from/to
    const receiveTx = toOwnerEntity.receiveTransactions;
    receiveTx.push(transactionId);
    toOwnerEntity.receiveTransactions = receiveTx;
    toOwnerEntity.receiveCount++;

    const fromOwnerEntity = Owner.load(from);

    if (fromOwnerEntity) {
      const sendTx = fromOwnerEntity.sendTransactions;
      sendTx.push(transactionId);
      fromOwnerEntity.sendTransactions = sendTx;

      const fromNFTs = fromOwnerEntity.nfts;
      if (fromNFTs) {
        const idx = fromNFTs.indexOf(nftId);
        if (idx > -1) {
          fromNFTs.splice(idx, 1);
          fromOwnerEntity.nfts = fromNFTs;
        }
      }
      fromOwnerEntity.sendCount++;
      fromOwnerEntity.block_number = block_number;
      fromOwnerEntity.save();
    } else {
      logging(getLogMsg(LogMsg.___NO_ENTITY), 'Transfer', nftContract, 'Send NFT, but does not have');
    }
  }
  toOwnerEntity.block_number = block_number;
  toOwnerEntity.save();
}
