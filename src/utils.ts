import * as moment from 'moment';
import { Event } from './events/schemas/event.schema';

const granularity: moment.unitOfTime.StartOf = 'minute';
const inclusivity: '()' | '[)' | '(]' | '[]' = '[]';

export const getConflictingEvent = (
  event: Event,
  registeredEvents: Event[],
): Event | undefined => {
  const eventTimeRange = [moment(event.startTime), moment(event.endTime)];

  const conflictingEvent = registeredEvents.find((event) => {
    const currentEventTimeRange = [
      moment(event.startTime),
      moment(event.endTime),
    ];

    const [currentEventStart, currentEventEnd] = currentEventTimeRange;
    const [eventStart, eventEnd] = eventTimeRange;

    const isEventStartOverlapping = eventStart.isBetween(
      currentEventStart,
      currentEventEnd,
      granularity,
      inclusivity,
    );

    const isEventEndOverlapping = eventEnd.isBetween(
      currentEventStart,
      currentEventEnd,
      granularity,
      inclusivity,
    );

    const isCurrentEventStartOverlapping = currentEventStart.isBetween(
      eventStart,
      eventEnd,
      granularity,
      inclusivity,
    );

    const isCurrentEventEndOverlapping = currentEventEnd.isBetween(
      eventStart,
      eventEnd,
      granularity,
      inclusivity,
    );

    return (
      isEventStartOverlapping ||
      isEventEndOverlapping ||
      isCurrentEventStartOverlapping ||
      isCurrentEventEndOverlapping
    );
  });

  return conflictingEvent;
};
