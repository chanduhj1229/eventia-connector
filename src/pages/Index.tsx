
import React from 'react';
import { Layout } from '@/components/Layout';
import { Hero } from '@/components/Hero';
import { SearchBar } from '@/components/SearchBar';
import { FeaturedEvents } from '@/components/FeaturedEvents';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Users, Map } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      {/* Hero section */}
      <Hero />
      
      {/* Search Bar */}
      <div className="relative -mt-8 z-10 mb-16">
        <SearchBar />
      </div>
      
      {/* Featured Events */}
      <FeaturedEvents />
      
      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider bg-secondary rounded-full mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl font-bold mb-4">Simplify Your Event Management</h2>
            <p className="text-muted-foreground">
              Our platform provides everything you need to create, manage, and promote your events with ease.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 animate-fade-in animate-delay-100">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-secondary mb-4">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Easy Event Creation</h3>
              <p className="text-muted-foreground">
                Create beautiful event pages in minutes with our intuitive event creation tools.
              </p>
            </div>
            
            <div className="text-center p-6 animate-fade-in animate-delay-200">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-secondary mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Attendee Management</h3>
              <p className="text-muted-foreground">
                Easily manage registrations, check-ins, and communicate with your attendees.
              </p>
            </div>
            
            <div className="text-center p-6 animate-fade-in animate-delay-300">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-secondary mb-4">
                <Map className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Powerful Analytics</h3>
              <p className="text-muted-foreground">
                Gain insights into your event performance with detailed analytics and reports.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button className="rounded-full px-8" asChild>
              <a href="/dashboard" className="group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-8 md:mb-0 md:max-w-xl">
              <h2 className="text-3xl font-bold mb-4">Ready to Host Your Next Event?</h2>
              <p className="opacity-90 mb-6">
                Join thousands of event organizers who trust our platform for their events. Get started today!
              </p>
              <Button variant="outline" size="lg" className="rounded-full border-white/20 hover:bg-white/10" asChild>
                <a href="/create-event">Create an Event</a>
              </Button>
            </div>
            
            <div className="w-full md:w-2/5 lg:w-1/3">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <h3 className="text-xl font-medium mb-4">Join Our Community</h3>
                <p className="opacity-90 mb-4">Sign up to receive updates about new features and events.</p>
                <div className="flex">
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="rounded-l-full rounded-r-none border-white/20 bg-white/5 focus:ring-white/20"
                  />
                  <Button className="rounded-r-full rounded-l-none">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

import { Input } from '@/components/ui/input';

export default Index;
