import { useState, useEffect } from "react";
import { VideoCard } from "@/components/VideoCard";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Progress } from "@/components/ui/progress";
import { BookOpen, GraduationCap, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface Video {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  thumbnail: string;
  videoUrl?: string;
}

const Index = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  ]);

  // Load initial progress from backend
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Initial video list
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
        ];

        // Fetch user progress from backend
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

        // Load video durations and update completion status
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
        // Still load videos even if progress fails
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
              
              videoElement.src = video.videoUrl;
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
    // Update local state immediately for better UX
    setVideos(prev => prev.map(v => 
      v.id === videoId ? { ...v, isCompleted: true } : v
    ));

    // Optionally sync with backend (progress is already saved by backend)
    // This is just for local state management
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading onboarding content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Error Alert */}
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

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent py-16 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAyYy0yLjIxIDAtNCAxLjc5LTQgNHMxLjc5IDQgNCA0IDQtMS43OSA0LTQtMS43OS00LTQtNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-10"></div>
        <div className="max-w-6xl mx-auto relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              KissFlow Onboarding
            </h1>
          </div>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl">
            Master KissFlow with our comprehensive video tutorials. Learn at your own pace and become a workflow automation expert.
          </p>
        </div>
      </header>

      {/* Progress Section */}
      <div className="max-w-6xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-card-foreground">Your Progress</h3>
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {completedCount} of {videos.length} completed
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Video Grid */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">Training Videos</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Click on any video to start learning</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              title={video.title}
              duration={video.duration}
              isCompleted={video.isCompleted}
              thumbnail={video.thumbnail}
              onClick={() => handleVideoClick(video)}
            />
          ))}
        </div>
      </main>

      {/* Video Player Modal */}
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
};

export default Index;
