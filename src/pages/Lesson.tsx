import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Video,
  FileText,
  MessageSquare,
  FileQuestion,
  GraduationCap,
  Play,
  Clock,
  CheckCircle2
} from 'lucide-react';
import VideoTab from '../components/LessonTabs/VideoTab';
import ArticlesTab from '../components/LessonTabs/ArticlesTab';
import ChatTab from '../components/LessonTabs/ChatTab';
import CaseStudyTab from '../components/LessonTabs/CaseStudyTab';
import QuizTab from '../components/LessonTabs/QuizTab';

const LessonPage = () => {
  const { skillId, stageId } = useParams();
  const navigate = useNavigate();
  const { getRoadmap } = useApp();
  const [activeTab, setActiveTab] = useState('video');
  
  const roadmap = getRoadmap(skillId!);
  const stage = roadmap?.stages.find(s => s.id === stageId);
  
  if (!roadmap || !stage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
          <Button onClick={() => navigate(`/roadmap/${skillId}`)}>
            Back to Roadmap
          </Button>
        </div>
      </div>
    );
  }

  const videoLessons = stage.lessons.filter(lesson => lesson.type === 'video');
  const articleLessons = stage.lessons.filter(lesson => lesson.type === 'article');

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => navigate(`/roadmap/${skillId}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Roadmap
            </Button>
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                {stage.title}
              </h1>
              <p className="text-muted-foreground">{stage.description}</p>
            </div>
          </div>
          
          {/* Stage Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    stage.completed 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {stage.completed ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <GraduationCap className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Stage {stage.order}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        <span>{videoLessons.length} videos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>{articleLessons.length} articles</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>~45 min total</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Badge variant={stage.completed ? "default" : "secondary"} className="px-3 py-1">
                  {stage.completed ? 'Completed' : 'In Progress'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lesson Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="articles" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Articles
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                AI Chat
              </TabsTrigger>
              <TabsTrigger value="case-study" className="flex items-center gap-2">
                <FileQuestion className="w-4 h-4" />
                Case Study
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Quiz
              </TabsTrigger>
            </TabsList>

            <TabsContent value="video">
              <VideoTab stage={stage} />
            </TabsContent>

            <TabsContent value="articles">
              <ArticlesTab stage={stage} />
            </TabsContent>

            <TabsContent value="chat">
              <ChatTab stage={stage} />
            </TabsContent>

            <TabsContent value="case-study">
              <CaseStudyTab stage={stage} />
            </TabsContent>

            <TabsContent value="quiz">
              <QuizTab stageId={stage.id} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default LessonPage;