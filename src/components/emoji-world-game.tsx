"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { EMOJIS, Emoji } from '@/lib/emojis';
import { shuffle } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';
import { toast } from 'sonner';
import { useSound } from '@/hooks/use-sound';
import confetti from 'canvas-confetti';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Award, BarChart, Crown, ArrowLeft, Timer } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const ROUND_DURATION = 5;

function AnimatedStat({ value }: { value: number }) {
  const spring = useSpring(value, { mass: 0.8, stiffness: 100, damping: 15 });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{spring}</motion.span>;
}

export function EmojiWorldGame() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver'>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentEmoji, setCurrentEmoji] = useState<Emoji | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null);
  const [usedEmojis, setUsedEmojis] = useState<string[]>([]);

  const { playCorrect, playWrong, playStart, playGameOver } = useSound();

  useEffect(() => {
    setHighScore(Number(localStorage.getItem('emoji-sprint-highscore') || 0));
  }, []);

  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  useEffect(() => {
    if (gameState === 'gameOver' && score > 0 && score >= highScore) {
      triggerConfetti();
    }
  }, [gameState, score, highScore, triggerConfetti]);

  const nextRound = useCallback(() => {
    setIsCorrect(null);
    setSelectedAnswer(null);
    setFlash(null);

    let availableEmojis = EMOJIS.filter(e => !usedEmojis.includes(e.char));

    if (availableEmojis.length < 4) {
      availableEmojis = EMOJIS;
      setUsedEmojis([]);
      if (gameState === 'playing') {
        toast.success("You've seen all the emojis! Starting over.");
      }
    }

    const newEmoji = availableEmojis[Math.floor(Math.random() * availableEmojis.length)];
    setCurrentEmoji(newEmoji);
    setUsedEmojis(prev => [...prev, newEmoji.char]);

    const otherEmojis = EMOJIS.filter(e => e.char !== newEmoji.char);
    const mainKeywords = newEmoji.name.toLowerCase().split(' ').filter(kw => kw.length > 3);

    const similarDistractors = otherEmojis
      .map(e => {
        const distractorKeywords = e.name.toLowerCase().split(' ');
        const commonKeywords = mainKeywords.filter(kw => distractorKeywords.includes(kw));
        return { name: e.name, score: commonKeywords.length };
      })
      .filter(e => e.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(e => e.name);

    const randomDistractors = shuffle(otherEmojis.map(e => e.name))
      .filter(name => !similarDistractors.includes(name));

    const finalDistractors = [...similarDistractors, ...randomDistractors].slice(0, 3);

    const newOptions = shuffle([...finalDistractors, newEmoji.name]);
    setOptions(newOptions);
    setTimeLeft(ROUND_DURATION);
  }, [usedEmojis, gameState]);

  const handleAnswer = useCallback((answer: string | null) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    setQuestionsAnswered(q => q + 1);
    const correct = answer === currentEmoji?.name;

    if (correct) {
      playCorrect();
      setIsCorrect(true);
      setFlash('correct');
      setCorrectAnswers(c => c + 1);
      
      const points = 5;
      setScore(s => s + points);

      setTimeout(nextRound, 1000);
    } else {
      playWrong();
      setIsCorrect(false);
      setFlash('wrong');
      if (answer !== null) {
        toast.error("Oops!", { duration: 1000 });
      }
      setTimeout(() => {
        setGameState('gameOver');
        playGameOver();
      }, 1200);
    }
  }, [currentEmoji, nextRound, playCorrect, playGameOver, playWrong, selectedAnswer]);

  useEffect(() => {
    if (gameState === 'playing') {
      if (timeLeft <= 0) {
        handleAnswer(null);
        return;
      }
      const timer = setInterval(() => setTimeLeft(prev => prev - 0.01), 10);
      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft, handleAnswer]);

  useEffect(() => {
    if (gameState !== 'playing' || !!selectedAnswer) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (['1', '2', '3', '4'].includes(event.key)) {
        handleAnswer(options[parseInt(event.key) - 1]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, options, handleAnswer, selectedAnswer]);

  const startGame = () => {
    playStart();
    setScore(0);
    setCorrectAnswers(0);
    setQuestionsAnswered(0);
    setFlash(null);
    setUsedEmojis([]);
    setCurrentEmoji(null);
    setGameState('playing');
  };

  const goToMainMenu = () => {
    setGameState('start');
  };

  useEffect(() => {
    if (gameState === 'playing' && currentEmoji === null) {
      nextRound();
    }
  }, [gameState, currentEmoji, nextRound]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('emoji-sprint-highscore', String(score));
    }
  }, [score, highScore]);

  const getButtonClass = (option: string) => {
    if (!selectedAnswer) {
      return 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
    }
    
    const isThisButtonSelected = option === selectedAnswer;
    const isThisButtonCorrect = option === currentEmoji?.name;
  
    if (isThisButtonCorrect) {
      return 'bg-green-500 hover:bg-green-500 text-primary-foreground border-green-600';
    }
  
    if (isThisButtonSelected && !isThisButtonCorrect) {
      return 'bg-red-500 hover:bg-red-500 text-primary-foreground border-red-600 animate-shake';
    }
  
    return 'bg-secondary/50 text-secondary-foreground/50 border-transparent'; 
  };

  const renderGameState = () => {
    switch (gameState) {
      case 'gameOver':
        const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;
        return (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="w-full max-w-md text-center bg-card/80 backdrop-blur-lg border border-white/10 shadow-xl p-4 sm:p-6">
              <CardHeader className="p-2">
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1, rotate: [0, 10, -10, 0] }} 
                  transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
                >
                  <Award className="h-24 w-24 mx-auto text-yellow-400" />
                </motion.div>
                <CardTitle className="text-5xl font-bold mt-4">Game Over</CardTitle>
                <CardDescription className="text-lg">
                  {score > 0 && score >= highScore ? "New High Score!" : "Nice try!"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4 p-2">
                <div className="text-7xl font-bold text-primary my-4">{score}</div>
                <div className="grid grid-cols-2 gap-4 w-full text-md">
                  <div className="flex flex-col items-center justify-center gap-1 rounded-lg bg-muted/50 p-3">
                    <span className="text-sm text-muted-foreground">High Score</span>
                    <div className="flex items-center gap-2 font-semibold">
                      <Crown className="h-5 w-5 text-yellow-500" />
                      <span>{highScore}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 rounded-lg bg-muted/50 p-3">
                    <span className="text-sm text-muted-foreground">Accuracy</span>
                    <div className="flex items-center gap-2 font-semibold">
                      <BarChart className="h-5 w-5 text-blue-500" />
                      <span>{accuracy}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full">
                  <Button onClick={startGame} size="lg" className="w-full">Play Again</Button>
                  <Button onClick={goToMainMenu} size="lg" variant="outline" className="w-full">Main Menu</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      case 'playing':
        return (
          <AnimatePresence mode="wait">
            {currentEmoji && (
              <motion.div
                key={currentEmoji.char}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center"
              >
                <Card className="w-full max-w-lg text-center p-6 sm:p-8 bg-card/50 backdrop-blur-sm border border-white/10">
                  <CardHeader className="p-0">
                    <div className="flex items-center gap-4 w-full mb-6">
                      <div className="flex items-center gap-2 text-lg font-semibold font-mono text-muted-foreground">
                        <Timer className="h-6 w-6" />
                        <span>{timeLeft.toFixed(1)}</span>
                      </div>
                      <Progress value={(timeLeft / ROUND_DURATION) * 100} className="h-3 w-full" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="my-8">
                      <p className="text-9xl">{currentEmoji.char}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {options.map((option, index) => (
                        <Button
                          key={option}
                          onClick={() => handleAnswer(option)}
                          className={`w-full h-auto min-h-[6rem] text-lg font-semibold whitespace-normal transition-all duration-300 relative focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-4 text-center flex items-center justify-center ${getButtonClass(option)}`}
                          disabled={!!selectedAnswer}
                        >
                          <span className="absolute top-2 left-3 text-sm font-bold opacity-50">{index + 1}</span>
                          {option}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        );
      case 'start':
      default:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center flex flex-col items-center gap-4 z-10 p-4 pt-16 sm:pt-24"
          >
            <h1 className="text-6xl md:text-7xl font-bold tracking-tighter bg-gradient-to-br from-primary via-primary/80 to-primary bg-clip-text text-transparent dark:from-primary dark:via-primary/60 dark:to-primary">
              Emoji World
            </h1>
            <p className="text-xl text-muted-foreground max-w-md">
              Explore, play, and learn the story behind our favorite icons.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8 w-full max-w-5xl">
              <motion.div whileHover={{ y: -8, scale: 1.03, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} className="h-full">
                <Card 
                  onClick={startGame} 
                  className="h-full cursor-pointer flex flex-col items-center justify-center text-center p-6 bg-card/50 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-primary/20 border border-white/10"
                >
                  <motion.span 
                    className="text-6xl mb-4"
                    animate={{ rotate: [-5, 5, -5] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
                  >
                    🎮
                  </motion.span>
                  <CardTitle>Emoji Sprint</CardTitle>
                  <CardDescription className="mt-2">Test your knowledge in a race against time.</CardDescription>
                </Card>
              </motion.div>
              <motion.div whileHover={{ y: -8, scale: 1.03, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} className="h-full">
                <Link href="/discover" className="h-full block">
                  <Card className="h-full cursor-pointer flex flex-col items-center justify-center text-center p-6 bg-card/50 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-primary/20 border border-white/10">
                    <motion.span 
                      className="text-6xl mb-4"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
                    >
                      🔍
                    </motion.span>
                    <CardTitle>Emoji Explorer</CardTitle>
                    <CardDescription className="mt-2">Browse and search through every emoji.</CardDescription>
                  </Card>
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -8, scale: 1.03, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} className="h-full">
                <Link href="/history" className="h-full block">
                  <Card className="h-full cursor-pointer flex flex-col items-center justify-center text-center p-6 bg-card/50 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-primary/20 border border-white/10">
                    <motion.span 
                      className="text-6xl mb-4"
                      animate={{ y: [-3, 3, -3] }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
                    >
                      📜
                    </motion.span>
                    <CardTitle>The Story of Emoji</CardTitle>
                    <CardDescription className="mt-2">Learn the history of our favorite icons.</CardDescription>
                  </Card>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen text-foreground p-4 overflow-hidden transition-colors duration-500 ${
      flash === 'correct' ? 'bg-green-500/20' : flash === 'wrong' ? 'bg-red-500/20' : 'bg-background bg-gradient-to-br from-background to-muted/30'
    }`}>
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      <div className="absolute top-4 left-4 flex items-center gap-4 z-20">
        {gameState === 'playing' && (
          <Button onClick={goToMainMenu} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
        <div className="text-2xl font-semibold">
          <motion.div whileTap={{ scale: 0.9 }} className="flex items-center gap-2">
            <Award className="h-7 w-7 text-yellow-400" />
            <AnimatedStat value={score} />
          </motion.div>
        </div>
      </div>
      <main className="flex-grow flex items-center justify-center w-full">
        {renderGameState()}
      </main>
      {gameState === 'start' && (
        <footer className="p-4 text-center text-sm text-muted-foreground">
          Made with ❤️ by Sankalp Dharge
        </footer>
      )}
    </div>
  );
}