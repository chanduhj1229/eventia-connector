
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  category: string;
  attendees: number;
  featured?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  date,
  location,
  image,
  category,
  attendees,
  featured = false,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link to={`/event/${id}`}>
      <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
        featured ? 'transform-gpu hover:-translate-y-1' : ''
      }`}>
        <div className="aspect-video relative overflow-hidden">
          <div className="image-blur-wrapper">
            <div className={`image-blur ${imageLoaded ? 'loaded' : ''}`} style={{ backgroundImage: `url(${image})` }}></div>
            <img
              src={image}
              alt={title}
              className={`image-main ${imageLoaded ? 'loaded' : ''} object-cover w-full h-full`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          <Badge className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm hover:bg-black/80">
            {category}
          </Badge>
        </div>
        <CardContent className="pt-4">
          <h3 className="text-lg font-medium line-clamp-2 mb-2">{title}</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{date}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 pb-4">
          <div className="flex items-center text-xs text-muted-foreground">
            <Users className="h-3 w-3 mr-1" />
            <span>{attendees} attending</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
