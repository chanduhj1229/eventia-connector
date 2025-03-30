
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventCard } from '@/components/EventCard';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Mock data for events
const mockEvents = [
  {
    _id: '1',
    title: 'Tech Conference 2023',
    date: new Date('2023-11-15'),
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
    category: 'technology',
    organizer: {
      _id: 'org1',
      name: 'Tech Events Inc.'
    },
    attendees: ['user1', 'user2', 'user3']
  },
  {
    _id: '2',
    title: 'Music Festival',
    date: new Date('2023-12-05'),
    location: 'Austin, TX',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop',
    category: 'music',
    organizer: {
      _id: 'org2',
      name: 'Festival Group'
    },
    attendees: ['user1']
  },
  {
    _id: '3',
    title: 'Food & Wine Expo',
    date: new Date('2023-10-20'),
    location: 'New York, NY',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
    category: 'food',
    organizer: {
      _id: 'org3',
      name: 'Culinary Arts'
    },
    attendees: ['user2', 'user3']
  }
];

const MyEvents = () => {
  const { user } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [organizedEvents, setOrganizedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch events when component mounts
  useEffect(() => {
    // Simulate API call for events data
    const fetchEvents = async () => {
      try {
        // For a frontend-only version, we'll use mock data
        setTimeout(() => {
          if (user) {
            // Filter registered events (this would normally come from the backend)
            const registered = mockEvents.filter((_, index) => index % 2 === 0); // Just for demonstration
            setRegisteredEvents(registered);
            
            // For organizers, set organized events
            if (user.role === 'organizer' || user.role === 'admin') {
              const organized = mockEvents.filter((_, index) => index % 2 === 1); // Just for demonstration
              setOrganizedEvents(organized);
            }
          }
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching events:', error);
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, [user]);
  
  // Determine if user is an organizer
  const isOrganizer = user && (user.role === 'organizer' || user.role === 'admin');
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Events</h1>
        
        <Tabs defaultValue="registered" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="registered">Registered Events</TabsTrigger>
            {isOrganizer && <TabsTrigger value="organized">My Organized Events</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="registered">
            {isLoading ? (
              <div className="text-center py-8">Loading your events...</div>
            ) : registeredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {registeredEvents.map((event: any) => (
                  <EventCard
                    key={event._id}
                    id={event._id}
                    title={event.title}
                    date={format(new Date(event.date), 'PPP')}
                    location={event.location}
                    image={event.image}
                    category={event.category}
                    attendees={event.attendees ? event.attendees.length : 0}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg text-gray-600 mb-4">You haven't registered for any events yet.</p>
                <Button asChild>
                  <Link to="/browse">Browse Events</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          {isOrganizer && (
            <TabsContent value="organized">
              {isLoading ? (
                <div className="text-center py-8">Loading your organized events...</div>
              ) : organizedEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {organizedEvents.map((event: any) => (
                    <EventCard
                      key={event._id}
                      id={event._id}
                      title={event.title}
                      date={format(new Date(event.date), 'PPP')}
                      location={event.location}
                      image={event.image}
                      category={event.category}
                      attendees={event.attendees ? event.attendees.length : 0}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-lg text-gray-600 mb-4">You haven't organized any events yet.</p>
                  <Button asChild>
                    <Link to="/create-event">Create Event</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyEvents;
