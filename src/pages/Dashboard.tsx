import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Target, 
  Clock, 
  Star, 
  BookOpen, 
  TrendingUp, 
  Settings,
  Plus,
  Database,
  Code,
  BarChart3,
  Brain
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, selectedSkills, updateProfile } = useApp();

  const skillIcons = {
    sql: Database,
    python: Code,
    javascript: Code,
    react: Code,
    tableau: BarChart3,
    excel: BarChart3,
    'machine-learning': Brain,
    aws: Brain,
  };

  const handleAddSkills = () => {
    updateProfile({ hasSkills: false });
    navigate('/select-path');
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                Welcome back, {profile.name}! 👋
              </h1>
              <p className="text-muted-foreground mt-2">
                Ready to continue your learning journey?
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Profile
            </Button>
          </div>
        </motion.div>

        {/* Hero Row - Stats */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* Streak Tracker */}
          <motion.div variants={item}>
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">🔥 Current Streak</CardTitle>
                  <Trophy className="w-5 h-5 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {profile.streak} days
                </div>
                <p className="text-sm text-orange-700">
                  Keep going! You're on fire 🚀
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Emotional Nudge */}
          <motion.div variants={item}>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">💡 Smart Insight</CardTitle>
                  <Brain className="w-5 h-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 font-medium mb-2">
                  You're 60% through SQL!
                </p>
                <p className="text-sm text-blue-600">
                  Complete 2 more lessons to unlock the capstone project
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Smart Suggestion */}
          <motion.div variants={item}>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">🎯 Today's Goal</CardTitle>
                  <Target className="w-5 h-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-green-700 font-medium mb-2">
                  Study for 30 minutes
                </p>
                <p className="text-sm text-green-600">
                  Focus on SQL Joins to maintain momentum
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Learning Paths</h2>
            <Button
              onClick={handleAddSkills}
              disabled={selectedSkills.length >= 3}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {selectedSkills.length >= 3 ? 'Max Skills Reached' : 'Add Skills'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedSkills.map((skill, index) => {
              const IconComponent = skillIcons[skill.id as keyof typeof skillIcons] || BookOpen;
              return (
                <motion.div key={skill.id} variants={item}>
                  <Card 
                    className="skill-card cursor-pointer group hover:shadow-lg transition-all duration-300"
                    onClick={() => navigate(`/roadmap/${skill.id}`)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-brand-primary/10 rounded-lg">
                            <IconComponent className="w-6 h-6 text-brand-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{skill.name}</CardTitle>
                            <CardDescription>{skill.careerGoal}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="secondary" className="capitalize">
                          {skill.level}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{skill.progress}%</span>
                          </div>
                          <Progress value={skill.progress} className="h-2" />
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4 text-muted-foreground" />
                            <span>{skill.completedStages}/{skill.totalStages} stages</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>{skill.estimatedHours}h left</span>
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full btn-gradient group-hover:shadow-md transition-shadow"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/roadmap/${skill.id}`);
                          }}
                        >
                          Continue Learning
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
            
            {/* Add Skill Card */}
            {selectedSkills.length < 3 && (
              <motion.div variants={item}>
                <Card 
                  className="skill-card cursor-pointer group border-dashed hover:border-solid hover:border-brand-primary transition-all duration-300"
                  onClick={handleAddSkills}
                >
                  <CardContent className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="p-4 bg-brand-primary/10 rounded-full mb-4 group-hover:bg-brand-primary/20 transition-colors">
                      <Plus className="w-8 h-8 text-brand-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Add New Skill</h3>
                    <p className="text-muted-foreground">
                      Choose up to {3 - selectedSkills.length} more skills to learn
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-muted-foreground mb-4">
            Need help? Check out your 
            <Button variant="link" onClick={() => navigate('/profile')} className="p-1">
              profile
            </Button> 
            or explore more learning resources.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;