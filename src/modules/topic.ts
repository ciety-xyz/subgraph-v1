import { Bytes } from '@graphprotocol/graph-ts';
import { Contract } from '../types/schema';

export function getContractTopic(contractAddress: Bytes): string {
  const contractEntity = Contract.load(contractAddress.toHexString());
  return contractEntity ? contractEntity.topic : '';
}

export enum VrfTopic {
  REVEAL_PFP,
}

export enum MintTopic {
  TICKET,
  PUBLIC,
  AIRDROP,
  UNRECOGNIZED,
}

export enum RequestType {
  Withdraw,
  Add,
  Remove,
  Change,
  Cancel,
}

export function getVrfTopic(vrfTopic: VrfTopic): string {
  switch (vrfTopic) {
    case VrfTopic.REVEAL_PFP:
      return 'REVEAL_PFP';
    default:
      return 'UNRECOGNIZED';
  }
}

export function getMintTopic(mintTopic: MintTopic): string {
  switch (mintTopic) {
    case MintTopic.TICKET:
      return 'TICKET';
    case MintTopic.PUBLIC:
      return 'PUBLIC';
    case MintTopic.AIRDROP:
      return 'AIRDROP';
    default:
      return 'UNRECOGNIZED';
  }
}

export function getRequestType(requestType: RequestType): string {
  switch (requestType) {
    case RequestType.Withdraw:
      return 'Withdraw';
    case RequestType.Add:
      return 'Add';
    case RequestType.Remove:
      return 'Remove';
    case RequestType.Change:
      return 'Change';
    case RequestType.Cancel:
      return 'Cancel';
    default:
      return 'UNRECOGNIZED';
  }
}
