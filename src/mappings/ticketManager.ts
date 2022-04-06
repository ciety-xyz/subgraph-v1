import { TicketMint } from '../types/TicketManager/TicketManager';
import { SetTicketSchedule } from '../types/TicketManager/TicketManager';
import { MintSchedule } from '../types/schema';
import { EventName, getEventName } from '../modules/event';
import { saveTransaction } from '../modules/transaction';
import { getContractTopic, getMintTopic, MintTopic } from '../modules/topic';
import { BigInt } from '@graphprotocol/graph-ts';
import { handleMint } from '../modules/handleMint';

export function handleSetTicketSchedule(event: SetTicketSchedule): void {
  // mintScheduleEntityid: nftContractAddress(hex)_scheduleGroupId(dec)"
  const nftContractAddress = event.params.nftContract.toHexString();
  const mintScheduleGroupId = event.params.groupId;
  const eventName = getEventName(EventName.SetTicketSchedule);
  const transactionEntity = saveTransaction(event, getContractTopic(event.address), eventName);

  const mintScheduleEntityId = `${nftContractAddress}_${mintScheduleGroupId}`;

  let mintScheduleEntity = MintSchedule.load(mintScheduleEntityId);
  if (!mintScheduleEntity) {
    mintScheduleEntity = new MintSchedule(mintScheduleEntityId);
  }

  mintScheduleEntity.block_number = transactionEntity.block_number;
  mintScheduleEntity.transaction = transactionEntity.id;
  mintScheduleEntity.nft_contract = nftContractAddress;
  mintScheduleEntity.topic = getMintTopic(MintTopic.TICKET);
  mintScheduleEntity.group_id = mintScheduleGroupId.toString();
  mintScheduleEntity.end_date = event.params.endDate.toI32();
  // no base price, mint_supply and mint_limit_per_address for ticket.
  // Because it's inside ticket payload, so they can be different for each ticket.
  mintScheduleEntity.minted_amount = BigInt.zero().toI32();

  mintScheduleEntity.save();
}

export function handleTicketMint(event: TicketMint): void {
  handleMint(event, getEventName(EventName.TicketMint), getMintTopic(MintTopic.TICKET));
}
