import { Minter } from '../types/schema';

// Listening from singleTransfer (ticket, public, airdrop)
export function updateMinterEntities(
  minterAddress: string,
  nftContractAddress: string,
  tokenId: string,
  mintQty: i32,
  blockNumber: i32
): void {
  const minterId = minterAddress;
  const minterWithNftcontractId = `${minterAddress}_${nftContractAddress}`;
  const nftId = `${nftContractAddress}_${tokenId}`;

  updateMinterEntityById(minterId, minterAddress, mintQty, nftId, blockNumber);
  updateMinterEntityById(minterWithNftcontractId, minterAddress, mintQty, nftId, blockNumber);
}

// Listening from mint events (ticket, public)
export function updateMinterEntityWithMintSchedule(
  minterAddress: string,
  mintScheduleId: string,
  mintQuantity: i32,
  blockNumber: i32
): void {
  const id = `${minterAddress}_${mintScheduleId}`;

  let minterEntity = Minter.load(id);
  if (!minterEntity) {
    minterEntity = new Minter(id);
    minterEntity.minter_address = minterAddress;
    minterEntity.minted_amount = mintQuantity;
  } else {
    minterEntity.minted_amount = minterEntity.minted_amount + mintQuantity;
  }
  minterEntity.block_number = blockNumber;
  minterEntity.save();
}

function updateMinterEntityById(
  id: string,
  minterAddress: string,
  mintQty: i32,
  nftId: string,
  blockNumber: i32
): void {
  // Minter entity does not have transaction, so that no need to update transaction id.
  let minterEntity = Minter.load(id);
  if (!minterEntity) {
    minterEntity = new Minter(id);
    minterEntity.minter_address = minterAddress;
    minterEntity.minted_amount = mintQty;
    minterEntity.nfts = [nftId];
  } else {
    minterEntity.minted_amount = minterEntity.minted_amount + mintQty;
    const nfts = minterEntity.nfts;
    if (nfts) {
      nfts.push(nftId);
      minterEntity.nfts = nfts;
    }
  }

  minterEntity.block_number = blockNumber;

  minterEntity.save();
}
