import { BigInt } from '@graphprotocol/graph-ts';
import { Contract, WalletProfit, Transaction } from '../types/schema';

function accumulateProfitToWalletId(value: BigInt, blockNumber: i32, walletAddress: string): void {
  let walletProfitEntity = WalletProfit.load(walletAddress);
  if (!walletProfitEntity) {
    walletProfitEntity = new WalletProfit(walletAddress);
    walletProfitEntity.contract = walletAddress;
    walletProfitEntity.value = value;
  } else {
    walletProfitEntity.value = walletProfitEntity.value.plus(value);
  }
  walletProfitEntity.block_number = blockNumber;

  walletProfitEntity.save();
}

export function handleWalletProfit(
  target: string,
  value: BigInt,
  transaction: Transaction,
  walletAddress: string
): void {
  let walletProfitEntity = WalletProfit.load(target);
  if (!walletProfitEntity) {
    walletProfitEntity = new WalletProfit(target);
    walletProfitEntity.value = value.neg();

    const contractEntity = Contract.load(target);
    if (contractEntity) {
      walletProfitEntity.contract = target;
    }
  } else {
    walletProfitEntity.value = walletProfitEntity.value.minus(value);
  }
  walletProfitEntity.block_number = transaction.block_number;
  walletProfitEntity.save();
  accumulateProfitToWalletId(value, transaction.block_number, walletAddress);
}
