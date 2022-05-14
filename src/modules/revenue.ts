import { BigInt } from '@graphprotocol/graph-ts';
import { Contract, Revenue, Transaction } from '../types/schema';

function accumulateRevenueToWalletId(value: BigInt, blockNumber: i32, walletAddress: string): void {
  let revenueEntity = Revenue.load(walletAddress);
  if (!revenueEntity) {
    revenueEntity = new Revenue(walletAddress);
    revenueEntity.contract = walletAddress;
    revenueEntity.value = value;
  } else {
    revenueEntity.value = revenueEntity.value.plus(value);
  }
  revenueEntity.block_number = blockNumber;

  revenueEntity.save();
}

export function handleRevenue(sender: string, value: BigInt, transaction: Transaction, walletAddress: string): void {
  let revenueEntity = Revenue.load(sender);
  if (!revenueEntity) {
    revenueEntity = new Revenue(sender);
    revenueEntity.value = value;

    const contractEntity = Contract.load(sender);
    if (contractEntity) {
      if (contractEntity.topic == 'NFT') {
        revenueEntity.contract = sender;
      }
    }
  } else {
    revenueEntity.value = revenueEntity.value.plus(value);
  }
  revenueEntity.block_number = transaction.block_number;
  revenueEntity.save();
  accumulateRevenueToWalletId(value, transaction.block_number, walletAddress);
}
