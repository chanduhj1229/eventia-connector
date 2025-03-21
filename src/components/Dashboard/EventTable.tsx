
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal, Download, Edit, Trash, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Event {
  id: string;
  title: string;
  date: string;
  status: 'draft' | 'published' | 'past';
  attendees: number;
  category: string;
}

// Sample events data
const events: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2023',
    date: 'Oct 15-17, 2023',
    status: 'published',
    attendees: 1200,
    category: 'Technology',
  },
  {
    id: '2',
    title: 'Music Festival',
    date: 'Nov 5-7, 2023',
    status: 'published',
    attendees: 5000,
    category: 'Music',
  },
  {
    id: '3',
    title: 'Design Workshop',
    date: 'Sep 25, 2023',
    status: 'past',
    attendees: 150,
    category: 'Design',
  },
  {
    id: '4',
    title: 'Food & Wine Festival',
    date: 'Oct 8-10, 2023',
    status: 'draft',
    attendees: 800,
    category: 'Food',
  },
  {
    id: '5',
    title: 'Business Summit 2023',
    date: 'Dec 10-12, 2023',
    status: 'draft',
    attendees: 0,
    category: 'Business',
  },
];

export const EventTable: React.FC = () => {
  const [eventsList, setEventsList] = useState<Event[]>(events);

  const deleteEvent = (id: string) => {
    setEventsList(eventsList.filter(event => event.id !== id));
    toast.success('Event deleted successfully');
  };

  const exportAttendees = (id: string) => {
    toast.success('Attendee list exported to CSV');
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-4 px-6 font-medium text-muted-foreground">Event</th>
              <th className="text-left py-4 px-6 font-medium text-muted-foreground">Date</th>
              <th className="text-left py-4 px-6 font-medium text-muted-foreground">Category</th>
              <th className="text-left py-4 px-6 font-medium text-muted-foreground">Status</th>
              <th className="text-left py-4 px-6 font-medium text-muted-foreground">Attendees</th>
              <th className="text-right py-4 px-6 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {eventsList.map((event) => (
              <tr key={event.id} className="hover:bg-muted/50 transition-colors">
                <td className="py-4 px-6 font-medium">{event.title}</td>
                <td className="py-4 px-6 text-muted-foreground">{event.date}</td>
                <td className="py-4 px-6">
                  <Badge variant="outline">{event.category}</Badge>
                </td>
                <td className="py-4 px-6">
                  <Badge 
                    variant="outline" 
                    className={`
                      ${event.status === 'published' && 'bg-green-500/10 text-green-600 border-green-200'} 
                      ${event.status === 'draft' && 'bg-amber-500/10 text-amber-600 border-amber-200'}
                      ${event.status === 'past' && 'bg-gray-500/10 text-gray-600 border-gray-200'}
                    `}
                  >
                    {event.status}
                  </Badge>
                </td>
                <td className="py-4 px-6 text-muted-foreground">{event.attendees}</td>
                <td className="py-4 px-6 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/event/${event.id}`} className="flex items-center">
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/edit-event/${event.id}`} className="flex items-center">
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => exportAttendees(event.id)}
                        disabled={event.attendees === 0}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        <span>Export Attendees</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => deleteEvent(event.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
