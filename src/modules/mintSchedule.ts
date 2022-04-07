import { BigInt } from '@graphprotocol/graph-ts';
import { saveTransaction } from './transaction';
import { getContractTopic } from './topic';
import { MintSchedule } from '../types/schema';
import { SetTicketSchedule } from '../types/TicketManager/TicketManager';

export function getMintScheduleEntity<T extends SetTicketSchedule>(
  event: T,
  mintTopic: string,
  eventName: string
): MintSchedule {
  // mintScheduleEntityid: nftContractAddress(hex)_scheduleGroupId(dec)"
  const nftContractAddress = event.params.nftContract.toHexString();
  const mintScheduleGroupId = event.params.groupId;
  const transactionEntity = saveTransaction(event, getContractTopic(event.address), eventName);

  const mintScheduleEntityId = `${nftContractAddress}_${mintScheduleGroupId}`;

  let mintScheduleEntity = MintSchedule.load(mintScheduleEntityId);
  if (!mintScheduleEntity) {
    mintScheduleEntity = new MintSchedule(mintScheduleEntityId);
  }

  mintScheduleEntity.block_number = transactionEntity.block_number;
  mintScheduleEntity.transaction = transactionEntity.id;
  mintScheduleEntity.nft_contract = nftContractAddress;
  mintScheduleEntity.topic = mintTopic;
  mintScheduleEntity.group_id = mintScheduleGroupId.toString();
  mintScheduleEntity.end_date = event.params.endDate.toI32();

  mintScheduleEntity.minted_amount = BigInt.zero().toI32();

  return mintScheduleEntity;
}
