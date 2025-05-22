import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, DollarSign, User } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { useApi, isBackendAvailable } from '@/services/api';
import { toast } from 'sonner';

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const api = useApi();
  const [event, setEvent] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [availableSeats, setAvailableSeats] = useState(0);
  const [isHouseFull, setIsHouseFull] = useState(false);
  
  // Check if user is an organizer (can't register)
  const isOrganizer = user?.role === 'organizer';
  
  // Check if user is the event organizer (can edit)
  const isEventOrganizer = event && user && event.organizer._id === user._id;

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      setIsLoading(true);
      
      try {
        // Check if backend is available
        const backendAvailable = await isBackendAvailable();
        
        if (backendAvailable) {
          // Fetch event from API
          const response = await api.events.getById(id);
          
          if (response.status === 'success') {
            setEvent(response.data.event);
            setAvailableSeats(response.data.availableSeats);
            setIsHouseFull(response.data.isHouseFull);
            
            // Check if user is registered
            const userAttendees = response.data.event.attendees || [];
            if (user && userAttendees.some((attendee: any) => attendee._id === user._id)) {
              setIsRegistered(true);
            }
          }
        } else {
          // Use mock data for frontend-only version
          const mockEvent = {
            _id: '1',
            title: 'Tech Conference 2023',
            description: 'Join us for the leading tech conference of the year!',
            date: new Date('2023-11-15'),
            location: 'San Francisco, CA',
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
            category: 'technology',
            ticketPrice: 99,
            capacity: 1500,
            organizer: {
              _id: 'org1',
              name: 'Tech Events Inc.',
              email: 'info@techevents.com',
              profileImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2070&auto=format&fit=crop'
            },
            attendees: [
              { _id: 'user1', name: 'Alice' },
              { _id: 'user2', name: 'Bob' },
            ]
          };
          
          setEvent(mockEvent);
          setAvailableSeats(mockEvent.capacity - mockEvent.attendees.length);
          setIsHouseFull(mockEvent.attendees.length >= mockEvent.capacity);
          
          if (user && mockEvent.attendees.some(attendee => attendee._id === user._id)) {
            setIsRegistered(true);
          }
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvent();
  }, [id, user]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to register for events');
      return;
    }
    
    if (isOrganizer) {
      toast.error('Organizers cannot register for events');
      return;
    }
    
    if (isRegistered) {
      toast.info('You are already registered for this event');
      return;
    }
    
    if (isHouseFull) {
      toast.error('Sorry, this event is full');
      return;
    }
    
    try {
      setRegistrationLoading(true);
      
      const response = await api.registerForEvent(id as string);
      
      if (response.status === 'success') {
        setIsRegistered(true);
        setAvailableSeats(response.data.availableSeats);
        setIsHouseFull(response.data.isHouseFull);
        toast.success('Successfully registered for the event');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register for the event');
    } finally {
      setRegistrationLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24">
        {isLoading ? (
          <div className="text-center py-8">Loading event details...</div>
        ) : event ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Event Image */}
            <div>
              <Card>
                <img
                  src={event.image}
                  alt={event.title}
                  className="aspect-video w-full object-cover rounded-md"
                />
              </Card>
            </div>
            
            {/* Event Details */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
              <p className="text-muted-foreground mb-6">{event.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{format(new Date(event.date), 'PPP p')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>
                    {availableSeats > 0
                      ? `${availableSeats} seats available`
                      : isHouseFull
                        ? 'Event is full'
                        : 'Limited seats available'}
                  </span>
                </div>
                {event.ticketPrice > 0 && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Ticket Price: ${event.ticketPrice}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span>
                    Organized by:
                    <Link to={`/profile/${event.organizer._id}`} className="ml-1 font-medium hover:underline">
                      {event.organizer.name}
                    </Link>
                  </span>
                </div>
                
                {/* Category Badge */}
                <Badge variant="secondary">{event.category}</Badge>
              </div>
              
              {/* Registration Button */}
              <div className="mt-8">
                {isEventOrganizer ? (
                  <Button asChild>
                    <Link to={`/edit-event/${id}`}>Edit Event</Link>
                  </Button>
                ) : (
                  <Button 
                    onClick={handleRegister}
                    disabled={isOrganizer || isRegistered || isHouseFull || registrationLoading}
                    className={isOrganizer ? 'cursor-not-allowed' : ''}
                  >
                    {isOrganizer
                      ? 'Organizers cannot register'
                      : isRegistered
                        ? 'Registered'
                        : isHouseFull
                          ? 'Event Full'
                          : registrationLoading
                            ? 'Registering...'
                            : 'Register'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">Event not found</div>
        )}
      </div>
    </Layout>
  );
};

export default EventDetails;
