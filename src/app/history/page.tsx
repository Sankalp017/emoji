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
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ThemeToggle } from "@/components/theme-toggle";
import { TimelineItem } from "@/components/history/timeline-item";
import { OriginalEmojiSet } from "@/components/history/original-emoji-set";

export default function HistoryPage() {
  const [skinTone, setSkinTone] = useState(2);
  const skinToneModifiers = ["", "🏻", "🏼", "🏽", "🏾", "🏿"];

  return (
    <div className="bg-background text-foreground">
      <header className="fixed top-0 left-0 w-full p-4 flex justify-between items-center z-50 bg-background/80 backdrop-blur-sm">
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Home
          </Link>
        </Button>
        <ThemeToggle />
      </header>

      <main className="container mx-auto max-w-4xl px-4">
        <div className="pt-24 pb-16 text-center">
          <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter">
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
            <p>
              Long before keyboards, we used pictures to capture feelings. From
              30,000-year-old cave paintings 🐾 to Egyptian hieroglyphs 📜,
              visual language is in our DNA. It’s a universal human impulse to
              communicate with symbols.
            </p>
          </TimelineItem>

          <TimelineItem
            icon={MessageCircle}
            title="Digital Precursors: Emoticons & Kaomoji"
          >
            <p>
              In 1982, computer scientist <strong>Scott Fahlman</strong>{" "}
              proposed using <code>{`:-)`}</code> and <code>{`:-(`}</code> to
              add emotional context to online message boards. In Japan, a
              different style called <strong>Kaomoji</strong> emerged, using a
              richer character set to create faces like{" "}
              <code>{`(^_^) `}</code> that could be read without tilting your
              head.
            </p>
            <div className="not-prose mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Western Style</CardTitle>
                </CardHeader>
                <CardContent className="font-mono text-2xl text-center">
                  {`:-O  ;-)  XD`}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Japanese Style (Kaomoji)</CardTitle>
                </CardHeader>
                <CardContent className="font-mono text-2xl text-center">
                  {`(o.O) (T_T) (╯°□°）╯︵ ┻━┻`}
                </CardContent>
              </Card>
            </div>
          </TimelineItem>

          <TimelineItem
            icon={Globe}
            title="The Birth of Emoji in Japan (1999)"
          >
            <p>
              Working for the mobile carrier NTT DoCoMo,{" "}
              <strong>Shigetaka Kurita</strong> created the first 176 emojis
              for pagers. Each was a tiny 12x12 pixel image, inspired by manga
              art and weather symbols. This was the first true emoji set,
              designed for a digital world.
            </p>
            <OriginalEmojiSet />
          </TimelineItem>

          <TimelineItem
            icon={Sparkles}
            title="The Unicode Standard & Global Rise"
          >
            <p>
              Initially, emojis only worked on the carrier that created them.
              To fix this, the <strong>Unicode Consortium</strong>, a non-profit
              that standardizes software text, adopted emoji in 2010. This
              meant a ❤️ sent from an iPhone would appear as a ❤️ on an Android.
              Apple's inclusion of an emoji keyboard in iOS 5 (2011) was the
              tipping point, making emojis a global phenomenon.
            </p>
          </TimelineItem>

          <TimelineItem icon={Palette} title="The Great Redesign (2016)">
            <p>
              Designs evolve. In a significant move, Apple replaced its
              realistic pistol emoji with a green water gun in 2016 to reduce
              its potential for harm. This sparked a debate about the power and
              responsibility of emoji design, and other vendors soon followed.
            </p>
            <div className="not-prose mt-6 flex items-center justify-center gap-8 p-6 bg-muted/50 rounded-lg w-full max-w-md">
              <div className="text-center">
                <Image
                  src="https://em-content.zobj.net/thumbs/120/apple/96/pistol_1f52b.png"
                  alt="Old pistol emoji"
                  width={64}
                  height={64}
                  unoptimized
                />
                <p className="text-sm font-semibold mt-2">Before 2016</p>
              </div>
              <ArrowRight className="w-8 h-8 text-muted-foreground flex-shrink-0" />
              <div className="text-center">
                <p className="text-6xl">🔫</p>
                <p className="text-sm font-semibold mt-2">After 2016</p>
              </div>
            </div>
          </TimelineItem>

          <TimelineItem icon={Users} title="The Age of Identity (2015-Present)">
            <p>
              Emojis have evolved to reflect our diverse world. The addition of
              skin tone modifiers in 2015 was a landmark moment. Since then,
              we've seen gender-neutral options, people with disabilities, and
              diverse family structures added to create a more inclusive
              language.
            </p>
            <div className="not-prose w-full max-w-md space-y-6 mt-6">
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

          <TimelineItem icon={Factory} title="The Emoji Factory">
            <p>
              New emojis are born through a formal process. Anyone can submit a
              detailed proposal to Unicode, but it must prove the emoji will be
              widely used and isn't a fad. From proposal to your keyboard can
              take over two years.
            </p>
            <div className="not-prose text-xl font-mono text-center space-y-2 mt-6">
              <p>Proposal 📝</p>
              <p className="text-primary">↓</p>
              <p>Unicode Review 🧐</p>
              <p className="text-primary">↓</p>
              <p>Design by Vendors (Apple, Google) 🎨</p>
              <p className="text-primary">↓</p>
              <p>Release on your Phone! 📱</p>
            </div>
          </TimelineItem>

          <TimelineItem icon={Bot} title="The Future is Expressive">
            <p>
              The journey isn't over. Expect AI-generated emojis, animated
              reactions in AR/VR, and even more ways to express your unique
              self. The language will continue to grow with us, reflecting our
              ever-changing world.
            </p>
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
        </div>
      </main>
    </div>
  );
}