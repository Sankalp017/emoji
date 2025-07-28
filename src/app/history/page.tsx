"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
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

const TimelineItem = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
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

            <TimelineItem icon={Pyramid} title="The Ancient Roots">
              <p className="text-lg text-muted-foreground">
                Long before keyboards, we used pictures to capture feelings.
                From cave paintings 🐾 to Egyptian hieroglyphs 📜, visual
                language is in our DNA. It’s a universal human impulse.
              </p>
            </TimelineItem>

            <TimelineItem
              icon={MessageCircle}
              title="Digital Precursors: Emoticons & Kaomoji"
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

            <TimelineItem icon={Palette} title="The Great Redesign (2016)">
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

            <TimelineItem icon={Gavel} title="Emoji in the Courtroom">
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

            <TimelineItem icon={Scale} title="A Language of Nuance">
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

            <TimelineItem icon={Factory} title="The Emoji Factory">
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
                        src="https://em-content.zobj.net/thumbs/120/apple/391/health-worker_1f9d1-200d-2695-fe0f.png"
                        alt="Health Worker Emoji"
                        width={40}
                        height={40}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Health Worker (Gender-neutral)</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger>
                      <Image
                        src="https://em-content.zobj.net/thumbs/120/apple/391/family-man-woman-girl-boy_1f468-200d-1f469-200d-1f467-200d-1f466.png"
                        alt="Family Emoji"
                        width={40}
                        height={40}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Family</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger>
                      <Image
                        src="https://em-content.zobj.net/thumbs/120/apple/391/transgender-flag_1f3f3-fe0f-200d-26a7-fe0f.png"
                        alt="Transgender Flag Emoji"
                        width={40}
                        height={40}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Transgender Flag</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </TimelineItem>

            <TimelineItem icon={Bot} title="The Future is Expressive">
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