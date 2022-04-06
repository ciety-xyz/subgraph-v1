import { Minter } from '../types/schema';

function updateMinterEntityById(
  id: string,
  minterAddress: string,
  mintQty: u32,
  nftId: string,
  blockNumber: u32
): void {
  let minterEntity = Minter.load(id);
  if (!minterEntity) {
    minterEntity = new Minter(id);
    minterEntity.minter_address = minterAddress;
    minterEntity.mintAmount = mintQty;
    minterEntity.nfts = [nftId];
  } else {
    minterEntity.mintAmount = minterEntity.mintAmount + mintQty;
    const nfts = minterEntity.nfts;
    if (nfts) {
      nfts.push(nftId);
      minterEntity.nfts = nfts;
    }
  }

  minterEntity.block_number = blockNumber;

  minterEntity.save();
}

export function updateMinterEntities(
  minterAddress: string,
  nftContractAddress: string,
  tokenId: string,
  mintQty: u32,
  blockNumber: u32
): void {
  const minterId = minterAddress;
  const minterWithNftcontractId = `${minterAddress}_${nftContractAddress}`;
  const nftId = `${nftContractAddress}_${tokenId}`;

  updateMinterEntityById(minterId, minterAddress, mintQty, nftId, blockNumber);
  updateMinterEntityById(minterWithNftcontractId, minterAddress, mintQty, nftId, blockNumber);
}

export function updateMinterEntityWithMintSchedule(
  minterAddress: string,
  mintScheduleId: string,
  mintQty: u32,
  blockNumber: u32
): void {
  const id = `${minterAddress}_${mintScheduleId}`;

  let minterEntity = Minter.load(id);
  if (!minterEntity) {
    minterEntity = new Minter(id);
    minterEntity.minter_address = minterAddress;
    minterEntity.mintAmount = mintQty;
  } else {
    minterEntity.mintAmount = minterEntity.mintAmount + mintQty;
  }
  minterEntity.block_number = blockNumber;
  minterEntity.save();
}
