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
    case EventName.ownershipTransferred:
      return 'ownershipTransferred';
    case EventName.Uri:
      return 'Uri';
    default:
      return '';
  }
}
