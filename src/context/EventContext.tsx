
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event, EventFormData } from '@/types/event';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface EventContextType {
  events: Event[];
  addEvent: (eventData: EventFormData) => void;
  deleteEvent: (id: string) => void;
  searchEvents: (query: string) => Event[];
  filterEventsByType: (type: string) => Event[];
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);

  // Load events from localStorage on mount
  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      try {
        // Parse the JSON and convert date strings back to Date objects
        const parsedEvents = JSON.parse(storedEvents);
        setEvents(
          parsedEvents.map((event: any) => ({
            ...event,
            date: new Date(event.date),
            createdAt: new Date(event.createdAt)
          }))
        );
      } catch (error) {
        console.error('Failed to parse stored events:', error);
        localStorage.removeItem('events');
      }
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const addEvent = (eventData: EventFormData) => {
    const newEvent: Event = {
      ...eventData,
      id: uuidv4(),
      createdAt: new Date(),
    };
    
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    toast.success('Event added successfully');
  };

  const deleteEvent = (id: string) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
    toast.success('Event deleted successfully');
  };

  const searchEvents = (query: string): Event[] => {
    if (!query) return events;
    
    const lowerCaseQuery = query.toLowerCase();
    return events.filter(
      (event) =>
        event.name.toLowerCase().includes(lowerCaseQuery) ||
        event.venue.toLowerCase().includes(lowerCaseQuery) ||
        event.organizingClub.toLowerCase().includes(lowerCaseQuery) ||
        event.chiefCoordinator.toLowerCase().includes(lowerCaseQuery)
    );
  };

  const filterEventsByType = (type: string): Event[] => {
    if (!type || type === 'All') return events;
    return events.filter((event) => event.type === type);
  };

  return (
    <EventContext.Provider
      value={{ events, addEvent, deleteEvent, searchEvents, filterEventsByType }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = (): EventContextType => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
