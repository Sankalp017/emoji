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
import { cn } from "@/lib/utils";

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
  className = "",
}: {
  children: React.ReactNode;
  narrationText: string;
  speak: (text: string) => void;
  className?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

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
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
      className={cn(
        "min-h-screen w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center p-8 gap-8",
        className
      )}
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
        "Welcome to the Story of Emoji. A journey from ancient symbols to a global digital language."
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
            narrationText="Our story begins not with computers, but with the dawn of human communication. From cave paintings to Egyptian hieroglyphs, we've always used pictures to tell stories and convey complex ideas."
            speak={speak}
          >
            <Pyramid className="w-16 h-16 text-primary" />
            <h1 className="text-5xl font-bold tracking-tighter">
              The Ancient Roots
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Long before keyboards, we used pictures to capture feelings. From
              cave paintings 🐾 to Egyptian hieroglyphs 📜, visual language is
              in our DNA. It’s a universal human impulse.
            </p>
            <div className="flex gap-6 text-4xl mt-4">
              <Tooltip>
                <TooltipTrigger>
                  <motion.span
                    whileHover={{ scale: 1.2, y: -5 }}
                    className="cursor-pointer"
                  >
                    🖼️
                  </motion.span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cave Paintings</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <motion.span
                    whileHover={{ scale: 1.2, y: -5 }}
                    className="cursor-pointer"
                  >
                    📜
                  </motion.span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Hieroglyphs</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <motion.span
                    whileHover={{ scale: 1.2, y: -5 }}
                    className="cursor-pointer"
                  >
                    ✍️
                  </motion.span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Medieval Doodles</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </HistorySection>

          <HistorySection
            narrationText="Fast forward to the early internet. In 1982, computer scientist Scott Fahlman proposed using punctuation to create 'emoticons', a way to add emotional nuance to plain text on university message boards. The smiley was born."
            speak={speak}
          >
            <MessageCircle className="w-16 h-16 text-primary" />
            <h2 className="text-5xl font-bold tracking-tighter">
              Digital Precursors
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              In 1982,{" "}
              <span className="text-primary font-semibold">Scott Fahlman</span>{" "}
              proposed{" "}
              <code className="bg-muted p-1 rounded-md">{`:-)`}</code> to add
              emotion to text. In Japan, a different style called{" "}
              <span className="text-primary font-semibold">Kaomoji</span>, like{" "}
              <code className="bg-muted p-1 rounded-md">{`(^_^) `}</code>,
              emerged, which could be read without tilting your head.
            </p>
            <Card className="w-full max-w-lg p-6 bg-muted/50">
              <p className="font-mono text-2xl md:text-3xl whitespace-pre-wrap text-center">
                {`Western: :-)   ;-P   XD   >:( `}
                <br />
                {`Japanese: (^_^)   (T_T)   (o.O)`}
              </p>
            </Card>
          </HistorySection>

          <HistorySection
            narrationText="The true birth of emoji happened in 1999. Designer Shigetaka Kurita, working for the Japanese phone company NTT DoCoMo, created the first set of 176 emojis. They were tiny, 12 by 12 pixel images, designed to convey information at a glance on small pager screens."
            speak={speak}
          >
            <Globe className="w-16 h-16 text-primary" />
            <h2 className="text-5xl font-bold tracking-tighter">
              The Birth of Emoji in Japan
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              In 1999,{" "}
              <span className="text-primary font-semibold">
                Shigetaka Kurita
              </span>{" "}
              created the first 176 emojis for pagers in Japan 🇯🇵. Each was a
              tiny 12x12 pixel image, inspired by manga and weather symbols.
              This was the first true emoji set.
            </p>
            <OriginalEmojiDisplay />
            <p className="text-sm text-muted-foreground mt-2">
              A sample of the original 1999 NTT DoCoMo emoji set.
            </p>
          </HistorySection>

          <HistorySection
            narrationText="For years, emojis were a Japan-only phenomenon. The game changed in 2010 when the Unicode Consortium, the organization that standardizes text on computers, officially adopted emojis. This meant an emoji sent from one device would look similar on another. When Apple added an emoji keyboard to iOS in 2011, they went mainstream."
            speak={speak}
          >
            <Sparkles className="w-16 h-16 text-primary" />
            <h2 className="text-5xl font-bold tracking-tighter">
              Going Global: The Unicode Era
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              The{" "}
              <span className="text-primary font-semibold">
                Unicode Consortium
              </span>{" "}
              standardized emojis in 2010, allowing them to work across
              different platforms. Apple's iOS keyboard in 2011 was the tipping
              point, making emojis a global phenomenon.
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
            narrationText="As emojis became popular, their designs became a hot topic. In 2016, Apple controversially changed its realistic pistol emoji to a bright green water gun. Other companies like Google and Twitter soon followed, marking a conscious decision by tech companies to influence the visual language we use."
            speak={speak}
          >
            <Palette className="w-16 h-16 text-primary" />
            <h2 className="text-5xl font-bold tracking-tighter">
              The Great Redesign
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Designs evolve. In a significant move, Apple replaced its
              realistic pistol emoji with a water gun in 2016 to reduce its
              potential for harm. This sparked a debate about the power and
              responsibility of emoji design.
            </p>
            <div className="flex items-center justify-center gap-8 p-6 bg-muted/50 rounded-lg w-full max-w-md">
              <div className="text-center">
                <Image
                  src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/96/pistol_1f52b.png"
                  alt="Old pistol emoji"
                  width={50}
                  height={50}
                  unoptimized
                />
                <p className="text-sm font-semibold mt-2">Before 2016</p>
              </div>
              <ArrowRight className="w-8 h-8 text-muted-foreground flex-shrink-0" />
              <div className="text-center">
                <p className="text-5xl">🔫</p>
                <p className="text-sm font-semibold mt-2">After 2016</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Note: The pistol emoji you see depends on your device's font.
            </p>
          </HistorySection>

          <HistorySection
            narrationText="Emojis are not just for fun; they're showing up in courtrooms. Lawyers and judges are increasingly having to interpret the meaning of emojis in legal cases, from threats to business deals. What you text can have real-world legal consequences."
            speak={speak}
          >
            <Gavel className="w-16 h-16 text-primary" />
            <h2 className="text-5xl font-bold tracking-tighter">
              Emoji in the Courtroom
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Emojis are now serious business. They are increasingly cited as
              evidence in court cases, forcing judges to interpret their
              meaning in legal contexts. A single emoji can change the meaning
              of a message and have real-world consequences.
            </p>
            <Card className="w-full max-w-md p-6 bg-muted/50">
              <p className="text-lg">
                "The tenant agrees to move out by May 1st 👍"
              </p>
              <p className="text-muted-foreground mt-4">
                Does 👍 constitute a binding agreement? Courts are deciding.
              </p>
            </Card>
          </HistorySection>

          <HistorySection
            narrationText="The meaning of an emoji can change dramatically across cultures. The folded hands emoji is used for 'please' or 'thank you' in Japan, but often represents prayer or a high-five in Western cultures. This can lead to some interesting misunderstandings."
            speak={speak}
          >
            <Scale className="w-16 h-16 text-primary" />
            <h2 className="text-5xl font-bold tracking-tighter">
              A Language of Nuance
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              What you send isn't always what's received. The meaning of an
              emoji can change across cultures, leading to misunderstandings.
            </p>
            <div className="flex items-center gap-8 p-6 bg-muted/50 rounded-lg">
              <div className="text-center">
                <p className="text-6xl">🙏</p>
                <p className="text-sm font-semibold mt-2">Prayer in West</p>
              </div>
              <div className="text-center">
                <p className="text-6xl">🙏</p>
                <p className="text-sm font-semibold mt-2">Thank You in Japan</p>
              </div>
            </div>
          </HistorySection>

          <HistorySection
            narrationText="Ever wonder how a new emoji is born? Anyone can submit a proposal to the Unicode Consortium, but it's a tough process. The proposal must include evidence that the emoji is needed and will be widely used. If approved, it can take years to appear on your phone."
            speak={speak}
          >
            <Factory className="w-16 h-16 text-primary" />
            <h2 className="text-5xl font-bold tracking-tighter">
              The Emoji Factory
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              New emojis are born through a formal process. Anyone can submit a
              detailed proposal to Unicode, but it must prove the emoji will be
              widely used. From proposal to your keyboard can take over two
              years.
            </p>
            <div className="text-2xl font-mono text-center space-y-2">
              <p>Proposal 📝</p>
              <p className="text-primary">↓</p>
              <p>Unicode Review 🧐</p>
              <p className="text-primary">↓</p>
              <p>Design by Vendors (Apple, Google) 🎨</p>
              <p className="text-primary">↓</p>
              <p>Release on your Phone! 📱</p>
            </div>
          </HistorySection>

          <HistorySection
            narrationText="As emojis became a global language, a new challenge emerged: representation. The Unicode standard has evolved to include a range of skin tones, gender-neutral options, and diverse family structures, making our digital conversations more inclusive."
            speak={speak}
          >
            <Users className="w-16 h-16 text-primary" />
            <h2 className="text-5xl font-bold tracking-tighter">
              The Age of Identity
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Emojis evolved to reflect our diverse world. The addition of skin
              tones in 2015 was a landmark moment, followed by more gender
              options, and cultural symbols to create a more inclusive
              language.
            </p>
            <div className="w-full max-w-md space-y-6">
              <div className="text-6xl p-4 bg-muted/50 rounded-lg">
                👋{skinToneModifiers[skinTone]}
              </div>
              <Slider
                defaultValue={[2]}
                min={0}
                max={5}
                step={1}
                onValueChange={(value) => setSkinTone(value[0])}
              />
              <div className="flex justify-center gap-6 text-4xl mt-4">
                <Tooltip>
                  <TooltipTrigger>
                    <span>🧑‍⚕️</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Health Worker (Gender-neutral)</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger>
                    <span>👨‍👩‍👧‍👦</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Family</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger>
                    <span>🏳️‍⚧️</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Transgender Flag</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </HistorySection>

          <HistorySection
            narrationText="What's next? Think AI-generated emojis tailored to your mood, animated emojis that react to your voice, and a future of expression in virtual and augmented reality that is truly personalized."
            speak={speak}
          >
            <Bot className="w-16 h-16 text-primary" />
            <h2 className="text-5xl font-bold tracking-tighter">
              The Future is Expressive
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              The journey isn't over. Expect AI-generated emojis, animated
              reactions in AR/VR, and even more ways to express your unique
              self. The language will continue to grow with us.
            </p>
            <div className="flex gap-6 text-6xl mt-4">
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
                  filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
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
          </HistorySection>

          <HistorySection
            narrationText="From ancient symbols to digital feelings, emojis are part of the grand story of human expression. They aren't just cute icons; they're a modern reflection of our oldest need: to be seen, to be felt, and to connect."
            speak={speak}
          >
            <Hand className="w-16 h-16 text-primary" />
            <h2 className="text-5xl font-bold tracking-tighter">
              More Than Just Icons
            </h2>
            <p className="text-2xl text-foreground max-w-2xl font-semibold">
              Emojis are a modern reflection of our oldest need:
              <br />
              <span className="text-primary">
                To be seen. To be felt. To connect.
              </span>
            </p>
            <Button size="lg" className="mt-4" asChild>
              <Link href="/">Play Emoji Sprint</Link>
            </Button>
          </HistorySection>
        </main>
      </div>
    </TooltipProvider>
  );
}