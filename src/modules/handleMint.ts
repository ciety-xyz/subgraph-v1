import { getUniqueId, saveTransaction } from './transaction';
import { Contract, Mint, MintSchedule } from '../types/schema';
import { getLogMsg, logging, LogMsg } from '../utils/logger';
import { updateMinterEntityWithMintSchedule } from './minter';
import { getContractTopic } from './topic';
import { OmnuumMintManager, PublicMint } from '../types/OmnuumMintManager/OmnuumMintManager';
import { MINT_MANAGER_TOPIC } from '../utils/constants';
import { Address } from '@graphprotocol/graph-ts';

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

  const mintManagerContractEntity = Contract.load(MINT_MANAGER_TOPIC);
  if (mintManagerContractEntity) {
    const mintManagerAddress = mintManagerContractEntity.address;
    const mintManagerContract = OmnuumMintManager.bind(Address.fromString(mintManagerAddress));
    if (mintManagerContract) {
      const feeRate = mintManagerContract.try_getFeeRate(Address.fromString(nftContractAddress));
      if (feeRate.reverted) {
        logging(getLogMsg(LogMsg.___CALL_REVERTED), eventName, event.address.toHexString(), '@query feeRate');
      } else {
        mintEntity.fee_rate = feeRate.value;
      }
      const minFee = mintManagerContract.try_minFee();
      if (minFee.reverted) {
        logging(getLogMsg(LogMsg.___CALL_REVERTED), eventName, event.address.toHexString(), '@query minFee');
      } else {
        mintEntity.min_fee = minFee.value;
      }
    }
  }

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

  mintEntity.save();
}
