
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { useEvents } from '@/context/EventContext';
import { EventFormData } from '@/types/event';

const eventTypes = [
  'Conference',
  'Workshop',
  'Seminar',
  'Cultural',
  'Technical',
  'Sports',
  'Competition',
  'Exhibition',
  'Other',
];

const formSchema = z.object({
  name: z.string().min(3, {
    message: 'Event name must be at least 3 characters.',
  }),
  type: z.string({
    required_error: 'Please select an event type.',
  }),
  date: z.date({
    required_error: 'Please select a date.',
  }),
  organizingClub: z.string().min(2, {
    message: 'Organizing club name must be at least 2 characters.',
  }),
  chiefCoordinator: z.string().min(3, {
    message: 'Chief coordinator name must be at least 3 characters.',
  }),
  chiefCoordinatorEmail: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  venue: z.string().min(3, {
    message: 'Venue must be at least 3 characters.',
  }),
});

const EventForm = () => {
  const { addEvent } = useEvents();
  const navigate = useNavigate();
  const [customType, setCustomType] = useState('');
  const [showCustomDialog, setShowCustomDialog] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      organizingClub: '',
      chiefCoordinator: '',
      chiefCoordinatorEmail: '',
      venue: '',
    },
  });

  const handleTypeChange = (value: string) => {
    if (value === 'Other') {
      setShowCustomDialog(true);
    } else {
      form.setValue('type', value);
    }
  };

  const handleCustomTypeSubmit = () => {
    if (customType.trim().length < 2) {
      return; // Prevent empty custom types
    }
    form.setValue('type', customType);
    setShowCustomDialog(false);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Ensure all fields are defined as required by the EventFormData type
    const eventData: EventFormData = {
      name: values.name,
      type: values.type,
      date: values.date,
      organizingClub: values.organizingClub,
      chiefCoordinator: values.chiefCoordinator,
      chiefCoordinatorEmail: values.chiefCoordinatorEmail,
      venue: values.venue,
    };
    addEvent(eventData);
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-brand-darkBlue">
        Register New Event
      </h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type</FormLabel>
                  <Select
                    onValueChange={handleTypeChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dialog for custom event type */}
            <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Enter Custom Event Type</DialogTitle>
                  <DialogDescription>
                    Please enter your custom event type below.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input
                    placeholder="Enter custom event type"
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowCustomDialog(false);
                      form.setValue('type', '');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleCustomTypeSubmit}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Event Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="organizingClub"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organizing Club</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter organizing club" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chiefCoordinator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chief Coordinator</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter chief coordinator name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chiefCoordinatorEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chief Coordinator Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Enter chief coordinator email" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="venue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event venue" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-darkBlue">
              Register Event
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EventForm;
