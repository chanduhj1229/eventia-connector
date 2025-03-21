
import React from 'react';
import { Layout } from '@/components/Layout';
import { Stats } from '@/components/Dashboard/Stats';
import { EventTable } from '@/components/Dashboard/EventTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
            <p className="text-muted-foreground">Manage your events and view analytics</p>
          </div>
          <Button className="mt-4 md:mt-0" asChild>
            <Link to="/create-event" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Link>
          </Button>
        </div>
        
        <div className="space-y-8">
          {/* Stats Section */}
          <section className="animate-fade-in">
            <Stats />
          </section>
          
          {/* Events Table */}
          <section className="animate-fade-in animate-delay-200">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Your Events</h2>
            </div>
            <EventTable />
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
