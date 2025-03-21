
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { EventCard, EventCardProps } from './EventCard';
import { Button } from '@/components/ui/button';

// Sample data for featured events
const featuredEvents: EventCardProps[] = [
  {
    id: '1',
    title: 'Tech Conference 2023',
    date: 'Oct 15-17, 2023',
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
    category: 'Technology',
    attendees: 1200,
    featured: true,
  },
  {
    id: '2',
    title: 'Music Festival',
    date: 'Nov 5-7, 2023',
    location: 'Austin, TX',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop',
    category: 'Music',
    attendees: 5000,
    featured: true,
  },
  {
    id: '3',
    title: 'Design Workshop',
    date: 'Sep 25, 2023',
    location: 'New York, NY',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
    category: 'Design',
    attendees: 150,
    featured: true,
  },
  {
    id: '4',
    title: 'Food & Wine Festival',
    date: 'Oct 8-10, 2023',
    location: 'Napa Valley, CA',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop',
    category: 'Food',
    attendees: 800,
    featured: true,
  },
];

export const FeaturedEvents: React.FC = () => {
  return (
    <section id="featured-events" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-12">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl font-bold mb-2">Featured Events</h2>
            <p className="text-muted-foreground max-w-2xl">
              Discover curated experiences tailored to your interests and passions
            </p>
          </div>
          <Button variant="link" className="group flex items-center">
            View all events
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredEvents.map((event, index) => (
            <div 
              key={event.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <EventCard {...event} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
