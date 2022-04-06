import { ethereum, log } from '@graphprotocol/graph-ts';
import { Transaction } from '../types/schema';
import { getLogMsg, logging, LogMsg } from '../utils/logger';

export function saveTransaction(event: ethereum.Event, contractTopic: string, eventName: string): Transaction {
  const transactionId = event.transaction.hash.toHexString();
  const eventSelector = `${contractTopic}_${eventName}`;

  let transactionEntity = Transaction.load(transactionId);
  if (!transactionEntity) {
    transactionEntity = new Transaction(transactionId);
    transactionEntity = evolveBaseTransactionInfo(event, transactionEntity);
    transactionEntity.event_selectors = [eventSelector];
    transactionEntity.save();
  } else {
    // If the event selector is duplicated multiple times in the same transaction,
    // the others are ignored and only the value of the log where the first event selector occurred is recorded.
    // If different event selector occurs in the same transaction, the corresponding event selector is pushed into an array.
    if (!transactionEntity.event_selectors.includes(eventSelector)) {
      transactionEntity = evolveBaseTransactionInfo(event, transactionEntity);
      const eventSelectors = transactionEntity.event_selectors;
      eventSelectors.push(eventSelector);
      transactionEntity.event_selectors = eventSelectors;

      transactionEntity.save();
    } else {
      logging(getLogMsg(LogMsg.___DUPLICATED), eventName, transactionId, 'duplicated event selector in the same tx');
    }
  }
  return transactionEntity as Transaction;
}

function evolveBaseTransactionInfo(event: ethereum.Event, transactionEntity: Transaction): Transaction {
  const blockNumber = event.block.number.toU32();
  const timeStamp = event.block.timestamp.toU32();

  transactionEntity.block_number = blockNumber;
  transactionEntity.timestamp = timeStamp;
  transactionEntity.from = event.transaction.from.toHexString();
  const txTo = event.transaction.to;
  if (txTo) {
    transactionEntity.to = txTo.toHexString();
  }
  transactionEntity.value = event.transaction.value;
  transactionEntity.gas_price = event.transaction.gasPrice;

  return transactionEntity;
}

export function getUniqueId(event: ethereum.Event): string {
  return `${event.transaction.hash.toHexString()}_${event.logIndex.toU32()}`;
}
