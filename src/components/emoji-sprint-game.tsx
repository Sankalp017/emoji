"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { EMOJIS, Emoji } from '@/lib/emojis';
import { cn, shuffle } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';
import { toast } from 'sonner';
import { useSound } from '@/hooks/use-sound';
import confetti from 'canvas-confetti';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, BarChart, Trophy, X, Rocket, Compass, BookOpen } from 'lucide-react';

const ROUND_DURATION = 5;

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
      
      const points = 10;
      setScore(s => s + points);

      setTimeout(nextRound, 1000);
    } else {
      playWrong();
      setIsCorrect(false);
      setFlash('wrong');
      toast.error(answer ? "Oops!" : "Time's up!", { duration: 1000 });
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
        const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;
        return (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <CardTitle className="text-4xl font-bold">Game Over!</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <div className="text-6xl font-bold text-primary mb-4">{score}</div>
                <div className="grid grid-cols-2 gap-4 w-full text-lg">
                  <div className="flex items-center justify-center gap-2 rounded-lg bg-muted p-3">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                    <span>High Score: {highScore}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 rounded-lg bg-muted p-3">
                    <BarChart className="h-6 w-6 text-blue-500" />
                    <span>Accuracy: {accuracy}%</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Button onClick={startGame} size="lg">Play Again</Button>
                  <Button onClick={quitGame} variant="secondary" size="lg">Main Menu</Button>
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
                    <motion.div key={option} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => handleAnswer(option)}
                        className={`w-full h-24 text-xl font-semibold whitespace-normal transition-colors duration-300 relative focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                          selectedAnswer && option === selectedAnswer
                            ? isCorrect ? 'bg-green-500 hover:bg-green-600 text-primary-foreground' : 'bg-red-500 hover:bg-red-600 text-primary-foreground animate-shake'
                            : selectedAnswer && option === currentEmoji.name ? 'bg-green-500 hover:bg-green-600 text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                        disabled={!!selectedAnswer}
                      >
                        <span className="absolute top-1 left-2 text-xs font-bold opacity-50">{index + 1}</span>
                        {option}
                      </Button>
                    </motion.div>
                  ))}
                </div>
                <Button variant="ghost" onClick={quitGame}>
                  <X className="mr-2 h-4 w-4" />
                  Quit
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        );
      case 'start':
      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center flex flex-col items-center gap-8 w-full"
          >
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-7xl font-bold tracking-tighter text-white">Emoji Sprint</h1>
              <p className="text-xl text-gray-400 max-w-lg">A fast-paced guessing game to test your emoji knowledge and speed.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl mt-8">
              <Card className="bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800/70 hover:border-primary transition-all cursor-pointer" onClick={startGame}>
                <CardHeader>
                  <Rocket className="h-10 w-10 text-primary mb-4" />
                  <CardTitle className="text-2xl">Start Game</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Jump right into the action and start guessing.</p>
                </CardContent>
              </Card>
              <Link href="/discover" className="block">
                <Card className="bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800/70 hover:border-primary transition-all h-full">
                  <CardHeader>
                    <Compass className="h-10 w-10 text-primary mb-4" />
                    <CardTitle className="text-2xl">Emoji Explorer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">Browse and learn about hundreds of emojis.</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/history" className="block">
                <Card className="bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800/70 hover:border-primary transition-all h-full">
                  <CardHeader>
                    <BookOpen className="h-10 w-10 text-primary mb-4" />
                    <CardTitle className="text-2xl">The Story of Emoji</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">Journey through the fascinating history of emoji.</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden transition-colors duration-500",
      gameState === 'start' ? 'bg-black text-gray-100' : 'bg-background text-foreground',
      flash === 'correct' ? 'bg-green-500/20' : undefined,
      flash === 'wrong' ? 'bg-red-500/20' : undefined
    )}>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      {gameState === 'playing' && (
        <div className="absolute top-4 left-4">
          <Card>
            <CardContent className="p-3 flex items-center gap-3">
              <Award className="h-8 w-8 text-yellow-400" />
              <div className="text-3xl font-bold tabular-nums">
                <AnimatedStat value={score} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <main className="flex-grow flex items-center justify-center w-full">
        {renderGameState()}
      </main>
    </div>
  );
}