export enum EventName {
  ManagerContractRegistered,
  ManagerContractRemoved,
  NftContractRegistered,
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
}

export function getEventName(eventName: EventName): string {
  switch (eventName) {
    case EventName.ManagerContractRegistered:
      return 'ManagerContractRegistered';
    case EventName.ManagerContractRemoved:
      return 'ManagerContractRemoved';
    case EventName.NftContractRegistered:
      return 'NftContractRegistered';
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
    default:
      return '';
  }
}
