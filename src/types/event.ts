
export type Event = {
  id: string;
  name: string;
  type: string;
  date: Date;
  organizingClub: string;
  chiefCoordinator: string;
  chiefCoordinatorEmail: string;
  venue: string;
  createdAt: Date;
};

export type EventFormData = Omit<Event, 'id' | 'createdAt'>;
