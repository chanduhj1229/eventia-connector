
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventCard } from '@/components/EventCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useApi, isBackendAvailable } from '@/services/api';
import { toast } from 'sonner';

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
  const api = useApi();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [organizedEvents, setOrganizedEvents] = useState([]);
  const [registrationLogs, setRegistrationLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch events when component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        // Check if backend is available
        const backendAvailable = await isBackendAvailable();
        
        if (backendAvailable && user) {
          // Get profile with events from backend
          const profileData = await api.getProfile();
          
          if (profileData && profileData.data) {
            // Set registered events
            setRegisteredEvents(profileData.data.registeredEvents || []);
            
            // Set organized events if user is organizer
            if (user.role === 'organizer' || user.role === 'admin') {
              setOrganizedEvents(profileData.data.events || []);
            }
          }
          
          // Fetch registration logs
          const response = await fetch('http://localhost:5000/api/users/logs', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          });
          
          if (response.ok) {
            const logsData = await response.json();
            if (logsData.status === 'success') {
              setRegistrationLogs(logsData.data.registrations || []);
            }
          }
        } else {
          // Use mock data for frontend-only version
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
              
              // Mock registration logs
              const mockLogs = [
                {
                  _id: 'log1',
                  eventId: {
                    _id: '1',
                    title: 'Tech Conference 2023',
                    date: new Date('2023-11-15'),
                    location: 'San Francisco, CA'
                  },
                  organizerId: {
                    name: 'Tech Events Inc.'
                  },
                  timestamp: new Date('2023-10-01')
                }
              ];
              setRegistrationLogs(mockLogs);
            }
            setIsLoading(false);
          }, 800);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events');
      } finally {
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
            <TabsTrigger value="logs">Registration Logs</TabsTrigger>
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
          
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Your Registration History</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading registration logs...</div>
                ) : registrationLogs.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Event</th>
                          <th className="text-left py-3 px-4">Organizer</th>
                          <th className="text-left py-3 px-4">Registration Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registrationLogs.map((log: any) => (
                          <tr key={log._id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <Link to={`/event/${log.eventId._id}`} className="font-medium hover:underline">
                                {log.eventId.title}
                              </Link>
                              <div className="text-sm text-muted-foreground">
                                {log.eventId.location}
                              </div>
                            </td>
                            <td className="py-3 px-4">{log.organizerId.name}</td>
                            <td className="py-3 px-4">
                              {format(new Date(log.timestamp), 'PPP p')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No registration history found.</p>
                  </div>
                )}
              </CardContent>
            </Card>
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
