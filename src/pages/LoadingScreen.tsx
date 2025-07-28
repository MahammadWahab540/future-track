import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const quotes = [
  "Crafting your personalized roadmap...",
  "Analyzing your learning preferences...",
  "Curating the perfect resources for you...",
  "Building your AI-powered learning journey...",
  "Almost ready to start your adventure...",
];

const LoadingScreen = () => {
  const navigate = useNavigate();
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 800);

    const redirectTimer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);

    return () => {
      clearInterval(quoteInterval);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-brand-primary/30 to-brand-secondary/30 rounded-full filter blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-to-r from-brand-secondary/30 to-brand-accent/30 rounded-full filter blur-3xl"
          animate={{
            scale: [1, 0.8, 1],
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-32 h-32 bg-gradient-to-r from-brand-accent/20 to-brand-primary/20 rounded-full filter blur-2xl"
          animate={{
            scale: [1, 1.5, 1],
            x: [0, 20, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full mb-6 shadow-2xl">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 text-white"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7V10C2 16 6 22 12 22S22 16 22 10V7L12 2Z" />
              </svg>
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">AI-LMS</h1>
        </motion.div>

        {/* Rotating Quotes */}
        <motion.div
          key={currentQuote}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="text-xl text-muted-foreground font-medium">
            {quotes[currentQuote]}
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <div className="w-64 mx-auto">
          <div className="flex space-x-2 justify-center mb-4">
            {[0, 1, 2, 3, 4].map((index) => (
              <motion.div
                key={index}
                className="w-3 h-3 bg-brand-primary rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              />
            ))}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-sm text-muted-foreground mt-4"
          >
            Preparing your learning experience...
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;