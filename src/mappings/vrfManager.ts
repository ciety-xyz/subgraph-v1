import { OwnershipTransferred, RequestVRF, ResponseVRF } from '../types/OmnuumVRFManager/OmnuumVRFManager';
import { EventName, getEventName } from '../modules/event';
import { saveTransaction } from '../modules/transaction';
import { getContractTopic, getVrfTopic, VrfTopic } from '../modules/topic';
import { Reveal } from '../types/schema';
import { getLogMsg, logging, LogMsg } from '../utils/logger';
import { OmnuumNFT721 as NftContract } from '../types/templates/OmnuumNFT721/OmnuumNFT721';
import { Address } from '@graphprotocol/graph-ts';
import { ownershipTransfer } from '../modules/ownership';

export function handleRequestVRF(event: RequestVRF): void {
  // revealEntityId: "requestId(hex)"
  const eventName = getEventName(EventName.RequestVRF);
  const vrfTopic = event.params.topic;

  if (vrfTopic == getVrfTopic(VrfTopic.REVEAL_PFP)) {
    const revealEntityId = event.params.requestId.toHexString();
    const transactionEntity = saveTransaction(event, getContractTopic(event.address), eventName);

    let revealEntity = Reveal.load(revealEntityId);
    if (!revealEntity) {
      revealEntity = new Reveal(revealEntityId);
    }

    revealEntity.block_number = transactionEntity.block_number;
    revealEntity.transaction = transactionEntity.id;
    revealEntity.nft_contract = event.params.roller.toHexString();
    revealEntity.topic = vrfTopic;
    revealEntity.vrf_fare = transactionEntity.value;

    revealEntity.save();
  }
}

export function handleResponseVRF(event: ResponseVRF): void {
  // revealEntityId: "requestId(hex)"
  const eventName = getEventName(EventName.ResponseVRF);
  const vrfTopic = event.params.topic;

  if (vrfTopic == getVrfTopic(VrfTopic.REVEAL_PFP)) {
    const revealEntityId = event.params.requestId.toHexString();
    const revealEntity = Reveal.load(revealEntityId);
    if (revealEntity) {
      const transactionEntity = saveTransaction(event, getContractTopic(event.address), eventName);
      revealEntity.block_number = transactionEntity.block_number;
      revealEntity.transaction = transactionEntity.id;
      revealEntity.random_number = event.params.randomness;

      // Interaction with the NFT contract for max supply
      const nftContractAddress = Address.fromString(revealEntity.nft_contract);
      const nftContractInstance = NftContract.bind(nftContractAddress);
      const maxSupply = nftContractInstance.try_maxSupply();
      if (maxSupply.reverted) {
        logging(getLogMsg(LogMsg.___CALL_REVERTED), eventName, revealEntity.nft_contract, '@query maxSupply');
      } else {
        const startingIndex = event.params.randomness.mod(maxSupply.value);
        revealEntity.starting_index = startingIndex.toI32();
      }

      revealEntity.save();
    } else {
      logging(getLogMsg(LogMsg.___NO_ENTITY), eventName, revealEntityId, 'response, but no requestEntity');
    }
  }
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  ownershipTransfer(event);
}
