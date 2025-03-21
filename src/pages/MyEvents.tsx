
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventCard } from '@/components/EventCard';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// Mock event data for frontend-only
const mockEvents = [
  {
    _id: 'event1',
    title: 'Tech Conference 2025',
    description: 'A conference about the latest tech trends',
    date: '2025-05-15T09:00:00.000Z',
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Technology',
    ticketPrice: 299,
    organizer: {
      _id: 'org1',
      name: 'Tech Events Inc',
    }
  },
  {
    _id: 'event2',
    title: 'Music Festival 2025',
    description: 'A weekend of music and fun',
    date: '2025-06-20T18:00:00.000Z',
    location: 'Austin, TX',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Music',
    ticketPrice: 150,
    organizer: {
      _id: 'org2',
      name: 'Music Productions',
    }
  },
  {
    _id: 'event3',
    title: 'Food & Wine Festival',
    description: 'Taste the best food and wine from local restaurants',
    date: '2024-09-10T11:00:00.000Z', // Past event
    location: 'New York, NY',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1174&q=80',
    category: 'Food & Drink',
    ticketPrice: 75,
    organizer: {
      _id: 'org3',
      name: 'Culinary Events',
    }
  }
];

const MyEvents = () => {
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Simulate fetching user events
    const fetchUserEvents = () => {
      setTimeout(() => {
        setRegisteredEvents(mockEvents);
        setIsLoading(false);
      }, 1000);
    };
    
    fetchUserEvents();
  }, [user]);

  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Events</h1>
          <p className="text-muted-foreground">
            View and manage the events you're attending
          </p>
        </div>
        
        <Tabs defaultValue="upcoming" className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : registeredEvents.filter(event => new Date(event.date) >= new Date()).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {registeredEvents
                  .filter(event => new Date(event.date) >= new Date())
                  .map(event => (
                    <EventCard 
                      key={event._id}
                      id={event._id}
                      title={event.title}
                      date={formatDate(event.date)}
                      location={event.location}
                      image={event.image}
                      category={event.category}
                      organizerName={event.organizer.name}
                      attendees={0}
                    />
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">You haven't registered for any upcoming events yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : registeredEvents.filter(event => new Date(event.date) < new Date()).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {registeredEvents
                  .filter(event => new Date(event.date) < new Date())
                  .map(event => (
                    <EventCard 
                      key={event._id}
                      id={event._id}
                      title={event.title}
                      date={formatDate(event.date)}
                      location={event.location}
                      image={event.image}
                      category={event.category}
                      organizerName={event.organizer.name}
                      attendees={0}
                    />
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">You don't have any past events.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyEvents;
