
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';

// Sample data for statistics
const attendanceData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 500 },
  { name: 'Apr', value: 280 },
  { name: 'May', value: 590 },
  { name: 'Jun', value: 800 },
];

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon, trend }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-8 w-8 rounded-full bg-secondary/50 flex items-center justify-center">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="flex items-center text-xs text-muted-foreground">
        {trend && (
          <span className={`mr-1 flex items-center ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            <TrendingUp className={`h-3 w-3 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </span>
        )}
        <CardDescription className="text-xs">{description}</CardDescription>
      </div>
    </CardContent>
  </Card>
);

export const Stats: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Attendees"
          value="12,534"
          description="across all events"
          icon={<Users className="h-4 w-4" />}
          trend={12}
        />
        <StatCard
          title="Active Events"
          value="48"
          description="currently live"
          icon={<Calendar className="h-4 w-4" />}
          trend={8}
        />
        <StatCard
          title="Revenue"
          value="$28,392"
          description="total earnings"
          icon={<DollarSign className="h-4 w-4" />}
          trend={24}
        />
        <StatCard
          title="Conversion Rate"
          value="24.8%"
          description="from page visits"
          icon={<TrendingUp className="h-4 w-4" />}
          trend={-3}
        />
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Attendance Overview</CardTitle>
          <CardDescription>Monthly attendance across all events</CardDescription>
        </CardHeader>
        <CardContent className="p-0 pb-4">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
                    border: 'none' 
                  }} 
                />
                <Bar 
                  dataKey="value" 
                  fill="currentColor" 
                  className="text-primary/80" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
