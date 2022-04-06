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
import { Contract, Mint, MintSchedule } from '../types/schema';
import { BigInt } from '@graphprotocol/graph-ts';
import { getLogMsg, logging, LogMsg } from '../utils/logger';
import { updateMinterEntityWithMintSchedule } from '../modules/minter';
import { handleMint } from '../modules/handleMint';

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

  // const mintEntityId = getUniqueId(event);
  // const eventName = getEventName(EventName.PublicMint);
  // const transactionEntity = saveTransaction(event, getContractTopic(event.address), eventName);
  // const nftContractAddress = event.params.nftContract.toHexString();
  // const mintScheduleGroupId = event.params.groupId.toString();
  // const mintScheduleId = `${nftContractAddress}_${mintScheduleGroupId}`;
  // const mintQuantity = event.params.quantity.toI32();
  // const minterAddress = event.params.minter.toHexString();
  //
  // let mintEntity = Mint.load(mintEntityId);
  // if (!mintEntity) {
  //   mintEntity = new Mint(mintEntityId);
  // }
  //
  // mintEntity.block_number = transactionEntity.block_number;
  // mintEntity.transaction = transactionEntity.id;
  // mintEntity.nft_contract = nftContractAddress;
  // mintEntity.mint_schedule = mintScheduleId;
  // mintEntity.topic = getMintTopic(MintTopic.PUBLIC);
  // mintEntity.minter = minterAddress;
  // mintEntity.mint_quantity = mintQuantity;
  // mintEntity.max_quantity = event.params.maxQuantity.toI32();
  // mintEntity.mint_price = event.params.price;
  //
  // mintEntity.save();
  //
  // // update minted_amount at MintSchedule Entity
  // const mintScheduleEntity = MintSchedule.load(mintScheduleId);
  // if (mintScheduleEntity) {
  //   mintScheduleEntity.minted_amount = mintScheduleEntity.minted_amount + mintQuantity;
  //   mintScheduleEntity.block_number = transactionEntity.block_number;
  //   mintScheduleEntity.transaction = transactionEntity.id;
  //
  //   mintScheduleEntity.save();
  // } else {
  //   logging(getLogMsg(LogMsg.___NO_ENTITY), eventName, mintScheduleId, '');
  // }
  //
  // // update minter Entity with minter_nftContract_mintScheduleGroupId
  // updateMinterEntityWithMintSchedule(minterAddress, mintScheduleId, mintQuantity, transactionEntity.block_number);
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
  const contractEntityId = event.address.toHexString();

  const contractEntity = Contract.load(contractEntityId);
  const eventName = getEventName(EventName.OwnershipTransferred);
  if (contractEntity) {
    if (contractEntity.owner === event.params.previousOwner.toHexString()) {
      const transactionEntity = saveTransaction(event, getContractTopic(event.address), eventName);
      contractEntity.block_number = transactionEntity.block_number;
      contractEntity.transaction = transactionEntity.id;
      contractEntity.owner = event.params.newOwner.toHexString();
      contractEntity.is_owner_changed = true;

      contractEntity.save();
    } else {
      logging(getLogMsg(LogMsg.___DIFF_OWNER), eventName, contractEntityId, '');
    }
  } else {
    logging(getLogMsg(LogMsg.___NO_ENTITY), eventName, contractEntityId, '');
  }
}

export function handleChangeFeeRate(event: ChangeFeeRate): void {}

export function handleSetMinFee(event: SetMinFee): void {}

export function handleSetSpecialFeeRate(event: SetSpecialFeeRate): void {}
