
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventCard } from '@/components/EventCard';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  category: string;
  ticketPrice: number;
  organizer: {
    _id: string;
    name: string;
  };
}

const MyEvents = () => {
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!token) return;
      
      try {
        const response = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const result = await response.json();
        
        if (response.ok) {
          setRegisteredEvents(result.data.registeredEvents || []);
        } else {
          toast.error('Failed to fetch your events');
        }
      } catch (error) {
        console.error('Error fetching user events:', error);
        toast.error('An error occurred while fetching your events');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserEvents();
  }, [token]);

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
            ) : registeredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {registeredEvents
                  .filter(event => new Date(event.date) >= new Date())
                  .map(event => (
                    <EventCard key={event._id} event={event} />
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
                    <EventCard key={event._id} event={event} />
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
