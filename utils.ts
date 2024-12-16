import { DayEvents, Event } from "./types";

export function getDaysInMonth(year: number, month: number): Date[] {
  const date = new Date(year, month, 1);
  const days: Date[] = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getEventsForDay(events: DayEvents, date: Date): Event[] {
  const dateString = formatDate(date);
  return events[dateString] || [];
}

export function addEvent(events: DayEvents, date: Date, event: Event): DayEvents {
  const dateString = formatDate(date);
  const updatedEvents = { ...events };
  if (!updatedEvents[dateString]) {
    updatedEvents[dateString] = [];
  }
  updatedEvents[dateString].push(event);
  return updatedEvents;
}

export function updateEvent(events: DayEvents, date: Date, updatedEvent: Event): DayEvents {
  const dateString = formatDate(date);
  const updatedEvents = { ...events };
  if (!updatedEvents[dateString]) {
    updatedEvents[dateString] = [];
  }
  const eventIndex = updatedEvents[dateString].findIndex(event => event.id === updatedEvent.id);
  if (eventIndex !== -1) {
    updatedEvents[dateString][eventIndex] = updatedEvent;
  } else {
    updatedEvents[dateString].push(updatedEvent);
  }
  return updatedEvents;
}

export function deleteEvent(events: DayEvents, date: Date, eventId: string): DayEvents {
  const dateString = formatDate(date);
  const updatedEvents = { ...events };
  updatedEvents[dateString] = updatedEvents[dateString].filter(event => event.id !== eventId);
  return updatedEvents;
}

export function filterEvents(events: DayEvents, keyword: string): DayEvents {
  const filteredEvents: DayEvents = {};
  Object.keys(events).forEach(date => {
    filteredEvents[date] = events[date].filter(event => 
      event.name.toLowerCase().includes(keyword.toLowerCase()) ||
      event.description?.toLowerCase().includes(keyword.toLowerCase())
    );
  });
  return filteredEvents;
}

export function checkEventOverlap(existingEvents: Event[], newEvent: Event): boolean {
  return existingEvents.some(event => 
    (newEvent.startTime >= event.startTime && newEvent.startTime < event.endTime) ||
    (newEvent.endTime > event.startTime && newEvent.endTime <= event.endTime) ||
    (newEvent.startTime <= event.startTime && newEvent.endTime >= event.endTime)
  );
}

export function moveEvent(events: DayEvents, sourceDate: string, destinationDate: string, eventId: string): DayEvents {
  const updatedEvents = { ...events };
  const sourceEvents = updatedEvents[sourceDate] || [];
  const destinationEvents = updatedEvents[destinationDate] || [];

  const movedEventIndex = sourceEvents.findIndex(event => event.id === eventId);
  
  if (movedEventIndex !== -1) {
    const [movedEvent] = sourceEvents.splice(movedEventIndex, 1);
    destinationEvents.push(movedEvent);

    updatedEvents[sourceDate] = sourceEvents;
    updatedEvents[destinationDate] = destinationEvents;
  }

  return updatedEvents;
}

