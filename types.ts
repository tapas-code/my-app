export interface Event {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  description?: string;
  color: string;
}

export interface DayEvents {
  [date: string]: Event[];
}

