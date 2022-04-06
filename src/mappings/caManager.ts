import { BigInt, log } from '@graphprotocol/graph-ts';
import {
  ManagerContractRegistered,
  ManagerContractRemoved,
  NftContractRegistered,
  OwnershipTransferred,
  RoleAdded,
  RoleRemoved,
} from '../types/OmnuumCAManager/OmnuumCAManager';
import { Contract, ContractRole, Payment } from '../types/schema';
import { OmnuumNFT1155 as NftTemplate } from '../types/templates';
import { OmnuumNFT1155 as NftContract } from '../types/templates/OmnuumNFT1155/OmnuumNFT1155';

import { saveTransaction } from '../modules/transaction';
import { getContractTopic } from '../modules/topic';
import { EventName, getEventName } from '../modules/event';
import { getLogMsg, logging, LogMsg } from '../utils/logger';
import { ownershipTransfer } from '../modules/ownership';

export function handleManagerContractRegistered(event: ManagerContractRegistered): void {
  const contractEntityId = event.params.managerContract.toHexString();

  let contractEntity = Contract.load(contractEntityId);
  if (!contractEntity) {
    contractEntity = new Contract(contractEntityId);
    log.debug('DEBUG__manager_contract_registration address: {}', [contractEntityId]);
  }

  // The transaction entity should store a contract topic where the event was triggered in which contract.
  // This topic can be retrieved by loading Contract Entity for the contract address where the event occurred.
  // Since CA Manager is the contract itself that manages the contract, it has no choice but to register the contract topic with a constant value.
  const transactionEntity = saveTransaction(event, 'CAMANAGER', getEventName(EventName.ManagerContractRegistered));

  // In the contract entity, the topic entered as an argument value when the manager contract is registered should be stored as it is.
  contractEntity.block_number = transactionEntity.block_number;
  contractEntity.transaction = transactionEntity.id;
  contractEntity.owner = event.transaction.from.toHexString();
  contractEntity.topic = event.params.topic;
  contractEntity.is_removed = false;
  contractEntity.is_owner_changed = false;

  contractEntity.save();
}

export function handleManagerContractRemoved(event: ManagerContractRemoved): void {
  const contractEntityId = event.params.managerContract.toHexString();

  const contractEntity = Contract.load(contractEntityId);
  const eventName = getEventName(EventName.ManagerContractRemoved);

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

export function handleNftContractRegistered(event: NftContractRegistered): void {
  const nftAddress = event.params.nftContract.toHexString();
  const eventName = getEventName(EventName.NftContractRegistered);
  const owner = event.params.nftOwner.toHexString();

  let contractEntity = Contract.load(nftAddress);
  if (!contractEntity) {
    contractEntity = new Contract(nftAddress);

    // Initiating data source NFT template dynamically to start indexing since this block
    NftTemplate.create(event.params.nftContract);

    logging(getLogMsg(LogMsg.___NFT_DEPLOYED), eventName, nftAddress, '');

    const paymentEntity = Payment.load(owner);
    if (paymentEntity && paymentEntity.description) {
      // When nft is distributed, a payment entity is created with the project owner ID, and the collection ID is stored there.
      contractEntity.collection_id = paymentEntity.description;
    }
  }

  const transactionEntity = saveTransaction(event, getContractTopic(event.address), eventName);
  contractEntity.block_number = transactionEntity.block_number;
  contractEntity.transaction = transactionEntity.id;
  contractEntity.owner = owner;
  contractEntity.topic = 'NFT';
  contractEntity.is_removed = false;
  contractEntity.is_revealed = false;
  contractEntity.is_owner_changed = false;
  contractEntity.total_minted_amount = BigInt.zero().toI32();

  // Interaction with the NFT contract for max supply, cover uri.
  const nftContract = NftContract.bind(event.params.nftContract);
  const maxSupply = nftContract.try_maxSupply();
  if (maxSupply.reverted) {
    logging(getLogMsg(LogMsg.___CALL_REVERTED), eventName, nftAddress, '@query maxSupply');
  } else {
    contractEntity.max_supply = maxSupply.value.toI32();
  }

  contractEntity.total_minted_amount = 0;

  const coverUri = nftContract.try_uri(BigInt.zero());
  if (coverUri.reverted) {
    logging(getLogMsg(LogMsg.___CALL_REVERTED), eventName, nftAddress, '@query coverUri');
  } else {
    contractEntity.cover_uri = coverUri.value;
  }

  contractEntity.save();
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
