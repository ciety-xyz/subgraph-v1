import { Bytes } from '@graphprotocol/graph-ts';
import { Contract } from '../types/schema';

export function getContractTopic(contractAddress: Bytes): string {
  const contractEntity = Contract.load(contractAddress.toHexString());
  return contractEntity ? contractEntity.topic : '';
}
