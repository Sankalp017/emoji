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
  Sparkles,
  Bot,
  Users,
  Gavel,
  Languages,
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

        <main>
          <HistorySection
            narrationText="Before emojis, humans were already trying to capture feelings and ideas through pictures. From cave paintings to Egyptian hieroglyphs, we've always used visuals to express more than words alone."
            speak={speak}
          >
            <Pyramid className="w-16 h-16 text-primary" />
            <h1 className="text-5xl font-bold tracking-tighter">The Ancient Roots of Emojis</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Long before keyboards, we used pictures to capture feelings. From cave paintings 🐾 to Egyptian hieroglyphs 🔺, visual language is in our DNA.
            </p>
            <div className="flex gap-6 text-4xl mt-4">
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
                <TooltipContent><p>Medieval Doodles</p></TooltipContent>
              </Tooltip>
            </div>
          </HistorySection>

          <HistorySection
            narrationText="In 1982, computer scientist Scott Fahlman proposed using the first emoticons to humanize digital conversation in plain text."
            speak={speak}
          >
            <MessageCircle className="w-16 h-16 text-primary" />
            <h2 className="text-5xl font-bold tracking-tighter">The Birth of the Emoticon</h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              In 1982, <span className="text-primary font-semibold">Scott Fahlman</span> proposed using <code className="bg-muted p-1 rounded-md">{`:-)`}</code> and <code className="bg-muted p-1 rounded-md">{`:-(`}</code> to add emotion to online text, humanizing the first digital conversations.
            </p>
            <Card className="w-full max-w-md p-6 bg-muted/50">
              <p className="font-mono text-2xl md:text-4xl whitespace-pre-wrap text-center">
                {`:-)`}   {`;-P`}   {`XD`}   {`>:( `}   {`^_^`}
              </p>
            </Card>
          </HistorySection>

          <HistorySection
            narrationText="In 1999, Japan, designer Shigetaka Kurita created the first set of 176 true emojis for pagers, inspired by weather icons and manga symbols."
            speak={speak}
          >
            <Globe className="w-16 h-16 text-primary" />
            <h2 className="text-5xl font-bold tracking-tighter">The Rise of the Emoji</h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              In 1999, <span className="text-primary font-semibold">Shigetaka Kurita</span> in Japan 🇯🇵 created the first 176 emojis for pagers, inspired by weather icons, manga, and Kanji characters.
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
            narrationText="The 2010s were the turning point. Unicode standardized emojis, Apple put them on every iPhone, and they became a global phenomenon. In 2015, the 'Face with Tears of Joy' emoji was even Oxford Dictionary's Word of the Year."
            speak={speak}
          >
            <Sparkles className="w-16 h-16 text-primary" />
            <h2 className="text-5xl font-bold tracking-tighter">Global Explosion</h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              The <span className="text-primary font-semibold">Unicode Consortium</span> standardized emojis in 2010, and Apple's iOS keyboard in 2011 made them a worldwide phenomenon.
            </p>
            <Card className="w-full max-w-sm text-center">
              <CardHeader>
                <CardTitle>Word of the Year 2015</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-7xl">😂</p>
                <p className="text-muted-foreground mt-2">Oxford Dictionary</p>
              </CardContent>
            </Card>
          </HistorySection>

          <HistorySection
            narrationText="Emojis evolved beyond fun to become tools for representation and identity, with different skin tones, gender variations, and cultural symbols making our digital language more inclusive."
            speak={speak}
          >
            <Users className="w-16 h-16 text-primary" />
            <h2 className="text-5xl font-bold tracking-tighter">The Age of Identity</h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Emojis evolved to reflect our diverse world, adding skin tones, gender variations, and cultural symbols to create a more inclusive visual language.
            </p>
            <div className="w-full max-w-md space-y-6">
              <div className="text-6xl p-4 bg-muted/50 rounded-lg">
                👋{skinToneModifiers[skinTone]}
              </div>
              <Slider defaultValue={[2]} min={0} max={5} step={1} onValueChange={(value) => setSkinTone(value[0])} />
              <div className="flex justify-center gap-6 text-4xl mt-4">
                <Tooltip><TooltipTrigger><span>👩‍⚕️</span></TooltipTrigger><TooltipContent><p>Woman Health Worker</p></TooltipContent></Tooltip>
                <Tooltip><TooltipTrigger><span>👨‍🚀</span></TooltipTrigger><TooltipContent><p>Man Astronaut</p></TooltipContent></Tooltip>
                <Tooltip><TooltipTrigger><span>🏳️‍🌈</span></TooltipTrigger><TooltipContent><p>Pride Flag</p></TooltipContent></Tooltip>
                <Tooltip><TooltipTrigger><span>🪔</span></TooltipTrigger><TooltipContent><p>Diya Lamp</p></TooltipContent></Tooltip>
              </div>
            </div>
          </HistorySection>

          <HistorySection
            narrationText="Ever wonder how a new emoji is born? It's not magic. It's the Unicode Consortium, a non-profit that reviews detailed proposals from anyone. The process can take years, and requires proof that the emoji will be widely used."
            speak={speak}
          >
            <Gavel className="w-16 h-16 text-primary" />
            <h2 className="text-5xl font-bold tracking-tighter">The Emoji Gatekeepers</h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              New emojis are approved by the <span className="text-primary font-semibold">Unicode Consortium</span>. Anyone can submit a proposal, but it must prove the emoji will be widely used and is distinct. The process can take years!
            </p>
            <Card className="w-full max-w-2xl p-6 bg-muted/50">
              <p className="font-mono text-2xl md:text-3xl whitespace-pre-wrap text-center flex justify-around items-center">
                <span>📝<br/><span className="text-sm">Proposal</span></span>
                <span className="text-muted-foreground">→</span>
                <span>🗳️<br/><span className="text-sm">Review</span></span>
                <span className="text-muted-foreground">→</span>
                <span>✅<br/><span className="text-sm">Approved</span></span>
                <span className="text-muted-foreground">→</span>
                <span>📱<br/><span className="text-sm">On Your Phone</span></span>
              </p>
            </Card>
          </HistorySection>

          <HistorySection
            narrationText="An emoji can mean different things across cultures. The folded hands emoji, seen as prayer in the West, is a respectful greeting in Japan. The thumbs up can be seen as an offensive gesture in parts of the Middle East."
            speak={speak}
          >
            <Languages className="w-16 h-16 text-primary" />
            <h2 className="text-5xl font-bold tracking-tighter">Lost in Translation</h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              A friendly gesture or an insult? Emojis can have very different meanings depending on where you are in the world.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              <Card className="p-4 text-center bg-muted/50">
                <p className="text-6xl">🙏</p>
                <p className="mt-2 font-semibold">Prayer/Thanks (West) vs. Respectful Greeting (Japan)</p>
              </Card>
              <Card className="p-4 text-center bg-muted/50">
                <p className="text-6xl">😇</p>
                <p className="mt-2 font-semibold">Angelic (West) vs. Symbol of Death (China)</p>
              </Card>
              <Card className="p-4 text-center bg-muted/50">
                <p className="text-6xl">👍</p>
                <p className="mt-2 font-semibold">Approval (West) vs. Offensive Gesture (Middle East)</p>
              </Card>
            </div>
          </HistorySection>

          <HistorySection
            narrationText="Today, with over 3,800 emojis used by 90% of the world's internet users, emojis have become a universal language, crossing cultural and age boundaries."
            speak={speak}
          >
            <Bot className="w-16 h-16 text-primary" />
            <h2 className="text-5xl font-bold tracking-tighter">A Universal Language</h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              With over 3,800 emojis used by 90% of internet users, they have become a true global language, crossing cultural, age, and literacy boundaries.
            </p>
            <div className="flex gap-6 text-6xl mt-4">
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}>
                💬
              </motion.span>
              <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}>
                ❤️
              </motion.span>
              <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2.5, repeat: Infinity, repeatType: "mirror" }}>
                👍
              </motion.span>
            </div>
          </HistorySection>

          <HistorySection
            narrationText="What's next? Think AI-generated emojis tailored to your mood, animated emojis in AR and VR, and a future of expression that is truly personalized."
            speak={speak}
          >
            <Sparkles className="w-16 h-16 text-primary" />
            <h2 className="text-5xl font-bold tracking-tighter">The Future is Expressive</h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              The future is personal. Expect AI-generated emojis, animated reactions in AR/VR, and even more ways to express your unique self.
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
            narrationText="From tribal paintings to digital feelings, emojis are part of an ongoing evolution in human expression. They aren't just cute icons; they're a modern reflection of our oldest need: to be seen, to be felt, and to connect."
            speak={speak}
          >
            <Hand className="w-16 h-16 text-primary" />
            <h2 className="text-5xl font-bold tracking-tighter">More Than Just Icons</h2>
            <p className="text-2xl text-foreground max-w-2xl font-semibold">
              Emojis are a modern reflection of our oldest need:
              <br />
              <span className="text-primary">To be seen. To be felt. To connect.</span>
            </p>
            <Button size="lg" className="mt-4" asChild>
              <Link href="/">
                Play Emoji Sprint
              </Link>
            </Button>
          </HistorySection>
        </main>
      </div>
    </TooltipProvider>
  );
}