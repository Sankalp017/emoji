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

const Section = ({
  icon: Icon,
  title,
  narrationText,
  speak,
  children,
}: {
  icon: React.ElementType;
  title: string;
  narrationText: string;
  speak: (text: string) => void;
  children: React.ReactNode;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      speak(narrationText);
    }
  }, [isInView, narrationText, speak]);

  return (
    <motion.section
      ref={ref}
      className="py-12"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg shrink-0">
          <Icon className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      </div>
      <div className="prose prose-lg dark:prose-invert max-w-none prose-p:text-muted-foreground prose-strong:text-foreground">
        {children}
      </div>
    </motion.section>
  );
};

export default function HistoryPage() {
  const { isEnabled, toggleNarration, speak } = useNarration();
  const [skinTone, setSkinTone] = useState(2);
  const skinToneModifiers = ["", "🏻", "🏼", "🏽", "🏾", "🏿"];

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
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle voice narration</p>
              </TooltipContent>
            </Tooltip>
            <ThemeToggle />
          </div>
        </header>

        <main className="container mx-auto max-w-3xl px-4">
          <div className="pt-24 pb-12 text-center">
            <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-5xl font-bold tracking-tighter">
              The Story of Emoji
            </h1>
            <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
              A visual journey through the fascinating history of the world's
              first global language.
            </p>
          </div>

          <div className="divide-y divide-border">
            <Section
              icon={Pyramid}
              title="The Ancient Roots"
              narrationText="Our story begins not with computers, but with the dawn of human communication. From cave paintings to Egyptian hieroglyphs, we've always used pictures to tell stories and convey complex ideas."
              speak={speak}
            >
              <p>
                Long before keyboards, we used pictures to capture feelings.
                From cave paintings 🐾 to Egyptian hieroglyphs 📜, visual
                language is in our DNA. It’s a universal human impulse.
              </p>
            </Section>

            <Section
              icon={MessageCircle}
              title="Digital Precursors"
              narrationText="Fast forward to the early internet. In 1982, computer scientist Scott Fahlman proposed using punctuation to create 'emoticons', a way to add emotional nuance to plain text. The smiley was born."
              speak={speak}
            >
              <p>
                In 1982, <strong>Scott Fahlman</strong> proposed{" "}
                <code className="bg-muted p-1 rounded-md">{`:-)`}</code> to add
                emotion to text. In Japan, a different style called{" "}
                <strong>Kaomoji</strong>, like{" "}
                <code className="bg-muted p-1 rounded-md">{`(^_^) `}</code>,
                emerged, which could be read without tilting your head.
              </p>
              <Card className="mt-6">
                <CardContent className="p-4">
                  <p className="font-mono text-xl md:text-2xl whitespace-pre-wrap text-center">
                    {`Western: :-)   ;-P   XD   >:( \nJapanese: (^_^) (T_T) (o.O)`}
                  </p>
                </CardContent>
              </Card>
            </Section>

            <Section
              icon={Globe}
              title="The Birth of Emoji in Japan (1999)"
              narrationText="The true birth of emoji happened in 1999. Designer Shigetaka Kurita, working for the Japanese phone company NTT DoCoMo, created the first set of 176 emojis. They were tiny, 12 by 12 pixel images."
              speak={speak}
            >
              <p>
                In 1999, <strong>Shigetaka Kurita</strong> created the first 176
                emojis for pagers in Japan 🇯🇵. Each was a tiny 12x12 pixel
                image, inspired by manga and weather symbols.
              </p>
              <div className="mt-6 not-prose">
                <OriginalEmojiDisplay />
              </div>
            </Section>

            <Section
              icon={Sparkles}
              title="Going Global: The Unicode Era (2010)"
              narrationText="The game changed in 2010 when the Unicode Consortium standardized emojis. This meant an emoji sent from one device would look similar on another. When Apple added an emoji keyboard to iOS in 2011, they went mainstream."
              speak={speak}
            >
              <p>
                The <strong>Unicode Consortium</strong> standardized emojis in
                2010, allowing them to work across different platforms. Apple's
                iOS keyboard in 2011 was the tipping point, making emojis a
                global phenomenon.
              </p>
              <Card className="w-full max-w-sm text-center mt-6">
                <CardHeader>
                  <CardTitle>Word of the Year 2015</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-7xl">😂</p>
                  <p className="text-muted-foreground mt-2">
                    Oxford Dictionary
                  </p>
                </CardContent>
              </Card>
            </Section>

            <Section
              icon={Palette}
              title="The Great Redesign (2016)"
              narrationText="As emojis became popular, their designs became a hot topic. In 2016, Apple controversially changed its realistic pistol emoji to a bright green water gun."
              speak={speak}
            >
              <p>
                Designs evolve. In a significant move, Apple replaced its
                realistic pistol emoji with a water gun in 2016 to reduce its
                potential for harm. This sparked a debate about the power and
                responsibility of emoji design.
              </p>
              <div className="flex items-center justify-center gap-8 p-6 bg-muted/50 rounded-lg w-full max-w-md mt-6 not-prose">
                <div className="text-center">
                  <Image
                    src="https://em-content.zobj.net/thumbs/120/apple/96/pistol_1f52b.png"
                    alt="Old pistol emoji"
                    width={50}
                    height={50}
                  />
                  <p className="text-sm font-semibold mt-2">Before 2016</p>
                </div>
                <ArrowRight className="w-8 h-8 text-muted-foreground flex-shrink-0" />
                <div className="text-center">
                  <p className="text-5xl">🔫</p>
                  <p className="text-sm font-semibold mt-2">After 2016</p>
                </div>
              </div>
            </Section>

            <Section
              icon={Users}
              title="The Age of Identity (2015-Present)"
              narrationText="As emojis became a global language, a new challenge emerged: representation. The Unicode standard has evolved to include a range of skin tones, gender-neutral options, and diverse family structures."
              speak={speak}
            >
              <p>
                Emojis evolved to reflect our diverse world. The addition of
                skin tones in 2015 was a landmark moment, followed by more
                gender options and cultural symbols to create a more inclusive
                language.
              </p>
              <div className="w-full max-w-md space-y-6 mt-6 not-prose">
                <div className="text-6xl p-4 bg-muted/50 rounded-lg text-center">
                  👋{skinToneModifiers[skinTone]}
                </div>
                <Slider
                  defaultValue={[2]}
                  min={0}
                  max={5}
                  step={1}
                  onValueChange={(value) => setSkinTone(value[0])}
                />
              </div>
            </Section>

            <Section
              icon={Bot}
              title="The Future is Expressive"
              narrationText="What's next? Think AI-generated emojis tailored to your mood, animated emojis that react to your voice, and a future of expression in virtual and augmented reality that is truly personalized."
              speak={speak}
            >
              <p>
                The journey isn't over. Expect AI-generated emojis, animated
                reactions in AR/VR, and even more ways to express your unique
                self. The language will continue to grow with us.
              </p>
              <div className="flex gap-6 text-6xl mt-6 justify-center not-prose">
                <motion.span
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "mirror",
                  }}
                >
                  🤖
                </motion.span>
                <motion.span
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "mirror",
                  }}
                >
                  ✨
                </motion.span>
                <motion.span
                  animate={{ x: [0, 10, -10, 0] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatType: "mirror",
                  }}
                >
                  🚀
                </motion.span>
              </div>
            </Section>
          </div>

          <div className="py-16 text-center">
            <Hand className="w-16 h-16 text-primary mx-auto" />
            <h2 className="text-4xl font-bold tracking-tighter mt-4">
              More Than Just Icons
            </h2>
            <p className="text-xl text-foreground max-w-2xl mx-auto mt-4 font-semibold">
              Emojis are a modern reflection of our oldest need:
              <br />
              <span className="text-primary">
                To be seen. To be felt. To connect.
              </span>
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