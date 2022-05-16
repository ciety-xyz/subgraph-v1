import { Contract } from '../types/schema';
import { getLogMsg, logging, LogMsg } from '../utils/logger';
import { BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { EventName, getEventName } from './event';
import { saveTransaction } from './transaction';
import { getContractTopic } from './topic';

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

export function handleNFTContractBalance(event: ethereum.Event, nftAddress: Bytes, profit: BigInt, fee: BigInt): void {
  const nftContractAddress = nftAddress.toHexString();
  const contractEntity = Contract.load(nftContractAddress);
  const eventName = getEventName(EventName.MintFeePaid);

  if (contractEntity) {
    const transactionEntity = saveTransaction(event, getContractTopic(nftAddress), eventName);
    contractEntity.block_number = transactionEntity.block_number;
    contractEntity.transaction = transactionEntity.id;
    contractEntity.profit = contractEntity.profit.plus(profit);
    contractEntity.feePaid = contractEntity.feePaid.plus(fee);

    contractEntity.save();
  } else {
    logging(getLogMsg(LogMsg.___NO_ENTITY), eventName, nftContractAddress, '');
  }
}
