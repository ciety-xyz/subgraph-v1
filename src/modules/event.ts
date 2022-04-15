export enum EventName {
  ContractRegistered,
  ContractRemoved,
  NftContractDeployed,
  OwnershipTransferred,
  RoleAdded,
  RoleRemoved,
  PaymentReceived,
  EtherReceived,
  TransferSingle,
  ownershipTransferred,
  Uri,
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
    case EventName.EtherReceived:
      return 'EtherReceived';
    case EventName.TransferSingle:
      return 'TransferSingle';
    case EventName.Uri:
      return 'Uri';
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
