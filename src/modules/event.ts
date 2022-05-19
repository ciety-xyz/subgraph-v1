export enum EventName {
  ContractRegistered,
  ContractRemoved,
  NftContractDeployed,
  OwnershipTransferred,
  RoleAdded,
  RoleRemoved,
  PaymentReceived,
  MintFeeReceived,
  EtherReceived,
  MintFeePaid,
  BalanceTransferred,
  Transfer,
  ownershipTransferred,
  BaseURIChanged,
  Revealed,
  SetTicketSchedule,
  SetPublicSchedule,
  PublicMint,
  TicketMint,
  Airdrop,
  RequestVRF,
  ResponseVRF,
  Requested,
  Updated,
  ChangeFeeRate,
  SetMinFee,
  SetSpecialFeeRate,
}

export function getEventName(eventName: EventName): string {
  switch (eventName) {
    case EventName.ContractRegistered:
      return 'ManagerContractRegistered';
    case EventName.ContractRemoved:
      return 'ManagerContractRemoved';
    case EventName.NftContractDeployed:
      return 'NftContractDeployed';
    case EventName.OwnershipTransferred:
      return 'OwnershipTransferred';
    case EventName.RoleAdded:
      return 'RoleAdded';
    case EventName.RoleRemoved:
      return 'RoleRemoved';
    case EventName.PaymentReceived:
      return 'PaymentReceived';
    case EventName.MintFeeReceived:
      return 'MintFeeReceived';
    case EventName.EtherReceived:
      return 'EtherReceived';
    case EventName.MintFeePaid:
      return 'MintFeePaid';
    case EventName.BalanceTransferred:
      return 'BalanceTransferred';
    case EventName.Transfer:
      return 'Transfer';
    case EventName.BaseURIChanged:
      return 'BaseURIChanged';
    case EventName.Revealed:
      return 'Revealed';
    case EventName.SetTicketSchedule:
      return 'SetTicketSchedule';
    case EventName.SetPublicSchedule:
      return 'SetPublicSchedule';
    case EventName.PublicMint:
      return 'PublicMint';
    case EventName.TicketMint:
      return 'TicketMint';
    case EventName.Airdrop:
      return 'Airdrop';
    case EventName.RequestVRF:
      return 'RequestVRF';
    case EventName.ResponseVRF:
      return 'ResponseVRF';
    case EventName.Requested:
      return 'Requested';
    case EventName.Updated:
      return 'Updated';
    case EventName.ChangeFeeRate:
      return 'ChangeFeeRate';
    case EventName.SetMinFee:
      return 'SetMinFee';
    case EventName.SetSpecialFeeRate:
      return 'SetSpecialFeeRate';
    default:
      return '';
  }
}
