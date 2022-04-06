import { Canceled, Approved, PaymentReceived, Revoked, Executed, Requested } from '../types/OmnuumWallet/OmnuumWallet';
import { EtherReceived } from '../types/OmnuumWallet/OmnuumWallet';
import { getUniqueId, saveTransaction } from '../modules/transaction';
import { Payment } from '../types/schema';
import { EventName, getEventName } from '../modules/event';
import { getContractTopic } from '../modules/topic';
import { log } from '@graphprotocol/graph-ts';

export function handleEtherReceived(event: EtherReceived): void {
  // Payment entity cannot overlap, because ID is unique for every single event when it emitted
  const paymentId = getUniqueId(event);
  const paymentEntity = new Payment(paymentId);
  const eventName = getEventName(EventName.EtherReceived);
  const transactionEntity = saveTransaction(event, getContractTopic(event.address), eventName);

  paymentEntity.block_number = transactionEntity.block_number;
  paymentEntity.transaction = transactionEntity.id;
  paymentEntity.sender = event.params.sender.toHexString();
  paymentEntity.value = event.transaction.value;

  paymentEntity.save();
}

export function handlePaymentReceived(event: PaymentReceived): void {
  // Payment entity cannot overlap, because ID is unique for every single event when it emitted
  const paymentId = getUniqueId(event);
  const paymentEntity = new Payment(paymentId);

  const eventName = getEventName(EventName.PaymentReceived);
  const transactionEntity = saveTransaction(event, getContractTopic(event.address), eventName);
  const topicString = event.params.topic;
  log.debug('___EVENT_PARAM_TOPIC {}', [event.params.topic]);
  const paymentValue = event.transaction.value;

  paymentEntity.block_number = transactionEntity.block_number;
  paymentEntity.transaction = transactionEntity.id;
  paymentEntity.sender = event.params.sender.toHexString();
  paymentEntity.value = paymentValue;
  paymentEntity.topic = topicString;
  paymentEntity.description = event.params.description;

  paymentEntity.save();

  if (topicString.includes('DEPLOY_COL')) {
    // The person who sent the transaction is the same as the project owner because only the owner can pay the fee for nft contract deployment
    const projectOwnerAddress = event.transaction.from.toHexString();
    let paymentEntity = Payment.load(projectOwnerAddress);
    if (!paymentEntity) {
      paymentEntity = new Payment(projectOwnerAddress);
    }

    // When the nft contract is deployed, the payment entity is created once more with the project owner ID, and the transaction data is not saved.
    paymentEntity.block_number = transactionEntity.block_number;
    paymentEntity.sender = projectOwnerAddress;
    paymentEntity.value = paymentValue;
    paymentEntity.topic = topicString;
    paymentEntity.description = event.params.description;

    paymentEntity.save();
  }
}

export function handleRequested(event: Requested): void {}

export function handleApproved(event: Approved): void {}

export function handleCanceled(event: Canceled): void {}

export function handleRevoked(event: Revoked): void {}

export function handleExecuted(event: Executed): void {}
