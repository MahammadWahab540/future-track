import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { FileQuestion, Lightbulb, CheckCircle2, Eye, EyeOff, Building, Target } from 'lucide-react';
import { Stage } from '../../contexts/AppContext';

interface CaseStudyTabProps {
  stage: Stage;
}

const CaseStudyTab: React.FC<CaseStudyTabProps> = ({ stage }) => {
  const [showSolution, setShowSolution] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{[key: string]: string}>({});
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());

  // Mock case study data
  const caseStudy = {
    title: `Real-World ${stage.title} Challenge`,
    company: "TechCorp Analytics",
    scenario: stage.id === 'sql-basics' 
      ? "You're working as a junior data analyst at TechCorp Analytics. The marketing team needs to understand customer behavior from their e-commerce database. They've asked you to extract specific information using SQL queries to help them make data-driven decisions for their upcoming campaign."
      : `You're working at TechCorp Analytics and need to solve a complex ${stage.title} problem. The team is relying on your expertise to analyze customer data and provide actionable insights.`,
    
    background: stage.id === 'sql-basics'
      ? "The company has three main tables: customers (customer_id, name, email, signup_date), orders (order_id, customer_id, product_id, order_date, amount), and products (product_id, name, category, price). The marketing team wants to understand their customer base better."
      : `The database contains customer transaction data spanning multiple years. Your analysis will directly impact strategic business decisions.`,
    
    objective: "Help the marketing team by answering their specific questions using your SQL knowledge.",
    
    questions: [
      {
        id: 'q1',
        question: stage.id === 'sql-basics' 
          ? "How would you find all customers who signed up in the last 30 days?"
          : `What ${stage.title} technique would you use to solve the main business problem?`,
        hint: "Think about date functions and WHERE clauses",
        category: "Data Retrieval"
      },
      {
        id: 'q2', 
        question: stage.id === 'sql-basics'
          ? "The marketing team wants to see the total number of customers. Which SQL function would you use?"
          : "How would you ensure your solution is efficient and scalable?",
        hint: "Consider aggregate functions",
        category: "Analysis"
      },
      {
        id: 'q3',
        question: "What potential challenges might you face with this approach?",
        hint: "Think about data quality, performance, and edge cases",
        category: "Critical Thinking"
      },
      {
        id: 'q4',
        question: "How would you validate that your results are accurate?",
        hint: "Consider testing strategies and data validation techniques",
        category: "Quality Assurance"
      }
    ],
    
    solution: {
      overview: stage.id === 'sql-basics'
        ? "This case study demonstrates fundamental SQL operations in a business context. The key is understanding how to translate business questions into SQL queries."
        : `This case study showcases advanced ${stage.title} concepts in real-world scenarios.`,
      
      keyPoints: [
        "Always understand the business context before writing queries",
        "Start with simple queries and build complexity gradually", 
        "Consider data quality and edge cases",
        "Validate results with stakeholders",
        "Document your approach for future reference"
      ],
      
      technicalSolution: stage.id === 'sql-basics'
        ? `-- Find customers who signed up in last 30 days\nSELECT customer_id, name, email, signup_date\nFROM customers\nWHERE signup_date >= CURRENT_DATE - INTERVAL '30 days';\n\n-- Count total customers\nSELECT COUNT(*) as total_customers\nFROM customers;`
        : `// Example implementation using ${stage.title} concepts\n// This would include the specific techniques covered in this stage`
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const markQuestionComplete = (questionId: string) => {
    if (userAnswers[questionId]?.trim()) {
      setCompletedQuestions(prev => new Set(prev).add(questionId));
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Data Retrieval': return 'bg-blue-100 text-blue-700';
      case 'Analysis': return 'bg-green-100 text-green-700';
      case 'Critical Thinking': return 'bg-purple-100 text-purple-700';
      case 'Quality Assurance': return 'bg-orange-100 text-orange-700';
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
        <h2 className="text-2xl font-bold mb-2">Case Study Challenge</h2>
        <p className="text-muted-foreground">
          Apply your {stage.title} knowledge to solve real-world scenarios
        </p>
      </div>

      {/* Case Study Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">{caseStudy.title}</CardTitle>
              <CardDescription className="text-blue-700">
                Company: {caseStudy.company}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FileQuestion className="w-4 h-4" />
                Scenario
              </h4>
              <p className="text-gray-700 leading-relaxed">{caseStudy.scenario}</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Background</h4>
              <p className="text-gray-700 leading-relaxed">{caseStudy.background}</p>
            </div>
            
            <div className="bg-blue-100 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-800">
                <Target className="w-4 h-4" />
                Your Objective
              </h4>
              <p className="text-blue-700">{caseStudy.objective}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reflective Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Reflective Questions</CardTitle>
          <CardDescription>
            Think through these questions and write your responses. There are no wrong answers!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {caseStudy.questions.map((question, index) => {
            const isCompleted = completedQuestions.has(question.id);
            const userAnswer = userAnswers[question.id] || '';
            
            return (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 border rounded-lg ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge 
                        variant="outline" 
                        className={getCategoryColor(question.category)}
                      >
                        {question.category}
                      </Badge>
                      {isCompleted && (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <h4 className="font-medium text-lg mb-2">
                      Question {index + 1}: {question.question}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Lightbulb className="w-4 h-4" />
                      <span>Hint: {question.hint}</span>
                    </div>
                  </div>
                </div>
                
                <Textarea
                  placeholder="Share your thoughts and approach..."
                  value={userAnswer}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  rows={4}
                  className="mb-3"
                />
                
                <Button
                  onClick={() => markQuestionComplete(question.id)}
                  disabled={!userAnswer.trim() || isCompleted}
                  variant={isCompleted ? "outline" : "default"}
                  className={isCompleted ? "text-green-600 border-green-300" : "btn-gradient"}
                >
                  {isCompleted ? 'Completed' : 'Mark as Complete'}
                </Button>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>

      {/* Solution Section */}
      <Card>
        <CardHeader>
          <CardTitle>Solution & Analysis</CardTitle>
          <CardDescription>
            Review the expert approach after completing your reflections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setShowSolution(!showSolution)}
            variant="outline"
            className="mb-4 flex items-center gap-2"
          >
            {showSolution ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showSolution ? 'Hide Solution' : 'Reveal Solution'}
          </Button>
          
          {showSolution && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-3 text-green-800">Expert Analysis</h4>
                <p className="text-green-700 mb-4">{caseStudy.solution.overview}</p>
                
                <h5 className="font-medium mb-2 text-green-800">Key Learning Points:</h5>
                <ul className="list-disc list-inside space-y-1 text-green-700">
                  {caseStudy.solution.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Technical Implementation</h4>
                <pre className="text-sm bg-gray-900 text-green-400 p-4 rounded overflow-x-auto">
                  {caseStudy.solution.technicalSolution}
                </pre>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Progress Summary */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1">Case Study Progress</h3>
              <p className="text-muted-foreground">
                {completedQuestions.size} of {caseStudy.questions.length} questions completed
              </p>
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {Math.round((completedQuestions.size / caseStudy.questions.length) * 100)}%
            </div>
          </div>
          {completedQuestions.size === caseStudy.questions.length && (
            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Great work! Case study completed! 🎯</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CaseStudyTab;