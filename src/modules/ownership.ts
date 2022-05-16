import { Contract } from '../types/schema';
import { EventName, getEventName } from './event';
import { saveTransaction } from './transaction';
import { getContractTopic } from './topic';
import { getLogMsg, logging, LogMsg } from '../utils/logger';
import { Address } from '@graphprotocol/graph-ts';
import { OwnershipTransferred } from '../types/templates/OmnuumNFT721/OmnuumNFT721';

export function ownershipTransfer<T extends OwnershipTransferred>(event: T): void {
  const contractEntityId = event.address.toHexString();

  const contractEntity = Contract.load(contractEntityId);
  const eventName = getEventName(EventName.OwnershipTransferred);
  const previousOwnerAddress = event.params.previousOwner.toHexString();

  if (event.params.previousOwner != Address.zero()) {
    if (contractEntity) {
      if (contractEntity.owner == previousOwnerAddress) {
        const transactionEntity = saveTransaction(event, getContractTopic(event.address), eventName);
        contractEntity.block_number = transactionEntity.block_number;
        contractEntity.transaction = transactionEntity.id;
        contractEntity.owner = event.params.newOwner.toHexString();
        contractEntity.is_owner_changed = true;

        contractEntity.save();
      } else {
        logging(getLogMsg(LogMsg.___DIFF_OWNER), eventName, contractEntityId, '');
      }
    } else {
      logging(getLogMsg(LogMsg.___NO_ENTITY), eventName, contractEntityId, '');
    }
  } else {
    logging(getLogMsg(LogMsg.___ZERO_ADDRESS), eventName, contractEntityId, '');
  }
}
