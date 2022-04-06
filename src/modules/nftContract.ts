import { Contract } from '../types/schema';
import { getLogMsg, logging, LogMsg } from '../utils/logger';

export function updateTotalMintedAmountForNftContract(
  nftContractAddress: string,
  mintQuantity: i32,
  eventName: string,
  transactionId: string,
  blockNumber: i32
): void {
  const contractEntity = Contract.load(nftContractAddress);
  if (contractEntity) {
    // Update total_minted_amount at NFT Contract Entity
    contractEntity.block_number = blockNumber;
    contractEntity.transaction = transactionId;
    contractEntity.total_minted_amount = contractEntity.total_minted_amount + mintQuantity;

    contractEntity.save();
  } else {
    logging(getLogMsg(LogMsg.___NO_ENTITY), eventName, nftContractAddress, '');
  }
}
