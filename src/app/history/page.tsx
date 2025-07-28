"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Hand,
  MessageCircle,
  Globe,
  Sparkles,
  Users,
  BookOpen,
  Palette,
  BrainCircuit,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
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
      className="min-h-screen w-full max-w-5xl mx-auto flex flex-col items-center justify-center p-8 gap-8"
    >
      {children}
    </motion.section>
  );
};

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="font-bold text-primary">{children}</span>
);

export default function HistoryPage() {
  const { isEnabled, toggleNarration, speak } = useNarration();
  const [skinTone, setSkinTone] = useState(2);
  const skinToneModifiers = ["", "🏻", "🏼", "🏽", "🏾", "🏿"];

  useEffect(() => {
    if (isEnabled) {
      speak(
        "Welcome to the story of the emoji. Let's travel back in time."
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={toggleNarration}>
                  {isEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle Voice Narration</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle voice narration</p>
              </TooltipContent>
            </Tooltip>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex flex-col items-center">
          <HistorySection
            narrationText="Before emojis, humans were already trying to capture feelings and ideas through pictures. From cave paintings to Egyptian hieroglyphs, we've always used visuals to express more than words alone."
            speak={speak}
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left">
                <BookOpen className="w-16 h-16 text-primary mb-4 mx-auto md:mx-0" />
                <h1 className="text-5xl font-bold tracking-tighter">The Ancient Roots</h1>
                <p className="text-xl text-muted-foreground mt-4">
                  Before keyboards, we used pictures to tell stories. From cave paintings to Egyptian hieroglyphs, <Highlight>visual language is in our DNA.</Highlight>
                </p>
              </div>
              <div className="flex justify-center">
                <Card>
                  <CardHeader>
                    <CardTitle>Early Visuals</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-around gap-6 text-5xl p-6">
                    <Tooltip>
                      <TooltipTrigger><motion.span whileHover={{ scale: 1.2, y: -5 }} className="cursor-pointer">🖼️</motion.span></TooltipTrigger>
                      <TooltipContent><p>Cave Paintings</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger><motion.span whileHover={{ scale: 1.2, y: -5 }} className="cursor-pointer">📜</motion.span></TooltipTrigger>
                      <TooltipContent><p>Hieroglyphs</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger><motion.span whileHover={{ scale: 1.2, y: -5 }} className="cursor-pointer">✍️</motion.span></TooltipTrigger>
                      <TooltipContent><p>Manuscripts</p></TooltipContent>
                    </Tooltip>
                  </CardContent>
                </Card>
              </div>
            </div>
          </HistorySection>

          <HistorySection
            narrationText="In 1982, computer scientist Scott Fahlman proposed using the first emoticons to humanize digital conversation in plain text."
            speak={speak}
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
               <div className="flex justify-center order-last md:order-first">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>The First Emoticons</CardTitle>
                    <CardDescription>Proposed in 1982</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-mono text-4xl md:text-5xl whitespace-pre-wrap text-center p-4 bg-muted rounded-lg">
                      {`:-)`}   {`:-(`}
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="text-center md:text-left">
                <MessageCircle className="w-16 h-16 text-primary mb-4 mx-auto md:mx-0" />
                <h2 className="text-5xl font-bold tracking-tighter">The Emoticon</h2>
                <p className="text-xl text-muted-foreground mt-4">
                  In 1982, computer scientist <Highlight>Scott Fahlman</Highlight> proposed using text characters to create "smileys," adding a human touch to the first digital bulletin boards.
                </p>
              </div>
            </div>
          </HistorySection>

          <HistorySection
            narrationText="In 1999, Japan, designer Shigetaka Kurita created the first set of 176 true emojis for pagers, inspired by weather icons and manga symbols."
            speak={speak}
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left">
                <Globe className="w-16 h-16 text-primary mb-4 mx-auto md:mx-0" />
                <h2 className="text-5xl font-bold tracking-tighter">The First Emojis</h2>
                <p className="text-xl text-muted-foreground mt-4">
                  The first true emoji set was created in 1999 by <Highlight>Shigetaka Kurita</Highlight> in Japan 🇯🇵 for pagers. It included 176 simple, 12x12 pixel icons.
                </p>
              </div>
              <div className="flex justify-center">
                <Card className="w-full max-w-sm">
                  <CardHeader>
                    <CardTitle>Original NTT DoCoMo Set</CardTitle>
                    <CardDescription>A few of the first 176</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-6 gap-4 p-4 bg-muted rounded-lg border">
                      {'❤✨✌☕✈☀☁☂☎✉🎵⛽'.split("").map((emoji, i) => (
                        <motion.div key={i} whileHover={{ scale: 1.5 }} className="text-2xl text-center">{emoji}</motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </HistorySection>

          <HistorySection
            narrationText="The 2010s were the turning point. Unicode standardized emojis, Apple put them on every iPhone, and they became a global phenomenon. In 2015, the 'Face with Tears of Joy' emoji was even Oxford Dictionary's Word of the Year."
            speak={speak}
          >
            <div className="text-center">
              <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-5xl font-bold tracking-tighter">Global Explosion</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
                The <Highlight>Unicode Consortium's</Highlight> standardization in 2010 and <Highlight>Apple's</Highlight> iOS keyboard in 2011 launched emojis into a worldwide phenomenon. By 2015, they were so popular that one became Oxford Dictionary's Word of the Year.
              </p>
              <Card className="w-full max-w-sm text-center mt-8 mx-auto border-primary border-2 shadow-lg shadow-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Word of the Year 2015</CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.p 
                    className="text-8xl"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: 'mirror' }}
                  >
                    😂
                  </motion.p>
                  <p className="text-muted-foreground mt-2">"Face with Tears of Joy"</p>
                </CardContent>
              </Card>
            </div>
          </HistorySection>

          <HistorySection
            narrationText="Emojis evolved beyond fun to become tools for representation and identity, with different skin tones, gender variations, and cultural symbols making our digital language more inclusive."
            speak={speak}
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left">
                <Palette className="w-16 h-16 text-primary mb-4 mx-auto md:mx-0" />
                <h2 className="text-5xl font-bold tracking-tighter">The Age of Identity</h2>
                <p className="text-xl text-muted-foreground mt-4">
                  Emojis evolved to reflect our diverse world. The introduction of <Highlight>skin tones, gender options,</Highlight> and <Highlight>cultural symbols</Highlight> made our digital language more inclusive.
                </p>
              </div>
              <div className="flex justify-center">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>Representation Matters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-7xl p-4 bg-muted rounded-lg text-center">
                      👋{skinToneModifiers[skinTone]}
                    </div>
                    <Slider defaultValue={[2]} min={0} max={5} step={1} onValueChange={(value) => setSkinTone(value[0])} />
                    <div className="flex justify-around gap-4 text-4xl pt-4">
                      <Tooltip><TooltipTrigger><span>👩‍⚕️</span></TooltipTrigger><TooltipContent><p>Woman Health Worker</p></TooltipContent></Tooltip>
                      <Tooltip><TooltipTrigger><span>👨‍🚀</span></TooltipTrigger><TooltipContent><p>Man Astronaut</p></TooltipContent></Tooltip>
                      <Tooltip><TooltipTrigger><span>🏳️‍🌈</span></TooltipTrigger><TooltipContent><p>Pride Flag</p></TooltipContent></Tooltip>
                      <Tooltip><TooltipTrigger><span>🪔</span></TooltipTrigger><TooltipContent><p>Diya Lamp</p></TooltipContent></Tooltip>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </HistorySection>

          <HistorySection
            narrationText="Today, with over 3,800 emojis used by 90% of the world's internet users, emojis have become a universal language, crossing cultural and age boundaries."
            speak={speak}
          >
            <div className="text-center">
              <Users className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-5xl font-bold tracking-tighter">A Universal Language</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
                Today, emojis have become a true global language, crossing cultural and age boundaries to connect us all.
              </p>
              <div className="flex flex-col md:flex-row gap-4 mt-8">
                <Card className="p-4 text-center flex-1">
                  <p className="text-4xl font-bold text-primary">3,800+</p>
                  <p className="text-muted-foreground">Official Emojis</p>
                </Card>
                <Card className="p-4 text-center flex-1">
                  <p className="text-4xl font-bold text-primary">90%</p>
                  <p className="text-muted-foreground">Of Internet Users Use Them</p>
                </Card>
                <Card className="p-4 text-center flex-1">
                  <p className="text-4xl font-bold text-primary">10B</p>
                  <p className="text-muted-foreground">Sent Daily</p>
                </Card>
              </div>
            </div>
          </HistorySection>

          <HistorySection
            narrationText="What's next? Think AI-generated emojis tailored to your mood, animated emojis in AR and VR, and a future of expression that is truly personalized."
            speak={speak}
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center order-last md:order-first">
                <div className="flex gap-6 text-7xl mt-4">
                  <motion.span animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}>
                    <BrainCircuit className="w-24 h-24 text-blue-500" />
                  </motion.span>
                  <motion.span animate={{ y: [0, -10, 0], filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] }} transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}>
                    <Sparkles className="w-24 h-24 text-yellow-500" />
                  </motion.span>
                </div>
              </div>
              <div className="text-center md:text-left">
                <Rocket className="w-16 h-16 text-primary mb-4 mx-auto md:mx-0" />
                <h2 className="text-5xl font-bold tracking-tighter">The Future is Expressive</h2>
                <p className="text-xl text-muted-foreground mt-4">
                  What's next? Expect <Highlight>AI-generated</Highlight> emojis, animated reactions in <Highlight>AR/VR</Highlight>, and even more ways to express your unique self.
                </p>
              </div>
            </div>
          </HistorySection>

          <HistorySection
            narrationText="From tribal paintings to digital feelings, emojis are part of an ongoing evolution in human expression. They aren't just cute icons; they're a modern reflection of our oldest need: to be seen, to be felt, and to connect."
            speak={speak}
          >
            <div className="text-center">
              <Hand className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-5xl font-bold tracking-tighter">More Than Just Icons</h2>
              <p className="text-2xl text-foreground max-w-2xl font-semibold mt-4">
                Emojis are a modern reflection of our oldest need:
                <br />
                <span className="text-primary text-3xl mt-2 block">To be seen. To be felt. To connect.</span>
              </p>
              <Button size="lg" className="mt-8" asChild>
                <Link href="/">
                  Play Emoji World
                </Link>
              </Button>
            </div>
          </HistorySection>
        </main>
      </div>
    </TooltipProvider>
  );
}