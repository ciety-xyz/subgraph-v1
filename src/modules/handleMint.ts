import { getUniqueId, saveTransaction } from './transaction';
import { Mint, MintSchedule } from '../types/schema';
import { getLogMsg, logging, LogMsg } from '../utils/logger';
import { updateMinterEntityWithMintSchedule } from './minter';
import { getContractTopic } from './topic';
import { PublicMint } from '../types/OmnuumMintManager/OmnuumMintManager';

export function handleMint<T extends PublicMint>(event: T, eventName: string, mintTopic: string): void {
  const mintEntityId = getUniqueId(event);
  const transactionEntity = saveTransaction(event, getContractTopic(event.address), eventName);
  const nftContractAddress = event.params.nftContract.toHexString();
  const mintScheduleGroupId = event.params.groupId.toString();
  const mintScheduleId = `${nftContractAddress}_${mintScheduleGroupId}`;
  const mintQuantity = event.params.quantity.toI32();
  const minterAddress = event.params.minter.toHexString();

  let mintEntity = Mint.load(mintEntityId);
  if (!mintEntity) {
    mintEntity = new Mint(mintEntityId);
  }

  mintEntity.block_number = transactionEntity.block_number;
  mintEntity.transaction = transactionEntity.id;
  mintEntity.nft_contract = nftContractAddress;
  mintEntity.mint_schedule = mintScheduleId;
  mintEntity.topic = mintTopic;
  mintEntity.minter = minterAddress;
  mintEntity.mint_quantity = mintQuantity;
  mintEntity.max_quantity = event.params.maxQuantity.toI32();
  mintEntity.mint_price = event.params.price;

  mintEntity.save();

  // update minted_amount at MintSchedule Entity
  const mintScheduleEntity = MintSchedule.load(mintScheduleId);
  if (mintScheduleEntity) {
    mintScheduleEntity.minted_amount = mintScheduleEntity.minted_amount + mintQuantity;
    mintScheduleEntity.block_number = transactionEntity.block_number;
    mintScheduleEntity.transaction = transactionEntity.id;

    mintScheduleEntity.save();
  } else {
    logging(getLogMsg(LogMsg.___NO_ENTITY), eventName, mintScheduleId, '');
  }

  // update minter Entity with minter_nftContract_mintScheduleGroupId
  updateMinterEntityWithMintSchedule(
    event.params.nftContract,
    minterAddress,
    mintScheduleId,
    mintQuantity,
    transactionEntity.block_number
  );
}
