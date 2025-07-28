"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Hand,
  Pyramid,
  MessageCircle,
  Globe,
  Palette,
  Sparkles,
  Bot,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";

// A custom hook to handle speech synthesis
function useNarration() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const handleVoicesChanged = () => {
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice =
        voices.find(
          (v) => v.name.includes("Female") && v.lang.startsWith("en")
        ) || voices.find((v) => v.lang.startsWith("en-US")) || voices[0];
      setVoice(femaleVoice || null);
    };

    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    handleVoicesChanged(); // Initial load

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, []);

  const toggleNarration = () => {
    setIsEnabled((prev) => {
      if (!prev === false) {
        window.speechSynthesis.cancel();
      }
      return !prev;
    });
  };

  const speak = (text: string) => {
    if (isEnabled && voice) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.pitch = 1;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return { isEnabled, toggleNarration, speak };
}

// A reusable section component to handle animations and narration
const HistorySection = ({
  children,
  narrationText,
  speak,
}: {
  children: React.ReactNode;
  narrationText: string;
  speak: (text: string) => void;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      speak(narrationText);
    }
  }, [isInView, narrationText, speak]);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center p-8 gap-8"
    >
      {children}
    </motion.section>
  );
};

export default function HistoryPage() {
  const { isEnabled, toggleNarration, speak } = useNarration();
  const [skinTone, setSkinTone] = useState(2);
  const skinToneModifiers = ["", "🏻", "🏼", "🏽", "🏾", "🏿"];

  useEffect(() => {
    if (isEnabled) {
      speak(
        "Welcome to EmojiVerse. Let's travel back in time and discover the story of the emoji."
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled]);

  return (
    <TooltipProvider>
      <div className="bg-background text-foreground">
        <header className="fixed top-0 left-0 w-full p-4 flex justify-between items-center z-50 bg-background/80 backdrop-blur-sm">
          <Button asChild variant="outline" size="icon">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Game</span>
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={toggleNarration}>
              {isEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle Voice Narration</span>
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <main>
          <HistorySection
            narrationText="Long before keyboards, we expressed ourselves through pictures. From cave art to Egyptian hieroglyphs, early humans used visuals to say what words couldn’t."
            speak={speak}
          >
            <Hand className="w-16 h-16 text-primary" />
            <h1 className="text-5xl font-bold tracking-tighter">
              The Original Emojis: Our Ancient Symbols
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Long before keyboards, we expressed ourselves through pictures.
              From cave art 🐾 to Egyptian hieroglyphs 🔺, early humans used
              visuals to say what words couldn’t.
            </p>
            <div className="flex gap-6 text-4xl mt-4">
              <Tooltip>
                <TooltipTrigger>
                  <motion.span whileHover={{ scale: 1.2, rotate: -10 }} className="cursor-pointer">🖐️</motion.span>
                </TooltipTrigger>
                <TooltipContent><p>Hand Stencil, 30,000 BC</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <motion.span whileHover={{ scale: 1.2, rotate: 10 }} className="cursor-pointer">👁️</motion.span>
                </TooltipTrigger>
                <TooltipContent><p>Eye of Horus (Protection)</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <motion.span whileHover={{ scale: 1.2, rotate: -5 }} className="cursor-pointer">☀️</motion.span>
                </TooltipTrigger>
                <TooltipContent><p>Ra (Sun God)</p></TooltipContent>
              </Tooltip>
            </div>
          </HistorySection>

          <HistorySection
            narrationText="In 1982, computer scientist Scott Fahlman proposed the first emoticons to bring emotion into digital conversations."
            speak={speak}
          >
            <MessageCircle className="w-16 h-16 text-primary" />
            <h2 className="text-5xl font-bold tracking-tighter">
              The Rise of the Emoticon
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              In 1982, computer scientist{" "}
              <span className="text-primary font-semibold">Scott Fahlman</span>{" "}
              used <code className="bg-muted p-1 rounded-md">{`:-)`}</code> and{" "}
              <code className="bg-muted p-1 rounded-md">{`:-(`}</code> to add
              emotion to online messages. The emoticon was born!
            </p>
            <div className="flex gap-4 text-4xl">
              <motion.span animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>😊</motion.span>
              <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>😉</motion.span>
              <motion.span animate={{ scale: [1, 0.9, 1] }} transition={{ repeat: Infinity, duration: 2.5 }}>😢</motion.span>
            </div>
          </HistorySection>

          <HistorySection
            narrationText="In 1999, designer Shigetaka Kurita invented the first real emoji set for Japanese pagers."
            speak={speak}
          >
            <Pyramid className="w-16 h-16 text-primary" />
            <h2 className="text-5xl font-bold tracking-tighter">
              Where the Real Emojis Began
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Designer{" "}
              <span className="text-primary font-semibold">Shigetaka Kurita</span>{" "}
              invented the first emoji set in 1999 for Japanese pagers 📟,
              including icons for weather ☀️, emotions ❤️, and daily life 📱.
            </p>
            <div className="grid grid-cols-8 gap-4 p-4 bg-muted/50 rounded-lg border">
              {'❤✨✌☕✈☀☁☂☎✉🎵⛽✂✅❓❗'.split("").map((emoji, i) => (
                <Tooltip key={i}>
                  <TooltipTrigger>
                    <motion.div whileHover={{ scale: 1.5 }} className="text-2xl cursor-pointer">{emoji}</motion.div>
                  </TooltipTrigger>
                  <TooltipContent><p>Original NTT DoCoMo set</p></TooltipContent>
                </Tooltip>
              ))}
            </div>
          </HistorySection>

          <HistorySection
            narrationText="In 2010, Unicode standardized emojis. By 2011, Apple brought them to the iPhone, and they went global."
            speak={speak}
          >
            <Globe className="w-16 h-16 text-primary" />
            <h2 className="text-5xl font-bold tracking-tighter">
              Unicode Takes Over the World
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Emojis became a global language after{" "}
              <span className="text-primary font-semibold">
                Unicode standardized them in 2010
              </span>
              . Apple introduced them on iPhones in 2011—and the world never
              looked back.
            </p>
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle>Fun Fact!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">
                  The 'Face with Tears of Joy' emoji 😂 was Oxford Dictionary's
                  Word of the Year in 2015!
                </p>
              </CardContent>
            </Card>
          </HistorySection>

          <HistorySection
            narrationText="Emojis began to represent real people and real lives, with skin tones, diverse genders, and cultural icons."
            speak={speak}
          >
            <Users className="w-16 h-16 text-primary" />
            <h2 className="text-5xl font-bold tracking-tighter">
              Representation & Identity
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Emojis began to represent{" "}
              <span className="text-primary font-semibold">
                real people and real lives
              </span>
              . With skin tones, genders, and cultural diversity, emoji became
              more than fun—they became personal.
            </p>
            <div className="w-full max-w-md space-y-6">
              <div className="text-6xl p-4 bg-muted/50 rounded-lg">
                👋{skinToneModifiers[skinTone]}
              </div>
              <Slider defaultValue={[2]} min={0} max={5} step={1} onValueChange={(value) => setSkinTone(value[0])} />
              <div className="flex justify-center gap-6 text-4xl mt-4">
                <Tooltip><TooltipTrigger><span>👩‍⚕️</span></TooltipTrigger><TooltipContent><p>Woman Health Worker</p></TooltipContent></Tooltip>
                <Tooltip><TooltipTrigger><span>👨‍⚕️</span></TooltipTrigger><TooltipContent><p>Man Health Worker</p></TooltipContent></Tooltip>
                <Tooltip><TooltipTrigger><span>🧑‍⚕️</span></TooltipTrigger><TooltipContent><p>Health Worker</p></TooltipContent></Tooltip>
                <Tooltip><TooltipTrigger><span>🪔</span></TooltipTrigger><TooltipContent><p>Diya Lamp</p></TooltipContent></Tooltip>
                <Tooltip><TooltipTrigger><span>🧧</span></TooltipTrigger><TooltipContent><p>Red Envelope</p></TooltipContent></Tooltip>
              </div>
            </div>
          </HistorySection>

          <HistorySection
            narrationText="The next generation of emojis is AI-powered, 3D, and fully personalized. The future is expressive and infinite."
            speak={speak}
          >
            <Bot className="w-16 h-16 text-primary" />
            <h2 className="text-5xl font-bold tracking-tighter">
              The Future: AI, Custom, and Beyond
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              The next generation of emojis is{" "}
              <span className="text-primary font-semibold">
                AI-powered, 3D, and fully personalized
              </span>
              . Imagine your face as an emoji—or emotions generated in real
              time.
            </p>
            <div className="flex gap-6 text-6xl mt-4">
              <motion.span animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}>
                🤖
              </motion.span>
              <motion.span animate={{ y: [0, -10, 0], filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] }} transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}>
                ✨
              </motion.span>
              <motion.span animate={{ x: [0, 10, -10, 0] }} transition={{ duration: 2.5, repeat: Infinity, repeatType: "mirror" }}>
                🚀
              </motion.span>
            </div>
          </HistorySection>

          <HistorySection
            narrationText="Emojis connect us across borders, generations, and cultures. They aren’t just icons—they’re the way we feel, react, and belong in the digital world."
            speak={speak}
          >
            <Sparkles className="w-16 h-16 text-primary" />
            <h2 className="text-5xl font-bold tracking-tighter">
              The Universal Language
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Emojis connect us across borders 🌍, generations 👶👴, and
              cultures 🎎. They aren’t just icons—they’re the way we{" "}
              <span className="text-primary font-semibold">
                feel, react, and belong
              </span>{" "}
              in the digital world.
            </p>
            <div className="w-full max-w-sm space-y-4 mt-4">
              <Input placeholder="Share your favorite emoji..." />
              <Button size="lg" className="w-full">
                Share 💬
              </Button>
            </div>
          </HistorySection>
        </main>
      </div>
    </TooltipProvider>
  );
}