import { TicketMint } from '../types/TicketManager/TicketManager';
import { SetTicketSchedule } from '../types/TicketManager/TicketManager';
import { EventName, getEventName } from '../modules/event';
import { getMintTopic, MintTopic } from '../modules/topic';
import { handleMint } from '../modules/handleMint';
import { getMintScheduleEntity } from '../modules/mintSchedule';

export function handleSetTicketSchedule(event: SetTicketSchedule): void {
  const mintScheduleEntity = getMintScheduleEntity(
    event,
    getMintTopic(MintTopic.TICKET),
    getEventName(EventName.SetTicketSchedule)
  );
  mintScheduleEntity.save();
}

export function handleTicketMint(event: TicketMint): void {
  handleMint(event, getEventName(EventName.TicketMint), getMintTopic(MintTopic.TICKET));
}
