import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, CheckCircle2, Volume2, Settings } from 'lucide-react';
import { Stage } from '../../contexts/AppContext';

interface VideoTabProps {
  stage: Stage;
}

const VideoTab: React.FC<VideoTabProps> = ({ stage }) => {
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());

  // Mock YouTube video IDs for demo
  const demoVideos = [
    {
      id: 'dQw4w9WgXcQ',
      title: `${stage.title} - Introduction`,
      duration: '12:34',
      description: 'Get started with the fundamentals of this topic',
      difficulty: 'Beginner'
    },
    {
      id: 'oHg5SJYRHA0',
      title: `${stage.title} - Core Concepts`,
      duration: '18:45',
      description: 'Deep dive into the essential concepts you need to master',
      difficulty: 'Intermediate'
    },
    {
      id: 'jNQXAC9IVRw',
      title: `${stage.title} - Practical Examples`,
      duration: '15:22',
      description: 'See real-world applications and examples',
      difficulty: 'Intermediate'
    },
    {
      id: 'y6120QOlsfU',
      title: `${stage.title} - Advanced Techniques`,
      duration: '22:10',
      description: 'Master advanced techniques and best practices',
      difficulty: 'Advanced'
    },
    {
      id: 'fJ9rUzIMcZQ',
      title: `${stage.title} - Review & Summary`,
      duration: '8:30',
      description: 'Comprehensive review of all concepts covered',
      difficulty: 'Beginner'
    }
  ];

  const markAsWatched = (videoId: string) => {
    setWatchedVideos(prev => new Set(prev).add(videoId));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Video Lessons</h2>
        <p className="text-muted-foreground">
          Watch these curated videos to master {stage.title.toLowerCase()}
        </p>
      </div>

      <div className="grid gap-6">
        {demoVideos.map((video, index) => {
          const isWatched = watchedVideos.has(video.id);
          
          return (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="grid md:grid-cols-3 gap-0">
                  {/* Video Thumbnail */}
                  <div className="relative aspect-video bg-gray-900">
                    <img
                      src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Button
                        size="lg"
                        className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                        onClick={() => {
                          // In a real app, this would open the video player
                          markAsWatched(video.id);
                          window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
                        }}
                      >
                        <Play className="w-6 h-6 mr-2" />
                        {isWatched ? 'Watch Again' : 'Play Video'}
                      </Button>
                    </div>
                    {isWatched && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      </div>
                    )}
                  </div>

                  {/* Video Details */}
                  <div className="md:col-span-2">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{video.title}</CardTitle>
                          <CardDescription className="mb-3">
                            {video.description}
                          </CardDescription>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>{video.duration}</span>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={getDifficultyColor(video.difficulty)}
                            >
                              {video.difficulty}
                            </Badge>
                            {isWatched && (
                              <Badge variant="outline" className="bg-green-100 text-green-700">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Watched
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => {
                            markAsWatched(video.id);
                            window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
                          }}
                          className="btn-gradient"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {isWatched ? 'Watch Again' : 'Start Watching'}
                        </Button>
                        
                        <Button variant="outline" size="sm">
                          <Volume2 className="w-4 h-4 mr-2" />
                          Transcript
                        </Button>
                        
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-2" />
                          Notes
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1">Video Progress</h3>
              <p className="text-muted-foreground">
                {watchedVideos.size} of {demoVideos.length} videos completed
              </p>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {Math.round((watchedVideos.size / demoVideos.length) * 100)}%
            </div>
          </div>
          {watchedVideos.size === demoVideos.length && (
            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Congratulations! All videos completed! 🎉</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VideoTab;