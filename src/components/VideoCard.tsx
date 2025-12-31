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
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border bg-card"
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="rounded-full bg-primary p-4 transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-lg group-hover:shadow-2xl">
            <Play className="h-8 w-8 text-primary-foreground fill-current" />
          </div>
        </div>
        {isCompleted && (
          <div className="absolute top-3 right-3 animate-in zoom-in duration-300">
            <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-lg">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4 group-hover:bg-muted/30 transition-colors duration-300">
        <h3 className="font-semibold text-lg mb-2 text-card-foreground group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          <Clock className="h-4 w-4 mr-1" />
          {duration}
        </div>
      </CardContent>
    </Card>
  );
};
