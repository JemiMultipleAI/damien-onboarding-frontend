'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { VideoCard } from "@/components/VideoCard";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Progress } from "@/components/ui/progress";
import { BookOpen, GraduationCap, AlertCircle, LogOut, User, Settings } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Video {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  thumbnail: string;
  videoUrl?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([
    {
      id: "1",
      title: "Introduction to KissFlow",
      duration: "Loading...",
      isCompleted: false,
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
      videoUrl: "/videos/intro.mp4",
    },
    {
      id: "2",
      title: "Conditional Visibility",
      duration: "Loading...",
      isCompleted: false,
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
      videoUrl: "/videos/conditional-visibility.mp4",
    },
    {
      id: "3",
      title: "Accessing Process",
      duration: "Loading...",
      isCompleted: false,
      thumbnail: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=450&fit=crop",
      videoUrl: "/videos/accessing-process.mp4",
    },
    {
      id: "4",
      title: "Managing Items - Initiator",
      duration: "Loading...",
      isCompleted: false,
      thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=450&fit=crop",
      videoUrl: "/videos/managing-items-initiator.mp4",
    },
    {
      id: "5",
      title: "Managing Items - Assignee",
      duration: "Loading...",
      isCompleted: false,
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop",
      videoUrl: "/videos/managing-items-assignee.mp4",
    },
    {
      id: "6",
      title: "Video",
      duration: "Loading...",
      isCompleted: false,
      thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop",
      videoUrl: "/videos/video.mp4",
    },
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("onboardAIUser");
    if (!stored) {
      router.replace("/login");
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      setUserName(parsed.username ?? "demo");
    } catch {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        const initialVideos: Video[] = [
          {
            id: "1",
            title: "Introduction to KissFlow",
            duration: "Loading...",
            isCompleted: false,
            thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
            videoUrl: "/videos/intro.mp4",
          },
          {
            id: "2",
            title: "Conditional Visibility",
            duration: "Loading...",
            isCompleted: false,
            thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
            videoUrl: "/videos/conditional-visibility.mp4",
          },
          {
            id: "3",
            title: "Accessing Process",
            duration: "Loading...",
            isCompleted: false,
            thumbnail: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=450&fit=crop",
            videoUrl: "/videos/accessing-process.mp4",
          },
          {
            id: "4",
            title: "Managing Items - Initiator",
            duration: "Loading...",
            isCompleted: false,
            thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=450&fit=crop",
            videoUrl: "/videos/managing-items-initiator.mp4",
          },
          {
            id: "5",
            title: "Managing Items - Assignee",
            duration: "Loading...",
            isCompleted: false,
            thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop",
            videoUrl: "/videos/managing-items-assignee.mp4",
          },
          {
            id: "6",
            title: "Video",
            duration: "Loading...",
            isCompleted: false,
            thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop",
            videoUrl: "/videos/video.mp4",
          },
        ];

        const progressResponse = await fetch(`${API_BASE_URL}/api/videos/progress?userId=default`);

        if (!progressResponse.ok) {
          throw new Error("Failed to load progress");
        }

        const progressData = await progressResponse.json();
        const completedVideoIds = new Set(
          progressData.progress
            .filter((p: { completed: boolean }) => p.completed)
            .map((p: { videoId: string }) => p.videoId)
        );

        const updatedVideos = await Promise.all(
          initialVideos.map(async (video) => {
            let duration = "Loading...";

            if (video.videoUrl) {
              duration = await new Promise<string>((resolve) => {
                const videoElement = document.createElement('video');
                videoElement.preload = 'metadata';

                videoElement.onloadedmetadata = () => {
                  const dur = videoElement.duration;
                  const minutes = Math.floor(dur / 60);
                  const seconds = Math.floor(dur % 60);
                  resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
                };

                videoElement.onerror = () => {
                  resolve("N/A");
                };

                videoElement.src = video.videoUrl!;
              });
            }

            return {
              ...video,
              duration,
              isCompleted: completedVideoIds.has(video.id)
            };
          })
        );

        setVideos(updatedVideos);
      } catch (err) {
        console.error("Error loading initial data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");

        const initialVideos: Video[] = [
          {
            id: "1",
            title: "Introduction to KissFlow",
            duration: "Loading...",
            isCompleted: false,
            thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
            videoUrl: "/videos/intro.mp4",
          },
          {
            id: "2",
            title: "Conditional Visibility",
            duration: "Loading...",
            isCompleted: false,
            thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
            videoUrl: "/videos/conditional-visibility.mp4",
          },
          {
            id: "3",
            title: "Accessing Process",
            duration: "Loading...",
            isCompleted: false,
            thumbnail: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=450&fit=crop",
            videoUrl: "/videos/accessing-process.mp4",
          },
          {
            id: "4",
            title: "Managing Items - Initiator",
            duration: "Loading...",
            isCompleted: false,
            thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=450&fit=crop",
            videoUrl: "/videos/managing-items-initiator.mp4",
          },
          {
            id: "5",
            title: "Managing Items - Assignee",
            duration: "Loading...",
            isCompleted: false,
            thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop",
            videoUrl: "/videos/managing-items-assignee.mp4",
          },
          {
            id: "6",
            title: "Video",
            duration: "Loading...",
            isCompleted: false,
            thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop",
            videoUrl: "/videos/video.mp4",
          },
        ];
        const updatedVideos = await Promise.all(
          initialVideos.map(async (video) => {
            if (!video.videoUrl) return video;

            return new Promise<Video>((resolve) => {
              const videoElement = document.createElement('video');
              videoElement.preload = 'metadata';

              videoElement.onloadedmetadata = () => {
                const duration = videoElement.duration;
                const minutes = Math.floor(duration / 60);
                const seconds = Math.floor(duration % 60);
                const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

                resolve({
                  ...video,
                  duration: formattedDuration
                });
              };

              videoElement.onerror = () => {
                resolve({
                  ...video,
                  duration: "N/A"
                });
              };

              videoElement.src = video.videoUrl!;
            });
          })
        );
        setVideos(updatedVideos);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const completedCount = videos.filter(v => v.isCompleted).length;
  const progressPercentage = (completedCount / videos.length) * 100;

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  const handleVideoComplete = async (videoId: string) => {
    setVideos(prev => prev.map(v =>
      v.id === videoId ? { ...v, isCompleted: true } : v
    ));
  };

  const handleLogout = () => {
    localStorage.removeItem("onboardAIUser");
    router.replace("/login");
  };

  if (loading || !userName) {
    return (
      <div className="min-h-screen bg-background animate-in fade-in duration-500">
        <div className="border-b border-border bg-card/70 backdrop-blur">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="space-y-6">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Skeleton className="h-64 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background animate-in fade-in duration-500">
      <div className="border-b border-border bg-card/70 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
          <div className="transition-opacity hover:opacity-80">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              OnboardAI
            </p>
            <p className="text-lg font-semibold">KissFlow Onboarding</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 hover:opacity-80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full group">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold group-hover:text-primary transition-colors">{userName}</p>
                  <p className="text-xs text-muted-foreground">Demo user</p>
                </div>
                <Avatar className="h-10 w-10 border-2 border-primary/20 group-hover:border-primary/40 transition-all duration-200 group-hover:scale-105 shadow-sm group-hover:shadow-md">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold uppercase">
                    {userName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 animate-in fade-in-0 zoom-in-95">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">demo@onboardai.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer transition-colors">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer transition-colors">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950 transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {error && (
        <div className="max-w-6xl mx-auto px-4 pt-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}. Progress may not be synced. Please refresh the page.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <header className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent py-8 md:py-12 px-4 transition-all duration-300">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAyYy0yLjIxIDAtNCAxLjc5LTQgNHMxLjc5IDQgNCA0IDQtMS43OSA0LTQtMS43OS00LTQtNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-10 animate-pulse"></div>
        <div className="max-w-6xl mx-auto relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-105 hover:rotate-3 duration-300">
              <GraduationCap className="h-5 w-5 md:h-7 md:w-7 text-white" />
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white transition-all duration-300">
              KissFlow Onboarding
            </h1>
          </div>
          <p className="text-white/90 text-sm md:text-lg lg:text-xl max-w-2xl">
            Master KissFlow with interactive video tutorials and AI-powered guidance.
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 group">
              <BookOpen className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-200" />
              <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors duration-200">Your Progress</h3>
            </div>
            <span className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
              {completedCount} of {videos.length} completed
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2 transition-all duration-500" />
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 transition-colors hover:text-primary duration-200">Training Videos</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Click on any video to start learning</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {videos.map((video, index) => (
            <div 
              key={video.id}
              className="animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <VideoCard
                title={video.title}
                duration={video.duration}
                isCompleted={video.isCompleted}
                thumbnail={video.thumbnail}
                onClick={() => handleVideoClick(video)}
              />
            </div>
          ))}
        </div>
      </main>

      {selectedVideo && (
        <VideoPlayer
          videoId={selectedVideo.id}
          title={selectedVideo.title}
          videoUrl={selectedVideo.videoUrl}
          onClose={() => setSelectedVideo(null)}
          onComplete={() => handleVideoComplete(selectedVideo.id)}
        />
      )}
    </div>
  );
}

