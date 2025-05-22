import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { SearchBar } from '@/components/SearchBar';
import { EventCard, EventCardProps } from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api, isBackendAvailable } from '@/services/api';
import { format } from 'date-fns';
import { toast } from 'sonner';

// Sample events data for fallback
const mockEvents = [
  {
    id: '1',
    title: 'Tech Conference 2023',
    date: 'Oct 15-17, 2023',
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
    category: 'Technology',
    attendees: 1200,
  },
  {
    id: '2',
    title: 'Music Festival',
    date: 'Nov 5-7, 2023',
    location: 'Austin, TX',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop',
    category: 'Music',
    attendees: 5000,
  },
  {
    id: '3',
    title: 'Design Workshop',
    date: 'Sep 25, 2023',
    location: 'New York, NY',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
    category: 'Design',
    attendees: 150,
  },
  {
    id: '4',
    title: 'Food & Wine Festival',
    date: 'Oct 8-10, 2023',
    location: 'Napa Valley, CA',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop',
    category: 'Food',
    attendees: 800,
  },
  {
    id: '5',
    title: 'Business Summit 2023',
    date: 'Dec 10-12, 2023',
    location: 'Chicago, IL',
    image: 'https://images.unsplash.com/photo-1559223607-b1ba3e9b5a10?q=80&w=2070&auto=format&fit=crop',
    category: 'Business',
    attendees: 350,
  },
  {
    id: '6',
    title: 'Photography Exhibition',
    date: 'Nov 15-20, 2023',
    location: 'Los Angeles, CA',
    image: 'https://images.unsplash.com/photo-1554692918-08dcf9738661?q=80&w=2070&auto=format&fit=crop',
    category: 'Arts',
    attendees: 500,
  },
  {
    id: '7',
    title: 'Fitness Convention',
    date: 'Jan 5-7, 2024',
    location: 'Miami, FL',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop',
    category: 'Sports',
    attendees: 1200,
  },
  {
    id: '8',
    title: 'Literature Festival',
    date: 'Oct 20-22, 2023',
    location: 'Boston, MA',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=2070&auto=format&fit=crop',
    category: 'Education',
    attendees: 600,
  },
];

const Browse = () => {
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date');
  
  // Fetch real events from API
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Check if backend is available
        const backendAvailable = await isBackendAvailable();
        
        if (backendAvailable) {
          // Build filter parameters
          const filters: any = {};
          
          const category = searchParams.get('category');
          const location = searchParams.get('location');
          const date = searchParams.get('date');
          
          if (category) filters.category = category;
          if (location) filters.location = location;
          if (date) filters.date = date;
          
          // Fetch events from API
          const response = await api.events.getAll(filters);
          
          if (response && response.status === 'success') {
            const apiEvents = response.data.events.map((event: any) => ({
              id: event._id,
              title: event.title,
              date: format(new Date(event.date), 'PPP'),
              location: event.location,
              image: event.image,
              category: event.category,
              attendees: event.attendees ? event.attendees.length : 0,
            }));
            
            setEvents(apiEvents);
            setFilteredEvents(apiEvents);
          }
        } else {
          // Use mock data if backend is not available
          setTimeout(() => {
            setEvents(mockEvents);
            setFilteredEvents(mockEvents);
            setLoading(false);
          }, 1000);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events');
        setEvents(mockEvents);
        setFilteredEvents(mockEvents);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [searchParams]);
  
  // Apply filters and sorting
  useEffect(() => {
    if (events.length === 0) return;
    
    let filtered = [...events];
    
    const query = searchParams.get('q');
    
    if (query) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Sort events
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'popular') {
        return b.attendees - a.attendees;
      } else {
        return a.title.localeCompare(b.title);
      }
    });
    
    setFilteredEvents(filtered);
  }, [events, searchParams, sortBy]);
  
  return (
    <Layout>
      <div className="bg-muted/50 border-b">
        <div className="container mx-auto px-4 py-20">
          <h1 className="text-3xl font-bold mb-6">Browse Events</h1>
          <SearchBar />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-1">
              {loading 
                ? 'Loading events...' 
                : `${filteredEvents.length} events found`
              }
            </h2>
            {searchParams.toString() && (
              <p className="text-sm text-muted-foreground">
                Filtered by your search criteria
              </p>
            )}
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <span className="text-sm text-muted-foreground mr-2">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date (Upcoming)</SelectItem>
                <SelectItem value="popular">Popularity</SelectItem>
                <SelectItem value="name">Name (A to Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            // Skeleton loaders
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="aspect-video rounded-md" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : filteredEvents.length > 0 ? (
            // Event cards
            filteredEvents.map((event, index) => (
              <div 
                key={event.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <EventCard {...event} />
              </div>
            ))
          ) : (
            // No results
            <div className="col-span-full text-center py-12">
              <h3 className="text-lg font-medium mb-2">No events found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search filters to find more events
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/browse'}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
        
        {/* Load More Button */}
        {filteredEvents.length > 0 && filteredEvents.length < events.length && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Events
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Browse;
