import { Contract, Nft } from '../types/schema';
import { BigInt } from '@graphprotocol/graph-ts';
import { getLogMsg, logging, LogMsg } from '../utils/logger';
import { BaseURIChanged, OwnershipTransferred, Revealed, Transfer } from '../types/templates/OmnuumNFT721/OmnuumNFT721';
import { saveTransaction } from '../modules/transaction';
import { getContractTopic } from '../modules/topic';
import { EventName, getEventName } from '../modules/event';
import { updateMinterEntities } from '../modules/minter';
import { handleNFTContractBalance, updateTotalMintedAmountForNftContract } from '../modules/nftContract';
import { ownershipTransfer } from '../modules/ownership';
import { BalanceTransferred, EtherReceived, MintFeePaid } from '../types/NftFactory/OmnuumNFT721';
import { ADDRESS_DEAD, ADDRESS_ZERO } from '../utils/constants';
import { manageOwner } from '../modules/manageOwners';

export function handleTransfer(event: Transfer): void {
  const nftContractAddress = event.address.toHexString();
  const tokenId = event.params.tokenId.toString();
  const eventName = getEventName(EventName.TransferSingle);
  const transactionEntity = saveTransaction(event, getContractTopic(event.address), eventName);
  const mintQuantity = 1;

  // nftOwner can be minter or buyer after minting.
  const nftNewOwner = event.params.to.toHexString();

  const nftEntityId = `${nftContractAddress}_${tokenId}`;

  let nftEntity = Nft.load(nftEntityId);
  if (!nftEntity) {
    // <Fresh Minting>
    // The mint quantity of minter, the mint quantity in the nft contract,
    // and the total minting supply of the nft contract are accumulated.
    updateMinterEntities(nftNewOwner, nftContractAddress, tokenId, mintQuantity, transactionEntity.block_number);
    updateTotalMintedAmountForNftContract(
      nftContractAddress,
      mintQuantity,
      eventName,
      transactionEntity.id,
      transactionEntity.block_number
    );

    nftEntity = new Nft(nftEntityId);
    nftEntity.nft_contract = nftContractAddress;
    nftEntity.minter = nftNewOwner;
    nftEntity.owners = [nftNewOwner];
    nftEntity.token_id = tokenId;

    // update minter entities with adding mintQuantities and referencing nft Entity from minter
  } else {
    // <Selling>
    // A single transfer event for the same token ID in the same contract means that it was sold after minting.
    // Therefore, by sequentially adding the owner to the array, we index to track the owner of the corresponding token ID.
    const owners = nftEntity.owners;
    owners.push(nftNewOwner);
    nftEntity.owners = owners;

    const contractEntity = Contract.load(nftContractAddress);

    if (contractEntity) {
      if (nftNewOwner == ADDRESS_ZERO || nftNewOwner == ADDRESS_DEAD) {
        contractEntity.total_burned_amount = contractEntity.total_burned_amount + 1;
      } else {
        contractEntity.total_transferred_amount = contractEntity.total_transferred_amount + 1;
      }
      contractEntity.save();
    } else {
      logging(getLogMsg(LogMsg.___NO_ENTITY), eventName, nftContractAddress, '');
    }
  }

  nftEntity.block_number = transactionEntity.block_number;
  nftEntity.transaction = transactionEntity.id;

  nftEntity.save();

  manageOwner(
    event.params.from.toHexString(),
    nftNewOwner,
    nftContractAddress,
    tokenId,
    transactionEntity.id,
    transactionEntity.block_number
  );
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  ownershipTransfer(event);
}

export function handleBaseURIChanged(event: BaseURIChanged): void {
  const nftContractAddress = event.address.toHexString();
  const contractEntity = Contract.load(nftContractAddress);
  const eventName = getEventName(EventName.BaseURIChanged);

  if (contractEntity) {
    const transactionEntity = saveTransaction(event, getContractTopic(event.address), eventName);
    contractEntity.block_number = transactionEntity.block_number;
    contractEntity.transaction = transactionEntity.id;

    contractEntity.base_uri = event.params.baseURI;

    contractEntity.save();
  } else {
    logging(getLogMsg(LogMsg.___NO_ENTITY), eventName, nftContractAddress, '');
  }
}

export function handleRevealed(event: Revealed): void {
  const nftContractAddress = event.address.toHexString();
  const contractEntity = Contract.load(nftContractAddress);
  const eventName = getEventName(EventName.Revealed);

  if (contractEntity) {
    const transactionEntity = saveTransaction(event, getContractTopic(event.address), eventName);
    contractEntity.block_number = transactionEntity.block_number;
    contractEntity.transaction = transactionEntity.id;
    contractEntity.is_revealed = true;

    contractEntity.save();
  } else {
    logging(getLogMsg(LogMsg.___NO_ENTITY), eventName, nftContractAddress, '');
  }
}

export function handleEtherReceived(event: EtherReceived): void {
  handleNFTContractBalance(event, event.address, event.params.value, BigInt.zero());
}

export function handleMintFeePaid(event: MintFeePaid): void {
  handleNFTContractBalance(event, event.params.nftContract, event.params.profit, event.params.mintFee);
}

export function handleBalanceTransferred(event: BalanceTransferred): void {
  const nftContractAddress = event.address.toHexString();
  const contractEntity = Contract.load(nftContractAddress);
  const eventName = getEventName(EventName.BalanceTransferred);
  if (contractEntity) {
    const transactionEntity = saveTransaction(event, getContractTopic(event.address), eventName);
    contractEntity.block_number = transactionEntity.block_number;
    contractEntity.transaction = transactionEntity.id;
    contractEntity.withdrawal = contractEntity.withdrawal.plus(event.params.value);

    contractEntity.save();
  } else {
    logging(getLogMsg(LogMsg.___NO_ENTITY), eventName, nftContractAddress, '');
  }
}
