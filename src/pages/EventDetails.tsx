
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Users, Heart, Share, ArrowLeft } from 'lucide-react';
import { EventCard, EventCardProps } from '@/components/EventCard';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Sample event data
const eventData = {
  id: '1',
  title: 'Tech Conference 2023',
  description: 'Join us for the largest tech conference in the city! Network with industry experts, attend workshops, and learn about the latest trends in technology. This three-day event will cover topics ranging from artificial intelligence to blockchain technology.',
  date: 'Oct 15-17, 2023',
  time: '9:00 AM - 5:00 PM',
  location: 'San Francisco Convention Center, San Francisco, CA',
  category: 'Technology',
  price: '$299',
  capacity: 1500,
  attendees: 1200,
  images: [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop',
  ],
  organizer: {
    name: 'TechEvents Inc.',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop',
    description: 'Leading technology event organizer with over 10 years of experience.',
  }
};

// Similar events
const similarEvents: EventCardProps[] = [
  {
    id: '2',
    title: 'Web Development Summit',
    date: 'Nov 5-7, 2023',
    location: 'Austin, TX',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop',
    category: 'Technology',
    attendees: 850,
  },
  {
    id: '3',
    title: 'AI Conference 2023',
    date: 'Dec 12-14, 2023',
    location: 'Seattle, WA',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
    category: 'Technology',
    attendees: 1200,
  },
  {
    id: '4',
    title: 'Blockchain Expo',
    date: 'Jan 20-22, 2024',
    location: 'New York, NY',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop',
    category: 'Technology',
    attendees: 950,
  },
];

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const handleRegister = () => {
    toast.success('Registration successful!');
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };
  
  // In a real app, we would fetch the event data based on the id
  // For now, we'll just use the sample data
  const event = eventData;
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-24">
        {/* Back button */}
        <div className="mb-6">
          <Button variant="link" className="pl-0" asChild>
            <Link to="/browse" className="flex items-center text-muted-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to events
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="space-y-2">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <img 
                  src={event.images[currentImageIndex]} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex space-x-2">
                {event.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-14 rounded overflow-hidden ${
                      index === currentImageIndex ? 'ring-2 ring-primary' : 'opacity-70'
                    }`}
                  >
                    <img src={image} alt={`${event.title} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Event Details */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge>{event.category}</Badge>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                  {Math.round((event.attendees / event.capacity) * 100)}% Full
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{event.date}</p>
                    <p className="text-muted-foreground text-sm">{event.time}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{event.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{event.attendees} people attending</p>
                    <p className="text-muted-foreground text-sm">{event.capacity - event.attendees} spots left</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-b py-6 my-6">
                <h2 className="text-xl font-semibold mb-4">About This Event</h2>
                <p className="text-muted-foreground whitespace-pre-line">{event.description}</p>
              </div>
              
              {/* Organizer */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Organizer</h2>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={event.organizer.image} alt={event.organizer.name} />
                    <AvatarFallback>{event.organizer.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{event.organizer.name}</p>
                    <p className="text-sm text-muted-foreground">{event.organizer.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-card rounded-lg border p-6 shadow-sm space-y-6">
                <div>
                  <p className="text-muted-foreground mb-1">Price</p>
                  <p className="text-2xl font-bold">{event.price}</p>
                </div>
                
                <div className="space-y-2">
                  <Button className="w-full" onClick={handleRegister}>
                    Register Now
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={toggleFavorite}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                      {isFavorite ? 'Saved' : 'Save'}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={handleShare}
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Event Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar Events */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarEvents.map((event) => (
              <div key={event.id} className="animate-fade-in">
                <EventCard {...event} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetails;
