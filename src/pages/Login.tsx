
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { api, isBackendAvailable } from '@/services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Check if backend is available
      const backendAvailable = await isBackendAvailable();
      
      if (backendAvailable) {
        // Backend is available, make real API call
        const response = await api.auth.login(email, password);
        
        if (response && response.data) {
          login(response.data);
          toast.success('Login successful!');
          
          if (response.data.role === 'organizer' || response.data.role === 'admin') {
            navigate('/dashboard');
          } else {
            navigate('/my-events');
          }
        }
      } else {
        // Mock user data (frontend-only)
        const mockUser = {
          _id: `user_${Date.now()}`,
          name: email.split('@')[0], // Use part of email as name
          email: email,
          role: 'user' as const // Fix: Use 'as const' to ensure correct type
        };
        
        // Simulate network delay
        setTimeout(() => {
          // Login successful
          login(mockUser);
          toast.success('Login successful! (Mock mode)');
          navigate('/my-events');
          setIsLoading(false);
        }, 800);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to sign in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" size="sm" className="px-0 font-normal text-xs">
                    Forgot password?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
              <div className="text-center text-sm mt-4">
                Don't have an account?{' '}
                <Button variant="link" className="p-0" asChild>
                  <Link to="/register">Sign up</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
