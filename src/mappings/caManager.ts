import { log, BigInt } from '@graphprotocol/graph-ts';
import {
  ContractRegistered,
  ContractRemoved,
  OwnershipTransferred,
  RoleAdded,
  RoleRemoved,
} from '../types/OmnuumCAManager/OmnuumCAManager';
import { Contract, ContractRole } from '../types/schema';

import { saveTransaction } from '../modules/transaction';
import { getContractTopic } from '../modules/topic';
import { EventName, getEventName } from '../modules/event';
import { getLogMsg, logging, LogMsg } from '../utils/logger';
import { ownershipTransfer } from '../modules/ownership';

export function handleContractRegistered(event: ContractRegistered): void {
  const contractEntityId = event.params.managerContract.toHexString();

  let contractEntity = Contract.load(contractEntityId);
  if (!contractEntity) {
    contractEntity = new Contract(contractEntityId);
    log.debug('DEBUG__manager_contract_registration address: {}', [contractEntityId]);
  }

  // The transaction entity should store a contract topic where the event was triggered in which contract.
  // This topic can be retrieved by loading Contract Entity for the contract address where the event occurred.
  // Since CA Manager is the contract itself that manages the contract, it has no choice but to register the contract topic with a constant value.
  const transactionEntity = saveTransaction(event, 'CAMANAGER', getEventName(EventName.ContractRegistered));

  // In the contract entity, the topic entered as an argument value when the manager contract is registered should be stored as it is.
  contractEntity.block_number = transactionEntity.block_number;
  contractEntity.transaction = transactionEntity.id;
  contractEntity.owner = event.transaction.from.toHexString();
  contractEntity.topic = event.params.topic;
  contractEntity.is_removed = false;
  contractEntity.is_owner_changed = false;
  contractEntity.profit = BigInt.zero();
  contractEntity.fee_paid = BigInt.zero();
  contractEntity.withdrawal = BigInt.zero();

  contractEntity.save();
}

export function handleContractRemoved(event: ContractRemoved): void {
  const contractEntityId = event.params.managerContract.toHexString();

  const contractEntity = Contract.load(contractEntityId);
  const eventName = getEventName(EventName.ContractRemoved);

  if (contractEntity) {
    const transactionEntity = saveTransaction(event, getContractTopic(event.address), eventName);
    contractEntity.block_number = transactionEntity.block_number;
    contractEntity.transaction = transactionEntity.id;
    contractEntity.is_removed = true;

    contractEntity.save();
  } else {
    logging(getLogMsg(LogMsg.___NO_ENTITY), eventName, contractEntityId, '');
  }
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  ownershipTransfer(event);
}

export function handleRoleAdded(event: RoleAdded): void {
  const contractAddress = event.params.ca.toHexString();
  const eventName = getEventName(EventName.RoleAdded);

  let contractRoleEntity = ContractRole.load(contractAddress);
  const transactionEntity = saveTransaction(event, getContractTopic(event.address), eventName);
  const newRole = event.params.role;

  if (!contractRoleEntity) {
    contractRoleEntity = new ContractRole(contractAddress);
    contractRoleEntity.role = [newRole];
    const contractEntity = Contract.load(contractAddress);
    if (contractEntity) {
      contractRoleEntity.contract = contractEntity.id;
    } else {
      logging(getLogMsg(LogMsg.___NO_ENTITY), eventName, contractAddress, 'add role, but no contract registered');
    }
  } else {
    const contractRoles = contractRoleEntity.role;
    contractRoles.push(newRole);
    contractRoleEntity.role = contractRoles;
  }
  contractRoleEntity.block_number = transactionEntity.block_number;
  contractRoleEntity.transaction = transactionEntity.id;
  contractRoleEntity.save();
}

export function handleRoleRemoved(event: RoleRemoved): void {
  const contractAddress = event.params.ca.toHexString();
  const eventName = getEventName(EventName.RoleRemoved);
  const removalRole = event.params.role;

  const contractRoleEntity = ContractRole.load(contractAddress);

  if (contractRoleEntity) {
    const contractRoles = contractRoleEntity.role;
    const idx = contractRoles.indexOf(removalRole);
    if (idx > -1) {
      const transactionEntity = saveTransaction(event, getContractTopic(event.address), eventName);
      contractRoleEntity.block_number = transactionEntity.block_number;
      contractRoleEntity.transaction = transactionEntity.id;
      contractRoles.splice(idx, 1);
      contractRoleEntity.role = contractRoles;

      contractRoleEntity.save();
    } else {
      logging(getLogMsg(LogMsg.___NO_ROLE), eventName, contractAddress, 'non-existence role');
    }
  } else {
    logging(getLogMsg(LogMsg.___NO_ENTITY), eventName, contractAddress, '');
  }
}
