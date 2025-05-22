
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { EventTable } from '@/components/Dashboard/EventTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/services/api';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user } = useAuth();
  const api = useApi();
  const [eventLogs, setEventLogs] = useState([]);
  const [registrationLogs, setRegistrationLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch logs when component mounts
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const response = await api.getUserLogs();
        
        if (response && response.status === 'success') {
          setEventLogs(response.data.createdEvents || []);
          setRegistrationLogs(response.data.registrations || []);
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
        toast.error('Failed to load logs');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLogs();
  }, []);

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
          {/* Events Table */}
          <section className="animate-fade-in">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Your Events</h2>
            </div>
            <EventTable />
          </section>
          
          {/* Logs Section */}
          <section className="animate-fade-in">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Activity Logs</h2>
            </div>
            
            <Tabs defaultValue="events" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="events">Event Creation Logs</TabsTrigger>
                <TabsTrigger value="registrations">Registration Logs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="events">
                <Card>
                  <CardHeader>
                    <CardTitle>Events Created</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-8">Loading logs...</div>
                    ) : eventLogs.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4">Event</th>
                              <th className="text-left py-3 px-4">Date Created</th>
                            </tr>
                          </thead>
                          <tbody>
                            {eventLogs.map((log: any) => (
                              <tr key={log._id} className="border-b hover:bg-muted/50">
                                <td className="py-3 px-4">
                                  <Link to={`/event/${log.eventId._id}`} className="font-medium hover:underline">
                                    {log.eventId.title}
                                  </Link>
                                </td>
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
                        <p className="text-muted-foreground">You haven't created any events yet.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="registrations">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendee Registrations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-8">Loading logs...</div>
                    ) : registrationLogs.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4">Event</th>
                              <th className="text-left py-3 px-4">Attendee</th>
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
                                </td>
                                <td className="py-3 px-4">{log.userId?.name}</td>
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
                        <p className="text-muted-foreground">No attendees have registered for your events yet.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
