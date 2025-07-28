import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  ArrowLeft,
  CheckCircle2,
  Clock,
  Play,
  BookOpen,
  Video,
  FileText,
  Trophy,
  Upload
} from 'lucide-react';

const RoadmapPage = () => {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const { getRoadmap, selectedSkills } = useApp();
  
  const roadmap = getRoadmap(skillId!);
  const skill = selectedSkills.find(s => s.id === skillId);
  
  if (!roadmap || !skill) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Roadmap not found</h1>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const completedStages = roadmap.stages.filter(stage => stage.completed).length;
  const allStagesCompleted = completedStages === roadmap.stages.length;
  
  const handleLessonClick = (stageId: string) => {
    navigate(`/lesson/${skillId}/${stageId}`);
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'article': return FileText;
      default: return BookOpen;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                {roadmap.title}
              </h1>
              <p className="text-muted-foreground">{roadmap.description}</p>
            </div>
          </div>
          
          {/* Progress Overview */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Overall Progress</h3>
                  <p className="text-muted-foreground">
                    {completedStages} of {roadmap.stages.length} stages completed
                  </p>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`px-3 py-1 ${
                    allStagesCompleted ? 'bg-green-100 text-green-700' : ''
                  }`}
                >
                  {allStagesCompleted ? '🎉 Ready for Capstone!' : `${Math.round(skill.progress)}% Complete`}
                </Badge>
              </div>
              <Progress value={skill.progress} className="h-3" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Stages Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Accordion type="multiple" defaultValue={['stage-0']} className="space-y-4">
            {roadmap.stages.map((stage, index) => (
              <AccordionItem key={stage.id} value={`stage-${index}`}>
                <Card>
                  <AccordionTrigger className="hover:no-underline">
                    <CardHeader className="flex-row items-center justify-between w-full py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          stage.completed 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {stage.completed ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <span className="font-semibold">{stage.order}</span>
                          )}
                        </div>
                        <div className="text-left">
                          <CardTitle className="text-lg">{stage.title}</CardTitle>
                          <CardDescription>{stage.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={stage.completed ? "default" : "secondary"}>
                        {stage.completed ? 'Completed' : 'In Progress'}
                      </Badge>
                    </CardHeader>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="pt-0">
                      <div className="grid gap-3">
                        {stage.lessons.map((lesson) => {
                          const IconComponent = getLessonIcon(lesson.type);
                          return (
                            <motion.div
                              key={lesson.id}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <Card 
                                className="cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => handleLessonClick(stage.id)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className={`p-2 rounded-lg ${
                                        lesson.completed 
                                          ? 'bg-green-100 text-green-600'
                                          : 'bg-blue-100 text-blue-600'
                                      }`}>
                                        <IconComponent className="w-4 h-4" />
                                      </div>
                                      <div>
                                        <h4 className="font-medium">{lesson.title}</h4>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                          <Clock className="w-3 h-3" />
                                          <span>{lesson.duration}</span>
                          <Badge variant="outline" className="text-xs">
                            {lesson.type}
                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {lesson.completed ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                      ) : (
                                        <Play className="w-5 h-5 text-blue-600" />
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Capstone Project Section */}
        {allStagesCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-golden bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Trophy className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-yellow-800">
                      🎉 Congratulations! Ready for Capstone Project
                    </CardTitle>
                    <CardDescription className="text-yellow-700">
                      You've completed all stages. Time to showcase your skills!
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white/50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold mb-2">Project: E-commerce Sales Analysis</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Use your SQL skills to analyze a real e-commerce dataset. Create queries to identify sales trends, 
                    customer behavior patterns, and product performance metrics.
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="outline">SQL</Badge>
                    <Badge variant="outline">Data Analysis</Badge>
                    <Badge variant="outline">Business Intelligence</Badge>
                  </div>
                </div>
                <Button className="btn-gradient flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Start Capstone Project
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RoadmapPage;