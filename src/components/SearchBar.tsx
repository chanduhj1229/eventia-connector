
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';

type SelectedDate = Date | undefined;

export const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState<SelectedDate>(undefined);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct search params
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (location) params.append('location', location);
    if (category) params.append('category', category);
    if (date) params.append('date', format(date, 'yyyy-MM-dd'));
    
    // Navigate to search results
    navigate(`/browse?${params.toString()}`);
  };
  
  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <form 
        onSubmit={handleSearch}
        className="glass-morphism p-4 rounded-2xl flex flex-col md:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search events..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-12 rounded-xl border-0 bg-transparent"
          />
        </div>
        
        <div className="flex flex-1 md:flex-row gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10 h-12 rounded-xl border-0 bg-transparent"
            />
          </div>
          
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-10 h-12 rounded-xl border-0 bg-transparent focus:ring-0 appearance-none cursor-pointer"
            >
              <option value="">Category</option>
              <option value="music">Music</option>
              <option value="technology">Technology</option>
              <option value="food">Food & Drink</option>
              <option value="arts">Arts & Culture</option>
              <option value="business">Business</option>
            </select>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="flex-1 md:w-auto h-12 rounded-xl border-0 bg-transparent justify-start pl-3 relative"
              >
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                {date ? format(date, 'PPP') : <span className="text-muted-foreground">Date</span>}
                {date && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 absolute right-3 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDate(undefined);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="p-3"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <Button type="submit" className="h-12 px-8 rounded-xl">
          Search
        </Button>
      </form>
    </div>
  );
};
