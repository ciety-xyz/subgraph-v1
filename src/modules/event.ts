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
  TransferSingle,
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
    case EventName.TransferSingle:
      return 'TransferSingle';
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
    default:
      return '';
  }
}
