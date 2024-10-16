export enum Sport {
  Athletics = 'Athletics',
  Badminton = 'Badminton',
  Cricket = 'Cricket',
  Football = 'Football',
  Snooker = 'Snooker',
  Swimming = 'Swimming',
  Tennis = 'Tennis',
}

export enum Status {
  Open = 'Open',
  InProgress = 'InProgress',
  Cancelled = 'Cancelled',
  Finished = 'Finished',
}

export interface Details {
  organizer: string;
  description: string;
}
