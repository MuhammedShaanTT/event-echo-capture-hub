
import React from 'react';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/types/event';
import { useEvents } from '@/context/EventContext';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { deleteEvent } = useEvents();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(event.id);
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'Conference':
        return 'bg-blue-500';
      case 'Workshop':
        return 'bg-green-500';
      case 'Seminar':
        return 'bg-yellow-500';
      case 'Cultural':
        return 'bg-purple-500';
      case 'Technical':
        return 'bg-orange-500';
      case 'Sports':
        return 'bg-red-500';
      case 'Competition':
        return 'bg-indigo-500';
      case 'Exhibition':
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl text-brand-darkBlue truncate">
            {event.name}
          </CardTitle>
          <Badge className={`${getBadgeColor(event.type)} text-white`}>
            {event.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Date:</span>
            <span>{format(new Date(event.date), 'PPP')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Club:</span>
            <span className="truncate max-w-[200px]">{event.organizingClub}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Coordinator:</span>
            <span className="truncate max-w-[200px]">{event.chiefCoordinator}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Email:</span>
            <span className="truncate max-w-[200px]">{event.chiefCoordinatorEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Venue:</span>
            <span className="truncate max-w-[200px]">{event.venue}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t">
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
