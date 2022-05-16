import {
  SetSpecialFeeRate,
  Airdrop,
  PublicMint,
  SetPublicSchedule,
  OwnershipTransferred,
  ChangeFeeRate,
  SetMinFee,
  MintFeePaid,
} from '../types/OmnuumMintManager/OmnuumMintManager';
import { EventName, getEventName } from '../modules/event';
import { getUniqueId, saveTransaction } from '../modules/transaction';
import { getContractTopic, getMintTopic, MintTopic } from '../modules/topic';
import { Mint } from '../types/schema';
import { handleMint } from '../modules/handleMint';
import { ownershipTransfer } from '../modules/ownership';
import { getMintScheduleEntity } from '../modules/mintSchedule';
import { handleNFTContractBalance } from '../modules/nftContract';

export function handleSetPublicSchedule(event: SetPublicSchedule): void {
  const mintScheduleEntity = getMintScheduleEntity(
    event,
    getMintTopic(MintTopic.PUBLIC),
    getEventName(EventName.SetPublicSchedule)
  );

  // For public schedule,
  // base price, mint_supply and mint_limit_per_address parameters exist.
  // Different from the ticket schedule which has parameters inside ticket payload.
  mintScheduleEntity.base_price = event.params.basePrice;
  mintScheduleEntity.mint_supply = event.params.supply.toI32();
  mintScheduleEntity.mint_limit_per_address = event.params.maxMintAtAddress.toI32();
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
  mintEntity.topic = getMintTopic(MintTopic.AIRDROP);
  mintEntity.minter = event.params.receiver.toHexString();
  mintEntity.mint_quantity = event.params.quantity.toI32();

  mintEntity.save();
}

export function handleMintFeePaid(event: MintFeePaid): void {
  handleNFTContractBalance(event, event.params.nftContract, event.params.profit, event.params.mintFee);
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  ownershipTransfer(event);
}

export function handleChangeFeeRate(event: ChangeFeeRate): void {}

export function handleSetMinFee(event: SetMinFee): void {}

export function handleSetSpecialFeeRate(event: SetSpecialFeeRate): void {}
