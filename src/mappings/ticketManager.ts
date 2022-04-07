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
  // // no base price, mint_supply and mint_limit_per_address for ticket.
  // // Because it's inside ticket payload, so they can be different for each ticket.
  mintScheduleEntity.save();
}

export function handleTicketMint(event: TicketMint): void {
  handleMint(event, getEventName(EventName.TicketMint), getMintTopic(MintTopic.TICKET));
}
