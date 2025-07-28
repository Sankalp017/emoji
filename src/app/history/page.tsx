"use client";

import React, { useState } from "react";
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
      className="relative pl-16 sm:pl-20 pb-16"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute left-0 top-1 flex items-center justify-center w-12 h-12 bg-background border-2 border-primary rounded-full">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="prose prose-lg dark:prose-invert max-w-none prose-p:text-muted-foreground prose-strong:text-foreground">
        <h2 className="text-3xl font-bold tracking-tight !mb-4">{title}</h2>
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

        <main className="container mx-auto max-w-3xl px-4">
          <div className="pt-24 pb-12 text-center">
            <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-5xl font-bold tracking-tighter">
              The Story of Emoji
            </h1>
            <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
              From ancient symbols to the world's first global language.
            </p>
          </div>

          <div className="relative border-l-2 border-border ml-6">
            <TimelineItem icon={Pyramid} title="Ancient Roots">
              <p>
                Before keyboards, there were pictures. From cave paintings 🐾 to
                Egyptian hieroglyphs 📜, using symbols to communicate is a
                timeless human impulse.
              </p>
            </TimelineItem>

            <TimelineItem icon={MessageCircle} title="Digital Precursors">
              <p>
                In 1982, <strong>Scott Fahlman</strong> proposed{" "}
                <code className="bg-muted p-1 rounded-md">{`:-)`}</code> to add
                emotion to text. In Japan, a different style,{" "}
                <strong>Kaomoji</strong>, like{" "}
                <code className="bg-muted p-1 rounded-md">{`(^_^) `}</code>,
                emerged that could be read without tilting your head.
              </p>
              <Card className="mt-8 not-prose">
                <CardContent className="p-4">
                  <p className="font-mono text-xl md:text-2xl whitespace-pre-wrap text-center">
                    {`Western: :-)   ;-P   XD   >:( \nJapanese: (^_^) (T_T) (o.O)`}
                  </p>
                </CardContent>
              </Card>
            </TimelineItem>

            <TimelineItem icon={Globe} title="The Birth of Emoji (1999)">
              <p>
                In 1999, <strong>Shigetaka Kurita</strong> created the first 176
                emojis for pagers in Japan 🇯🇵. Each was a tiny 12x12 pixel
                image, inspired by manga and weather symbols.
              </p>
              <div className="mt-8 not-prose">
                <OriginalEmojiDisplay />
              </div>
            </TimelineItem>

            <TimelineItem icon={Palette} title="The Great Redesign (2016)">
              <p>
                An emoji can be mightier than the sword. In 2016, Apple
                famously changed its realistic pistol emoji to a harmless water
                gun, sparking a global conversation about the impact of our
                digital symbols.
              </p>
              <div className="flex items-center justify-center gap-8 p-6 bg-muted/50 rounded-lg w-full max-w-md mt-8 not-prose">
                <div className="text-center">
                  <Image
                    src="https://em-content.zobj.net/thumbs/120/apple/96/pistol_1f52b.png"
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

            <TimelineItem icon={Gavel} title="Emoji in the Courtroom">
              <p>
                Emojis are serious business. They are now cited as evidence in
                court cases, forcing judges to interpret their meaning. A single
                emoji can change everything.
              </p>
              <Card className="w-full max-w-md p-6 bg-muted/50 mt-8 not-prose">
                <p className="text-lg">
                  "The tenant agrees to move out by May 1st 👍"
                </p>
                <p className="text-muted-foreground mt-4">
                  Does 👍 constitute a binding agreement? Courts are deciding.
                </p>
              </Card>
            </TimelineItem>

            <TimelineItem icon={Scale} title="A Language of Nuance">
              <p>
                What you send isn't always what's received. The meaning of an
                emoji can change across cultures, leading to misunderstandings.
              </p>
              <div className="flex items-center justify-around gap-8 p-6 bg-muted/50 rounded-lg mt-8 not-prose">
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

            <TimelineItem icon={Users} title="The Age of Identity">
              <p>
                Emojis have evolved to reflect our diverse world. The addition
                of skin tones in 2015 was a landmark moment, followed by more
                gender options and cultural symbols.
              </p>
              <div className="w-full max-w-md space-y-6 mt-8 not-prose">
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
            </TimelineItem>

            <TimelineItem icon={Bot} title="The Future is Expressive">
              <p>
                The journey isn't over. Expect AI-generated emojis, animated
                reactions in AR/VR, and even more ways to express your unique
                self. The language will continue to grow with us.
              </p>
              <div className="flex gap-6 text-6xl mt-8 justify-center not-prose">
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
                  animate={{ y: [0, -10, 0] }}
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