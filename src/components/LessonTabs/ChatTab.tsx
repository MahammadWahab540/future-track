import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, AlertTriangle, Lightbulb, MessageSquare } from 'lucide-react';
import { Stage } from '../../contexts/AppContext';

interface ChatTabProps {
  stage: Stage;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const ChatTab: React.FC<ChatTabProps> = ({ stage }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: `Hi! I'm your AI learning assistant. I'm here to help you understand ${stage.title}. Feel free to ask me any questions about this topic!`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Suggested questions based on the stage
  const suggestedQuestions = [
    `What are the key concepts in ${stage.title}?`,
    `Can you give me a practical example of ${stage.title}?`,
    `What are common mistakes to avoid in ${stage.title}?`,
    `How does ${stage.title} relate to real-world applications?`,
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateMockResponse(inputValue, stage.title),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateMockResponse = (question: string, topic: string) => {
    const responses = [
      `Great question about ${topic}! Let me explain this concept step by step. ${topic} is fundamental because it helps you understand how data relationships work in practice.`,
      `That's an excellent point regarding ${topic}. Here's what you need to know: This concept builds on the previous lessons and will be crucial for your upcoming projects.`,
      `I can help clarify that aspect of ${topic}! Think of it this way - imagine you're working with a real database where you need to combine information from multiple sources.`,
      `Perfect question! ${topic} can be tricky at first, but once you understand the underlying principles, it becomes much clearer. Let me break it down for you.`,
      `That's exactly the kind of critical thinking we want to see! In ${topic}, the key is to remember that you're essentially creating relationships between different pieces of information.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">AI Learning Assistant</h2>
        <p className="text-muted-foreground">
          Ask questions about {stage.title} and get personalized explanations
        </p>
      </div>

      {/* Guardrail Notice */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 mb-1">Focused Learning Mode</h4>
              <p className="text-sm text-amber-700">
                I'm configured to help you with {stage.title} concepts. Ask about specific topics like 
                <strong> JOIN operations, UNION differences, or subquery optimization</strong> for the best learning experience.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggested Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Suggested Questions
          </CardTitle>
          <CardDescription>
            Click on any question to get started, or type your own
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start text-left h-auto p-3"
                onClick={() => handleSuggestedQuestion(question)}
              >
                <MessageSquare className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm">{question}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="min-h-96">
        <CardHeader>
          <CardTitle className="text-lg">Chat History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-brand-primary text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-brand-primary text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 opacity-70`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-gray-600" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question about this topic..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="btn-gradient"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Help Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-800 mb-2">💡 Chat Tips</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Be specific with your questions for better answers</li>
            <li>• Ask for examples to understand concepts better</li>
            <li>• Request explanations if something isn't clear</li>
            <li>• Use follow-up questions to dive deeper</li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ChatTab;