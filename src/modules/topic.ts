import { Bytes } from '@graphprotocol/graph-ts';
import { Contract } from '../types/schema';

export function getContractTopic(contractAddress: Bytes): string {
  const contractEntity = Contract.load(contractAddress.toHexString());
  return contractEntity ? contractEntity.topic : '';
}

export enum MintTopic {
  TICKET,
  PUBLIC,
  AIRDROP,
  UNRECOGNIZED,
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
