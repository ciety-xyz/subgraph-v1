import {
  Canceled,
  Approved,
  PaymentReceived,
  Revoked,
  Executed,
  Requested,
  OmnuumWallet,
} from '../types/OmnuumWallet/OmnuumWallet';
import { EtherReceived } from '../types/OmnuumWallet/OmnuumWallet';
import { getUniqueId, saveTransaction } from '../modules/transaction';
import { Payment, WalletRequest } from '../types/schema';
import { EventName, getEventName } from '../modules/event';
import { getContractTopic, getRequestType, RequestType } from '../modules/topic';
import { getLogMsg, logging, LogMsg } from '../utils/logger';

export function handleEtherReceived(event: EtherReceived): void {
  // Payment entity cannot overlap, because ID is unique for every single event when it emitted
  const paymentId = getUniqueId(event);
  const paymentEntity = new Payment(paymentId);

  const eventName = getEventName(EventName.EtherReceived);
  const transactionEntity = saveTransaction(event, getContractTopic(event.address), eventName);
  const paymentValue = event.transaction.value;

  paymentEntity.block_number = transactionEntity.block_number;
  paymentEntity.transaction = transactionEntity.id;
  paymentEntity.sender = event.params.sender.toHexString();
  paymentEntity.value = paymentValue;

  paymentEntity.save();
}

export function handlePaymentReceived(event: PaymentReceived): void {
  // Payment entity cannot overlap, because ID is unique for every single event when it emitted
  const paymentId = getUniqueId(event);
  const paymentEntity = new Payment(paymentId);

  const eventName = getEventName(EventName.PaymentReceived);
  const transactionEntity = saveTransaction(event, getContractTopic(event.address), eventName);

  const topicString = event.params.topic;
  const paymentValue = event.transaction.value;

  paymentEntity.block_number = transactionEntity.block_number;
  paymentEntity.transaction = transactionEntity.id;
  paymentEntity.sender = event.params.sender.toHexString();
  paymentEntity.value = paymentValue;

  paymentEntity.topic = topicString;
  paymentEntity.description = event.params.description;

  paymentEntity.save();
}

export function handleRequested(event: Requested): void {
  // Request ID is a unique value
  const requestId = event.params.requestId;
  const eventName = getEventName(EventName.Requested);
  const transactionEntity = saveTransaction(event, getContractTopic(event.address), eventName);
  const requestType = event.params.requestType;
  const requester = event.params.owner.toHexString();

  const walletRequestEntity = new WalletRequest(requestId.toString());
  walletRequestEntity.block_number = transactionEntity.block_number;
  walletRequestEntity.transaction = transactionEntity.id;
  walletRequestEntity.requester = requester;
  walletRequestEntity.request_type = getRequestType(requestType);

  const walletContract = OmnuumWallet.bind(event.address);
  const request = walletContract.try_requests(requestId);

  if (request.reverted) {
    logging(getLogMsg(LogMsg.___CALL_REVERTED), eventName, event.address.toHexString(), '@query request');
  } else {
    if (requestType == RequestType.Withdraw) {
      walletRequestEntity.withdrawal_amount = request.value.value4;
    }
    if (requestType == RequestType.Add || requestType == RequestType.Change) {
      walletRequestEntity.new_owner_address = request.value.value3.addr.toHexString();
      walletRequestEntity.new_owner_vote = request.value.value3.vote;
    }
    if (requestType == RequestType.Remove || requestType == RequestType.Change) {
      walletRequestEntity.current_owner_address = request.value.value2.addr.toHexString();
      walletRequestEntity.current_owner_vote = request.value.value2.vote;
    }
  }

  walletRequestEntity.voters = [requester];
  walletRequestEntity.votes = request.value.value5.toI32();
  walletRequestEntity.isExecute = request.value.value6;

  walletRequestEntity.save();
}

export function handleApproved(event: Approved): void {
  const requestId = event.params.requestId;
  const eventName = getEventName(EventName.Requested);

  const walletRequestEntity = WalletRequest.load(requestId.toString());
  if (walletRequestEntity) {
    const transactionEntity = saveTransaction(event, getContractTopic(event.address), eventName);
    walletRequestEntity.block_number = transactionEntity.block_number;
    walletRequestEntity.transaction = transactionEntity.id;

    const voters = walletRequestEntity.voters;

    // add new voter to voters array
    voters.push(event.params.owner.toHexString());
    walletRequestEntity.voters = voters;

    const walletContract = OmnuumWallet.bind(event.address);
    const request = walletContract.try_requests(requestId);
    if (request.reverted) {
      logging(getLogMsg(LogMsg.___CALL_REVERTED), eventName, event.address.toHexString(), '@query request');
    } else {
      walletRequestEntity.votes = request.value.value5.toI32();
    }

    walletRequestEntity.save();
  } else {
    logging(getLogMsg(LogMsg.___NO_ENTITY), eventName, event.address.toHexString(), 'no wallet request entity');
  }
}

export function handleRevoked(event: Revoked): void {
  const requestId = event.params.requestId;
  const eventName = getEventName(EventName.Requested);
  const eventAddress = event.address.toHexString();
  const owner = event.params.owner.toHexString();

  const walletRequestEntity = WalletRequest.load(requestId.toString());
  if (walletRequestEntity) {
    const transactionEntity = saveTransaction(event, getContractTopic(event.address), eventName);
    walletRequestEntity.block_number = transactionEntity.block_number;
    walletRequestEntity.transaction = transactionEntity.id;

    const voters = walletRequestEntity.voters;
    // remove existing voter to voters array
    const idx = voters.indexOf(owner);
    if (idx > -1) {
      voters.splice(idx, 1);
      walletRequestEntity.voters = voters;
    } else {
      logging(getLogMsg(LogMsg.___OWNER_NOT_EXIST), eventName, eventAddress, `owner: ${owner}`);
    }

    const walletContract = OmnuumWallet.bind(event.address);
    const request = walletContract.try_requests(requestId);
    if (request.reverted) {
      logging(getLogMsg(LogMsg.___CALL_REVERTED), eventName, eventAddress, '@query request');
    } else {
      walletRequestEntity.votes = request.value.value5.toI32();
    }

    walletRequestEntity.save();
  } else {
    logging(getLogMsg(LogMsg.___NO_ENTITY), eventName, eventAddress, 'no wallet request entity');
  }
}

export function handleExecuted(event: Executed): void {
  const requestId = event.params.requestId;
  const eventName = getEventName(EventName.Requested);
  const eventAddress = event.address.toHexString();
  const walletRequestEntity = WalletRequest.load(requestId.toString());
  if (walletRequestEntity) {
    walletRequestEntity.isExecute = true;
    walletRequestEntity.save();
  } else {
    logging(getLogMsg(LogMsg.___NO_ENTITY), eventName, eventAddress, 'no wallet request entity');
  }
}

export function handleCanceled(event: Canceled): void {
  const requestId = event.params.requestId;
  const eventName = getEventName(EventName.Requested);
  const eventAddress = event.address.toHexString();
  const walletRequestEntity = WalletRequest.load(requestId.toString());
  if (walletRequestEntity) {
    walletRequestEntity.request_type = getRequestType(RequestType.Cancel);
    walletRequestEntity.save();
  } else {
    logging(getLogMsg(LogMsg.___NO_ENTITY), eventName, eventAddress, 'no wallet request entity');
  }
}
