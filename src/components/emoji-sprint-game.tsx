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
import { Award, Flame, Home, RefreshCw, Trophy, X } from 'lucide-react';

const ROUND_DURATION = 5;
const STREAK_BONUS_THRESHOLD = 5;
const STREAK_BONUS_POINTS = 10;

function AnimatedStat({ value }: { value: number }) {
  const spring = useSpring(value, { mass: 0.8, stiffness: 100, damping: 15 });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{spring}</motion.span>;
}

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
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null);
  const [usedEmojis, setUsedEmojis] = useState<string[]>([]);

  const { playCorrect, playWrong, playStart, playGameOver } = useSound();

  useEffect(() => {
    setHighScore(Number(localStorage.getItem('emoji-sprint-highscore') || 0));
  }, []);

  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
    });
  }, []);

  useEffect(() => {
    if (gameState === 'gameOver' && score > 0) {
      triggerConfetti();
    }
  }, [gameState, score, triggerConfetti]);

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
    const newOptions = shuffle([newEmoji.name, ...shuffle(otherEmojis).slice(0, 3).map(e => e.name)]);
    setOptions(newOptions);
    setTimeLeft(ROUND_DURATION);
  }, [usedEmojis, gameState]);

  const handleAnswer = useCallback((answer: string | null) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    const correct = answer === currentEmoji?.name;

    if (correct) {
      playCorrect();
      setIsCorrect(true);
      setFlash('correct');
      const newStreak = streak + 1;
      let points = 5 + streak;
      if (newStreak > 0 && newStreak % STREAK_BONUS_THRESHOLD === 0) {
        points += STREAK_BONUS_POINTS;
        toast.info(`+${STREAK_BONUS_POINTS} Streak Bonus!`, { duration: 1500 });
      }
      setScore(s => s + points);
      setStreak(newStreak);
      setTimeout(nextRound, 1000);
    } else {
      playWrong();
      setIsCorrect(false);
      setFlash('wrong');
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
    setStreak(0);
    setFlash(null);
    setUsedEmojis([]);
    setCurrentEmoji(null);
    setGameState('playing');
  };

  const quitGame = () => {
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

  const renderGameState = () => {
    switch (gameState) {
      case 'gameOver':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md text-center bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8"
          >
            <h2 className="text-5xl font-bold tracking-tighter mb-2">Game Over!</h2>
            <p className="text-muted-foreground mb-8">Here's how you did:</p>
            
            <div className="grid grid-cols-2 gap-4 text-left mb-8">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Award className="h-4 w-4" />
                  Final Score
                </div>
                <div className="text-4xl font-bold text-primary"><AnimatedStat value={score} /></div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Trophy className="h-4 w-4 text-yellow-400" />
                  High Score
                </div>
                <div className="text-4xl font-bold"><AnimatedStat value={highScore} /></div>
              </div>
            </div>

            <div className="flex w-full gap-4 mt-2">
              <Button onClick={quitGame} size="lg" variant="outline" className="w-full transition-all hover:bg-muted/80">
                <Home className="mr-2 h-5 w-5" />
                Main Menu
              </Button>
              <Button onClick={startGame} size="lg" className="w-full transition-all hover:shadow-[0_0_2rem_hsl(var(--primary)/0.3)]">
                <RefreshCw className="mr-2 h-5 w-5" />
                Play Again
              </Button>
            </div>
          </motion.div>
        );
      case 'playing':
        const progress = (timeLeft / ROUND_DURATION) * 100;
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
                <div className="relative flex items-center justify-center w-48 h-48">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/5 shadow-[0_0_60px_hsl(var(--primary)/0.2)]"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: 'mirror' }}
                  />
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    <motion.circle
                      cx="50" cy="50" r="45"
                      className="stroke-primary/50"
                      strokeWidth="4" fill="transparent"
                      strokeDasharray={2 * Math.PI * 45}
                      transform="rotate(-90 50 50)"
                      style={{ strokeDashoffset: `${(100 - progress) / 100 * (2 * Math.PI * 45)}px` }}
                      transition={{ duration: 0.1, ease: 'linear' }}
                    />
                  </svg>
                  <div className="text-8xl md:text-9xl">{currentEmoji.char}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                  {options.map((option, index) => (
                    <motion.div key={option} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => handleAnswer(option)}
                        className={`w-full h-24 text-lg font-semibold whitespace-normal transition-all duration-300 relative focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                          bg-card/50 backdrop-blur-sm border border-border
                          hover:bg-accent/50 hover:border-accent
                          ${ selectedAnswer && option === selectedAnswer
                            ? isCorrect ? '!bg-green-500/80 !border-green-400' : '!bg-red-500/80 !border-red-400 animate-shake'
                            : selectedAnswer && option === currentEmoji.name ? '!bg-green-500/80 !border-green-400' : ''
                        }`}
                        disabled={!!selectedAnswer}
                      >
                        <span className="absolute top-2 left-3 text-xs font-bold opacity-50">{index + 1}</span>
                        <span className="px-4">{option}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
                <Button variant="ghost" onClick={quitGame} className="opacity-60 hover:opacity-100">
                  <X className="mr-2 h-4 w-4" />
                  Quit Game
                </Button>
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
            <h1 className="text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200 bg-[200%_auto] animate-text-gradient">
              Emoji Sprint
            </h1>
            <p className="text-xl text-muted-foreground max-w-md">Guess the emoji's name before the timer runs out. How high can you score?</p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button onClick={startGame} size="lg" className="transition-all duration-300 hover:shadow-[0_0_2rem_hsl(var(--primary)/0.3)]">Start Game</Button>
              <Button asChild variant="secondary" size="lg" className="transition-all duration-300 hover:bg-muted/80">
                <Link href="/discover">Discover Emojis</Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="transition-all duration-300 hover:bg-muted/80">
                <Link href="/history">Emoji History</Link>
              </Button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen text-foreground p-4 overflow-hidden transition-colors duration-500 ${
      flash === 'correct' ? 'bg-green-900/20' : flash === 'wrong' ? 'bg-red-900/20' : ''
    }`}>
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {gameState === 'playing' && (
        <div className="absolute top-4 left-4 flex gap-4 text-xl font-semibold bg-card/50 backdrop-blur-sm border border-border rounded-lg px-4 py-2">
          <motion.div whileTap={{ scale: 0.9 }} className="flex items-center gap-2">
            <Award className="h-6 w-6 text-yellow-400" />
            <AnimatedStat value={score} />
          </motion.div>
          <div className="w-[1px] bg-border"></div>
          <motion.div whileTap={{ scale: 0.9 }} className="flex items-center gap-2">
            <Flame className={`h-6 w-6 transition-colors ${streak > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
            <AnimatedStat value={streak} />
          </motion.div>
        </div>
      )}
      <main className="flex-grow flex items-center justify-center w-full">
        {renderGameState()}
      </main>
    </div>
  );
}