import { log } from '@graphprotocol/graph-ts';

export enum LogMsg {
  ___NO_ENTITY,
  ___ZERO_ADDRESS,
  ___NO_ROLE,
  ___CALL_REVERTED,
  ___DUPLICATED,
  ___DIFF_OWNER,
  ___NFT_DEPLOYED,
}

export function getLogMsg(key: LogMsg): string {
  switch (key) {
    case LogMsg.___NO_ENTITY:
      return '___NO_ENTITY';
    case LogMsg.___ZERO_ADDRESS:
      return '___ZERO_ADDRESS';
    case LogMsg.___NO_ROLE:
      return '___NO_ROLE';
    case LogMsg.___CALL_REVERTED:
      return '___CALL_REVERTED';
    case LogMsg.___DUPLICATED:
      return '___DUPLCATED';
    case LogMsg.___DIFF_OWNER:
      return '___DIFF_OWNER';
    case LogMsg.___NFT_DEPLOYED:
      return '___NFT_DEPLOYED';
    default:
      return '___UNRECOGNIZED_LOG_MESSAGE';
  }
}

export function logging(msg: string, eventName: string, id: string, addMsg: string): void {
  log.debug(`TAG: ${msg}, EVENT: ${eventName}, ID: {} ${addMsg}`, [id]);
}
