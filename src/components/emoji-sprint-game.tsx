"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EMOJIS, Emoji } from '@/lib/emojis';
import { shuffle } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';
import { toast } from 'sonner';
import { useSound } from '@/hooks/use-sound';

const ROUND_DURATION = 5; // 5 seconds
const STREAK_BONUS_THRESHOLD = 5;
const STREAK_BONUS_POINTS = 10;

export function EmojiSprintGame() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver'>('start');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentEmoji, setCurrentEmoji] = useState<Emoji | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const { playCorrect, playWrong, playStart, playGameOver } = useSound();

  useEffect(() => {
    setHighScore(Number(localStorage.getItem('emoji-sprint-highscore') || 0));
  }, []);

  const nextRound = useCallback(() => {
    setIsCorrect(null);
    setSelectedAnswer(null);
    
    const newEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    setCurrentEmoji(newEmoji);

    const distractors = EMOJIS.filter(e => e.name !== newEmoji.name)
      .map(e => e.name);
    const shuffledDistractors = shuffle(distractors).slice(0, 3);
    const newOptions = shuffle([...shuffledDistractors, newEmoji.name]);
    setOptions(newOptions);
    setTimeLeft(ROUND_DURATION);
  }, []);

  const handleAnswer = useCallback((answer: string | null) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    setQuestionsAnswered(q => q + 1);
    const correct = answer === currentEmoji?.name;

    if (correct) {
      playCorrect();
      setIsCorrect(true);
      setCorrectAnswers(c => c + 1);
      
      const newStreak = streak + 1;
      let points = 5 + streak;
      
      if (newStreak > 0 && newStreak % STREAK_BONUS_THRESHOLD === 0) {
        points += STREAK_BONUS_POINTS;
        toast.info(`+${STREAK_BONUS_POINTS} Streak Bonus!`, { duration: 1500 });
      }
      
      setScore(s => s + points);
      setStreak(newStreak);
      toast.success("Awesome!", { duration: 1000 });
      setTimeout(nextRound, 1000);
    } else {
      playWrong();
      setIsCorrect(false);
      setStreak(0);
      toast.error(answer ? "Oops!" : "Time's up!", { duration: 1000 });
      setTimeout(() => {
        setGameState('gameOver');
        playGameOver();
      }, 1200);
    }
  }, [currentEmoji, nextRound, playCorrect, playGameOver, playWrong, selectedAnswer, streak]);

  useEffect(() => {
    if (gameState === 'playing') {
      if (timeLeft <= 0) {
        handleAnswer(null);
        return;
      }
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 0.01);
      }, 10);
      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft, handleAnswer]);

  useEffect(() => {
    if (gameState !== 'playing' || !!selectedAnswer) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (['1', '2', '3', '4'].includes(event.key)) {
        const index = parseInt(event.key) - 1;
        if (options[index]) {
          handleAnswer(options[index]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, options, handleAnswer, selectedAnswer]);

  const startGame = () => {
    playStart();
    setScore(0);
    setStreak(0);
    setCorrectAnswers(0);
    setQuestionsAnswered(0);
    setGameState('playing');
    nextRound();
  };

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('emoji-sprint-highscore', String(score));
    }
  }, [score, highScore]);

  const renderGameState = () => {
    switch (gameState) {
      case 'gameOver':
        const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center flex flex-col items-center gap-4"
          >
            <h2 className="text-4xl font-bold">Game Over!</h2>
            <p className="text-2xl">Your Score: {score}</p>
            <p className="text-xl">Accuracy: {accuracy}%</p>
            <p className="text-xl text-muted-foreground">High Score: {highScore}</p>
            <Button onClick={startGame} size="lg">Play Again</Button>
          </motion.div>
        );
      case 'playing':
        return (
          <AnimatePresence mode="wait">
            {currentEmoji && (
              <motion.div
                key={currentEmoji.char}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center gap-8"
              >
                <div className="relative flex items-center justify-center">
                   <motion.div
                    className="absolute w-full h-full border-4 border-primary rounded-full"
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 0 }}
                    transition={{ duration: ROUND_DURATION, ease: 'linear' }}
                    key={`${currentEmoji.char}-timer`} 
                  />
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: 'mirror' }}
                    className="text-8xl md:text-9xl"
                  >
                    {currentEmoji.char}
                  </motion.div>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                  {options.map((option, index) => (
                    <motion.div
                      key={option}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={() => handleAnswer(option)}
                        className={`w-full h-20 text-lg whitespace-normal transition-colors duration-300 relative ${
                          selectedAnswer && option === selectedAnswer
                            ? isCorrect
                              ? 'bg-green-500 hover:bg-green-600'
                              : 'bg-red-500 hover:bg-red-600 animate-shake'
                            : selectedAnswer && option === currentEmoji.name
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-secondary hover:bg-secondary/80'
                        }`}
                        disabled={!!selectedAnswer}
                      >
                        <span className="absolute top-1 left-2 text-xs font-bold opacity-50">{index + 1}</span>
                        {option}
                      </Button>
                    </motion.div>
                  ))}
                </div>
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
            className="text-center flex flex-col items-center gap-4"
          >
            <h1 className="text-5xl font-bold tracking-tighter">Emoji Sprint</h1>
            <p className="text-lg text-muted-foreground">Guess the mood before time runs out!</p>
            <Button onClick={startGame} size="lg" className="mt-4">
              Start Game
            </Button>
          </motion.div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 overflow-hidden">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="absolute top-4 left-4 flex flex-col sm:flex-row gap-x-4 items-start sm:items-center text-lg font-semibold">
        <span>Score: {score}</span>
        <span>Streak: {streak}</span>
        <span className="text-muted-foreground">High: {highScore}</span>
      </div>
      <main className="flex-grow flex items-center justify-center w-full">
        {renderGameState()}
      </main>
    </div>
  );
}