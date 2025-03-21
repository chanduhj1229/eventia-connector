
import React from 'react';
import { Layout } from '@/components/Layout';
import { EventForm } from '@/components/EventForm';

const CreateEvent = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create a New Event</h1>
          <p className="text-muted-foreground">
            Fill in the details below to create your event
          </p>
        </div>
        
        <EventForm />
      </div>
    </Layout>
  );
};

export default CreateEvent;
