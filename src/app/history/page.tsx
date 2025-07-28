"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
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
  Scale,
  Factory,
  Palette,
  BookOpen,
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
import { OriginalEmojiDisplay } from "@/components/original-emoji-display";

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
    handleVoicesChanged();

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

const timelineData = [
  {
    icon: Pyramid,
    title: "The Ancient Roots",
    narrationText: "Our story begins not with computers, but with the dawn of human communication. From cave paintings to Egyptian hieroglyphs, we've always used pictures to tell stories and convey complex ideas.",
    content: () => (
      <p className="text-muted-foreground">
        Long before keyboards, we used pictures to capture feelings. From cave paintings 🐾 to Egyptian hieroglyphs 📜, visual language is in our DNA. It’s a universal human impulse.
      </p>
    ),
  },
  {
    icon: MessageCircle,
    title: "Digital Precursors",
    narrationText: "Fast forward to the early internet. In 1982, computer scientist Scott Fahlman proposed using punctuation to create 'emoticons', a way to add emotional nuance to plain text. The smiley was born.",
    content: () => (
      <>
        <p className="text-muted-foreground mb-4">
          In 1982, <span className="font-semibold text-foreground">Scott Fahlman</span> proposed <code className="bg-muted p-1 rounded-md">{`:-)`}</code> to add emotion to text. In Japan, a different style called <span className="font-semibold text-foreground">Kaomoji</span>, like <code className="bg-muted p-1 rounded-md">{`(^_^) `}</code>, emerged.
        </p>
        <Card className="w-full p-4 bg-muted/50">
          <p className="font-mono text-lg md:text-xl whitespace-pre-wrap text-center">
            {`Western: :-)   ;-P   XD\nJapanese: (^_^) (T_T)`}
          </p>
        </Card>
      </>
    ),
  },
  {
    icon: Globe,
    title: "The Birth of Emoji (1999)",
    narrationText: "The true birth of emoji happened in 1999. Designer Shigetaka Kurita, working for the Japanese phone company NTT DoCoMo, created the first set of 176 emojis. They were tiny, 12 by 12 pixel images.",
    content: () => (
      <>
        <p className="text-muted-foreground mb-4">
          In 1999, <span className="font-semibold text-foreground">Shigetaka Kurita</span> created the first 176 emojis for pagers in Japan 🇯🇵. Each was a tiny 12x12 pixel image.
        </p>
        <OriginalEmojiDisplay />
      </>
    ),
  },
  {
    icon: Sparkles,
    title: "Going Global (2010)",
    narrationText: "The game changed in 2010 when the Unicode Consortium standardized emojis. This meant an emoji sent from one device would look similar on another. When Apple added an emoji keyboard to iOS in 2011, they went mainstream.",
    content: () => (
      <>
        <p className="text-muted-foreground mb-4">
          The <span className="font-semibold text-foreground">Unicode Consortium</span> standardized emojis in 2010. Apple's iOS keyboard in 2011 was the tipping point for global adoption.
        </p>
        <Card className="w-full text-center">
          <CardHeader>
            <CardTitle>Word of the Year 2015</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-7xl">😂</p>
            <p className="text-muted-foreground mt-2">Oxford Dictionary</p>
          </CardContent>
        </Card>
      </>
    ),
  },
  {
    icon: Palette,
    title: "The Great Redesign (2016)",
    narrationText: "In 2016, Apple controversially changed its realistic pistol emoji to a bright green water gun. Other companies soon followed, marking a conscious decision by tech companies to influence the visual language we use.",
    content: () => (
      <>
        <p className="text-muted-foreground mb-4">
          Designs evolve. In a significant move, Apple replaced its realistic pistol emoji with a water gun in 2016 to reduce its potential for harm.
        </p>
        <div className="flex items-center justify-center gap-8 p-4 bg-muted/50 rounded-lg w-full">
          <div className="text-center">
            <Image src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/96/pistol_1f52b.png" alt="Old pistol emoji" width={40} height={40} unoptimized />
            <p className="text-xs font-semibold mt-1">Before</p>
          </div>
          <ArrowRight className="w-6 h-6 text-muted-foreground flex-shrink-0" />
          <div className="text-center">
            <p className="text-4xl">🔫</p>
            <p className="text-xs font-semibold mt-1">After</p>
          </div>
        </div>
      </>
    ),
  },
  {
    icon: Users,
    title: "The Age of Identity",
    narrationText: "As emojis became a global language, representation became a new challenge. The standard has evolved to include a range of skin tones, gender-neutral options, and diverse family structures.",
    content: () => {
      const [skinTone, setSkinTone] = useState(2);
      const skinToneModifiers = ["", "🏻", "🏼", "🏽", "🏾", "🏿"];
      return (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            The addition of skin tones in 2015 was a landmark moment, followed by more inclusive options for gender, families, and cultures.
          </p>
          <div className="text-5xl p-4 bg-muted/50 rounded-lg">
            👋{skinToneModifiers[skinTone]}
          </div>
          <Slider defaultValue={[2]} min={0} max={5} step={1} onValueChange={(value) => setSkinTone(value[0])} />
        </div>
      );
    },
  },
  {
    icon: Bot,
    title: "The Future is Expressive",
    narrationText: "What's next? Think AI-generated emojis tailored to your mood, animated emojis that react to your voice, and a future of expression in virtual and augmented reality that is truly personalized.",
    content: () => (
      <>
        <p className="text-muted-foreground mb-4">
          The journey isn't over. Expect AI-generated emojis, animated reactions in AR/VR, and even more ways to express your unique self.
        </p>
        <div className="flex gap-6 text-5xl mt-4 justify-center">
          <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}>
            🤖
          </motion.span>
          <motion.span animate={{ y: [0, -8, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}>
            ✨
          </motion.span>
          <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2.5, repeat: Infinity, repeatType: "mirror" }}>
            🚀
          </motion.span>
        </div>
      </>
    ),
  },
];

const TimelineNode = ({ item, index, speak }: { item: (typeof timelineData)[0]; index: number; speak: (text: string) => void }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const side = index % 2 === 0 ? 'left' : 'right';

  useEffect(() => {
    if (isInView) {
      speak(item.narrationText);
    }
  }, [isInView, item.narrationText, speak]);

  return (
    <div ref={ref} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
      <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary bg-background text-primary shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
        <item.icon className="w-5 h-5" />
      </div>
      <motion.div
        className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)]"
        initial={{ opacity: 0, x: side === 'left' ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
          </CardHeader>
          <CardContent>{item.content()}</CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default function HistoryPage() {
  const { isEnabled, toggleNarration, speak } = useNarration();

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
                  {isEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Toggle voice narration</p></TooltipContent>
            </Tooltip>
            <ThemeToggle />
          </div>
        </header>

        <main className="container mx-auto max-w-3xl px-4">
          <div className="pt-24 pb-12 text-center">
            <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-5xl font-bold tracking-tighter">The Story of Emoji</h1>
            <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
              A journey through the fascinating history of the world's first global language.
            </p>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-border/70">
            {timelineData.map((item, index) => (
              <TimelineNode key={index} item={item} index={index} speak={speak} />
            ))}
          </div>

          <div className="py-16 text-center">
            <Hand className="w-16 h-16 text-primary mx-auto" />
            <h2 className="text-4xl font-bold tracking-tighter mt-4">More Than Just Icons</h2>
            <p className="text-xl text-foreground max-w-2xl mx-auto mt-4 font-semibold">
              Emojis are a modern reflection of our oldest need:
              <br />
              <span className="text-primary">To be seen. To be felt. To connect.</span>
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/">Play Emoji Sprint</Link>
            </Button>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}