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
import { cn } from "@/lib/utils";

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

const TimelineItem = ({
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
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      speak(narrationText);
    }
  }, [isInView, narrationText, speak]);

  return (
    <motion.div
      ref={ref}
      className="relative pl-16 sm:pl-24 pb-16"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute left-0 top-0 flex items-center justify-center w-12 h-12 bg-background border-2 border-primary rounded-full -translate-x-1/2">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="ml-4">
        <h2 className="text-3xl font-bold tracking-tight mb-4">{title}</h2>
        {children}
      </div>
    </motion.div>
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
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle voice narration</p>
              </TooltipContent>
            </Tooltip>
            <ThemeToggle />
          </div>
        </header>

        <main className="container mx-auto max-w-4xl px-4">
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

          <div className="relative">
            <div className="absolute left-6 top-0 h-full w-0.5 bg-border -z-10" />

            <TimelineItem
              icon={Pyramid}
              title="The Ancient Roots"
              narrationText="Our story begins not with computers, but with the dawn of human communication. From cave paintings to Egyptian hieroglyphs, we've always used pictures to tell stories and convey complex ideas."
              speak={speak}
            >
              <p className="text-lg text-muted-foreground">
                Long before keyboards, we used pictures to capture feelings.
                From cave paintings 🐾 to Egyptian hieroglyphs 📜, visual
                language is in our DNA. It’s a universal human impulse.
              </p>
            </TimelineItem>

            <TimelineItem
              icon={MessageCircle}
              title="Digital Precursors: Emoticons & Kaomoji"
              narrationText="Fast forward to the early internet. In 1982, computer scientist Scott Fahlman proposed using punctuation to create 'emoticons', a way to add emotional nuance to plain text on university message boards. The smiley was born."
              speak={speak}
            >
              <p className="text-lg text-muted-foreground mb-4">
                In 1982,{" "}
                <span className="font-semibold text-foreground">
                  Scott Fahlman
                </span>{" "}
                proposed{" "}
                <code className="bg-muted p-1 rounded-md">{`:-)`}</code> to add
                emotion to text. In Japan, a different style called{" "}
                <span className="font-semibold text-foreground">Kaomoji</span>,
                like <code className="bg-muted p-1 rounded-md">{`(^_^) `}</code>
                , emerged, which could be read without tilting your head.
              </p>
              <Card className="w-full max-w-lg p-4 bg-muted/50">
                <p className="font-mono text-xl md:text-2xl whitespace-pre-wrap text-center">
                  {`Western: :-)   ;-P   XD   >:( \nJapanese: (^_^) (T_T) (o.O)`}
                </p>
              </Card>
            </TimelineItem>

            <TimelineItem
              icon={Globe}
              title="The Birth of Emoji in Japan (1999)"
              narrationText="The true birth of emoji happened in 1999. Designer Shigetaka Kurita, working for the Japanese phone company NTT DoCoMo, created the first set of 176 emojis. They were tiny, 12 by 12 pixel images, designed to convey information at a glance on small pager screens."
              speak={speak}
            >
              <p className="text-lg text-muted-foreground mb-4">
                In 1999,{" "}
                <span className="font-semibold text-foreground">
                  Shigetaka Kurita
                </span>{" "}
                created the first 176 emojis for pagers in Japan 🇯🇵. Each was
                a tiny 12x12 pixel image, inspired by manga and weather
                symbols. This was the first true emoji set.
              </p>
              <OriginalEmojiDisplay />
            </TimelineItem>

            <TimelineItem
              icon={Sparkles}
              title="Going Global: The Unicode Era (2010)"
              narrationText="For years, emojis were a Japan-only phenomenon. The game changed in 2010 when the Unicode Consortium, the organization that standardizes text on computers, officially adopted emojis. This meant an emoji sent from one device would look similar on another. When Apple added an emoji keyboard to iOS in 2011, they went mainstream."
              speak={speak}
            >
              <p className="text-lg text-muted-foreground mb-4">
                The{" "}
                <span className="font-semibold text-foreground">
                  Unicode Consortium
                </span>{" "}
                standardized emojis in 2010, allowing them to work across
                different platforms. Apple's iOS keyboard in 2011 was the
                tipping point, making emojis a global phenomenon.
              </p>
              <Card className="w-full max-w-sm text-center">
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
            </TimelineItem>

            <TimelineItem
              icon={Palette}
              title="The Great Redesign (2016)"
              narrationText="As emojis became popular, their designs became a hot topic. In 2016, Apple controversially changed its realistic pistol emoji to a bright green water gun. Other companies like Google and Twitter soon followed, marking a conscious decision by tech companies to influence the visual language we use."
              speak={speak}
            >
              <p className="text-lg text-muted-foreground mb-4">
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
            </TimelineItem>

            <TimelineItem
              icon={Gavel}
              title="Emoji in the Courtroom"
              narrationText="Emojis are not just for fun; they're showing up in courtrooms. Lawyers and judges are increasingly having to interpret the meaning of emojis in legal cases, from threats to business deals. What you text can have real-world legal consequences."
              speak={speak}
            >
              <p className="text-lg text-muted-foreground mb-4">
                Emojis are now serious business. They are increasingly cited as
                evidence in court cases, forcing judges to interpret their
                meaning in legal contexts. A single emoji can change the
                meaning of a message and have real-world consequences.
              </p>
              <Card className="w-full max-w-md p-6 bg-muted/50">
                <p className="text-lg">
                  "The tenant agrees to move out by May 1st 👍"
                </p>
                <p className="text-muted-foreground mt-4">
                  Does 👍 constitute a binding agreement? Courts are deciding.
                </p>
              </Card>
            </TimelineItem>

            <TimelineItem
              icon={Scale}
              title="A Language of Nuance"
              narrationText="The meaning of an emoji can change dramatically across cultures. The folded hands emoji is used for 'please' or 'thank you' in Japan, but often represents prayer or a high-five in Western cultures. This can lead to some interesting misunderstandings."
              speak={speak}
            >
              <p className="text-lg text-muted-foreground mb-4">
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
                  <p className="text-sm font-semibold mt-2">
                    Thank You in Japan
                  </p>
                </div>
              </div>
            </TimelineItem>

            <TimelineItem
              icon={Factory}
              title="The Emoji Factory"
              narrationText="Ever wonder how a new emoji is born? Anyone can submit a proposal to the Unicode Consortium, but it's a tough process. The proposal must include evidence that the emoji is needed and will be widely used. If approved, it can take years to appear on your phone."
              speak={speak}
            >
              <p className="text-lg text-muted-foreground mb-4">
                New emojis are born through a formal process. Anyone can submit
                a detailed proposal to Unicode, but it must prove the emoji
                will be widely used. From proposal to your keyboard can take
                over two years.
              </p>
              <div className="text-xl font-mono text-center space-y-2">
                <p>Proposal 📝</p>
                <p className="text-primary">↓</p>
                <p>Unicode Review 🧐</p>
                <p className="text-primary">↓</p>
                <p>Design by Vendors (Apple, Google) 🎨</p>
                <p className="text-primary">↓</p>
                <p>Release on your Phone! 📱</p>
              </div>
            </TimelineItem>

            <TimelineItem
              icon={Users}
              title="The Age of Identity (2015-Present)"
              narrationText="As emojis became a global language, a new challenge emerged: representation. The Unicode standard has evolved to include a range of skin tones, gender-neutral options, and diverse family structures, making our digital conversations more inclusive."
              speak={speak}
            >
              <p className="text-lg text-muted-foreground mb-4">
                Emojis evolved to reflect our diverse world. The addition of
                skin tones in 2015 was a landmark moment, followed by more
                gender options, and cultural symbols to create a more
                inclusive language.
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
                <div className="flex justify-center gap-6 items-center mt-4">
                  <Tooltip>
                    <TooltipTrigger>
                      <Image
                        src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/325/health-worker_1f9d1-200d-2695-fe0f.png"
                        alt="Health Worker Emoji"
                        width={40}
                        height={40}
                        unoptimized
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Health Worker (Gender-neutral)</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger>
                      <Image
                        src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/325/family-man-woman-girl-boy_1f468-200d-1f469-200d-1f467-200d-1f466.png"
                        alt="Family Emoji"
                        width={40}
                        height={40}
                        unoptimized
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Family</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger>
                      <Image
                        src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/325/transgender-flag_1f3f3-fe0f-200d-26a7-fe0f.png"
                        alt="Transgender Flag Emoji"
                        width={40}
                        height={40}
                        unoptimized
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Transgender Flag</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </TimelineItem>

            <TimelineItem
              icon={Bot}
              title="The Future is Expressive"
              narrationText="What's next? Think AI-generated emojis tailored to your mood, animated emojis that react to your voice, and a future of expression in virtual and augmented reality that is truly personalized."
              speak={speak}
            >
              <p className="text-lg text-muted-foreground mb-4">
                The journey isn't over. Expect AI-generated emojis, animated
                reactions in AR/VR, and even more ways to express your unique
                self. The language will continue to grow with us.
              </p>
              <div className="flex gap-6 text-6xl mt-4 justify-center">
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
                    filter: [
                      "brightness(1)",
                      "brightness(1.5)",
                      "brightness(1)",
                    ],
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
            </TimelineItem>
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