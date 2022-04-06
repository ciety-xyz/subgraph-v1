import {
  SetSpecialFeeRate,
  Airdrop,
  PublicMint,
  SetPublicSchedule,
  OwnershipTransferred,
  ChangeFeeRate,
  SetMinFee,
} from '../types/OmnuumMintManager/OmnuumMintManager';
import { EventName, getEventName } from '../modules/event';
import { getUniqueId, saveTransaction } from '../modules/transaction';
import { getContractTopic, getMintTopic, MintTopic } from '../modules/topic';
import { Mint, MintSchedule } from '../types/schema';
import { BigInt } from '@graphprotocol/graph-ts';
import { handleMint } from '../modules/handleMint';
import { ownershipTransfer } from '../modules/ownership';

export function handleSetPublicSchedule(event: SetPublicSchedule): void {
  // mintScheduleEntityid: nftContractAddress(hex)_scheduleGroupId(dec)"
  const nftContractAddress = event.params.nftContract.toHexString();
  const mintScheduleGroupId = event.params.groupId;
  const eventName = getEventName(EventName.SetPublicSchedule);
  const transactionEntity = saveTransaction(event, getContractTopic(event.address), eventName);

  const mintScheduleEntityId = `${nftContractAddress}_${mintScheduleGroupId}`;

  let mintScheduleEntity = MintSchedule.load(mintScheduleEntityId);
  if (!mintScheduleEntity) {
    mintScheduleEntity = new MintSchedule(mintScheduleEntityId);
  }

  mintScheduleEntity.block_number = transactionEntity.block_number;
  mintScheduleEntity.transaction = transactionEntity.id;
  mintScheduleEntity.nft_contract = nftContractAddress;
  mintScheduleEntity.topic = getMintTopic(MintTopic.PUBLIC);
  mintScheduleEntity.group_id = mintScheduleGroupId.toString();
  mintScheduleEntity.end_date = event.params.endDate.toI32();
  mintScheduleEntity.base_price = event.params.basePrice;
  mintScheduleEntity.mint_supply = event.params.supply.toI32();
  mintScheduleEntity.mint_limit_per_address = event.params.maxMintAtAddress.toI32();
  mintScheduleEntity.minted_amount = BigInt.zero().toI32();

  mintScheduleEntity.save();
}

export function handlePublicMint(event: PublicMint): void {
  handleMint(event, getEventName(EventName.PublicMint), getMintTopic(MintTopic.PUBLIC));
}

export function handleAirdrop(event: Airdrop): void {
  const mintEntityId = getUniqueId(event);
  const eventName = getEventName(EventName.Airdrop);
  const transactionEntity = saveTransaction(event, getContractTopic(event.address), eventName);
  const nftContractAddress = event.params.nftContract.toHexString();

  let mintEntity = Mint.load(mintEntityId);
  if (!mintEntity) {
    mintEntity = new Mint(mintEntityId);
  }

  mintEntity.block_number = transactionEntity.block_number;
  mintEntity.transaction = transactionEntity.id;
  mintEntity.nft_contract = nftContractAddress;
  // no mint Schedule, max quantity, price for Airdrop
  mintEntity.topic = getMintTopic(MintTopic.AIRDROP);
  mintEntity.minter = event.params.receiver.toHexString();
  mintEntity.mint_quantity = event.params.quantity.toI32();

  mintEntity.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  ownershipTransfer(event);
}

export function handleChangeFeeRate(event: ChangeFeeRate): void {}

export function handleSetMinFee(event: SetMinFee): void {}

export function handleSetSpecialFeeRate(event: SetSpecialFeeRate): void {}
