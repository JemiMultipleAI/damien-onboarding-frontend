'use client';

import { Play, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VideoCardProps {
  title: string;
  duration: string;
  isCompleted?: boolean;
  thumbnail: string;
  onClick: () => void;
}

export const VideoCard = ({ title, duration, isCompleted, thumbnail, onClick }: VideoCardProps) => {
  return (
    <Card 
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg border-border bg-card"
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="rounded-full bg-primary p-4 transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play className="h-8 w-8 text-primary-foreground fill-current" />
          </div>
        </div>
        {isCompleted && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-green-500 hover:bg-green-600 text-white border-0">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-card-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          {duration}
        </div>
      </CardContent>
    </Card>
  );
};
