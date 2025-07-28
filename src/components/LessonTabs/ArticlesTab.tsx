import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, CheckCircle2, ExternalLink, Bookmark, ThumbsUp } from 'lucide-react';
import { Stage } from '../../contexts/AppContext';

interface ArticlesTabProps {
  stage: Stage;
}

const ArticlesTab: React.FC<ArticlesTabProps> = ({ stage }) => {
  const [readArticles, setReadArticles] = useState<Set<string>>(new Set());
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Set<string>>(new Set());

  // Mock articles for demo
  const demoArticles = [
    {
      id: 'article-1',
      title: `Complete Guide to ${stage.title}`,
      summary: 'Comprehensive overview covering all fundamental concepts with practical examples.',
      readTime: '8 min read',
      difficulty: 'Beginner',
      author: 'AI-LMS Team',
      url: '#',
      tags: ['Fundamentals', 'Tutorial']
    },
    {
      id: 'article-2', 
      title: `Best Practices for ${stage.title}`,
      summary: 'Industry-standard practices and common pitfalls to avoid in your learning journey.',
      readTime: '12 min read',
      difficulty: 'Intermediate',
      author: 'Expert Contributor',
      url: '#',
      tags: ['Best Practices', 'Tips']
    },
    {
      id: 'article-3',
      title: `Advanced ${stage.title} Techniques`,
      summary: 'Deep dive into advanced concepts and cutting-edge approaches used by professionals.',
      readTime: '15 min read',
      difficulty: 'Advanced',
      author: 'Senior Engineer',
      url: '#',
      tags: ['Advanced', 'Techniques']
    },
    {
      id: 'article-4',
      title: `Real-world ${stage.title} Applications`,
      summary: 'Case studies and examples from major companies showing practical implementations.',
      readTime: '10 min read',
      difficulty: 'Intermediate',
      author: 'Industry Expert',
      url: '#',
      tags: ['Case Study', 'Real-world']
    },
    {
      id: 'article-5',
      title: `${stage.title} Troubleshooting Guide`,
      summary: 'Common problems and their solutions, debugging tips, and error resolution strategies.',
      readTime: '7 min read',
      difficulty: 'Intermediate',
      author: 'Technical Writer',
      url: '#',
      tags: ['Troubleshooting', 'Debug']
    },
    {
      id: 'article-6',
      title: `Future of ${stage.title}`,
      summary: 'Emerging trends, new developments, and what to expect in the coming years.',
      readTime: '6 min read',
      difficulty: 'Beginner',
      author: 'Technology Analyst',
      url: '#',
      tags: ['Trends', 'Future']
    },
    {
      id: 'article-7',
      title: `${stage.title} Interview Questions`,
      summary: 'Common interview questions and how to answer them, with sample responses.',
      readTime: '11 min read',
      difficulty: 'Intermediate',
      author: 'Career Coach',
      url: '#',
      tags: ['Interview', 'Career']
    }
  ];

  const markAsRead = (articleId: string) => {
    setReadArticles(prev => new Set(prev).add(articleId));
  };

  const toggleBookmark = (articleId: string) => {
    setBookmarkedArticles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(articleId)) {
        newSet.delete(articleId);
      } else {
        newSet.add(articleId);
      }
      return newSet;
    });
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
        <h2 className="text-2xl font-bold mb-2">Reading Materials</h2>
        <p className="text-muted-foreground">
          Curated articles to deepen your understanding of {stage.title.toLowerCase()}
        </p>
      </div>

      <div className="grid gap-4">
        {demoArticles.map((article, index) => {
          const isRead = readArticles.has(article.id);
          const isBookmarked = bookmarkedArticles.has(article.id);
          
          return (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`hover:shadow-md transition-all duration-200 ${
                isRead ? 'bg-green-50 border-green-200' : ''
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <CardTitle className="text-lg">{article.title}</CardTitle>
                        {isRead && (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <CardDescription className="mb-3">
                        {article.summary}
                      </CardDescription>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{article.readTime}</span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={getDifficultyColor(article.difficulty)}
                        >
                          {article.difficulty}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          by {article.author}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleBookmark(article.id)}
                      className={isBookmarked ? 'bg-blue-50 text-blue-600' : ''}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => {
                        markAsRead(article.id);
                        // In a real app, this would open the article
                        console.log(`Opening article: ${article.title}`);
                      }}
                      className={isRead ? 'btn-outline-gradient' : 'btn-gradient'}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {isRead ? 'Read Again' : 'Read Article'}
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Helpful
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Reading Progress */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">Reading Progress</h3>
              <p className="text-muted-foreground">
                {readArticles.size} of {demoArticles.length} articles completed
              </p>
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {Math.round((readArticles.size / demoArticles.length) * 100)}%
            </div>
          </div>
          
          {bookmarkedArticles.size > 0 && (
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700">
                <Bookmark className="w-5 h-5" />
                <span className="font-medium">
                  {bookmarkedArticles.size} articles bookmarked for later
                </span>
              </div>
            </div>
          )}
          
          {readArticles.size === demoArticles.length && (
            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Excellent! All articles completed! 📚</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ArticlesTab;