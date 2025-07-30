"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { EMOJI_CATEGORIES, Emoji } from "@/lib/emojis";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const EASTER_EGGS: { keywords: string[]; content: { emoji: string; title: string; description: string; link?: string; linkText?: string } }[] = [
  {
    keywords: ['messi', 'leo messi', 'lionel messi', 'goat'],
    content: {
      emoji: '🐐',
      title: 'The Greatest Of All Time',
      description: 'Often considered the best player in the world and widely regarded as one of the greatest players of all time.',
      link: 'https://en.wikipedia.org/wiki/Lionel_Messi',
      linkText: 'Learn more about the GOAT'
    }
  },
  {
    keywords: ['cristiano', 'ronaldo', 'cristiano ronaldo'],
    content: {
      emoji: '😭',
      title: 'The Runner-Up',
      description: 'A phenomenal goal-poacher, famous for his meticulously crafted brand, his six-pack, and for perfecting the art of the on-field tantrum. Often found pointing to himself after a tap-in. Definitely maybe in the top 10... of his era.',
      link: 'https://en.wikipedia.org/wiki/Messi%E2%80%93Ronaldo_rivalry',
      linkText: 'See the rivalry stats'
    }
  },
  {
    keywords: ['penaldo'],
    content: {
      emoji: '🎯',
      title: 'The Penalty King',
      description: "A popular nickname celebrating his uncanny ability to find the back of the net from 12 yards. Some say his greatest skill is convincing the ref. A true master of the spot-kick.",
      link: 'https://www.goal.com/en/news/what-is-the-meaning-of-the-cristiano-ronaldo-penaldo-nickname/1c81pyk1nifp11u2q1e0a4b9c8',
      linkText: 'Read about the nickname'
    }
  },
  {
    keywords: ['hakuna matata'],
    content: {
      emoji: '🦁🐗',
      title: 'It means no worries!',
      description: "For the rest of your days. It's our problem-free philosophy.",
      link: 'https://www.youtube.com/watch?v=nbY_aP-alkw',
      linkText: 'Sing along'
    }
  },
  {
    keywords: ['to infinity and beyond'],
    content: {
      emoji: '🚀',
      title: 'To Infinity... and Beyond!',
      description: "The famous catchphrase of Buzz Lightyear from Toy Story.",
      link: 'https://www.youtube.com/watch?v=2OMixT39vhs',
      linkText: 'Watch the clip'
    }
  },
  {
    keywords: ['show me the money'],
    content: {
      emoji: '💰',
      title: 'SHOW ME THE MONEY!',
      description: "The iconic line from the movie Jerry Maguire. You have to scream it.",
      link: 'https://www.youtube.com/watch?v=1-mOKMq19zU',
      linkText: 'Feel the passion'
    }
  }
];

export default function DiscoverPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Emoji[]>([]);
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeEasterEgg, setActiveEasterEgg] = useState<typeof EASTER_EGGS[0]['content'] | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const allEmojis = useMemo(() => EMOJI_CATEGORIES.flatMap(c => c.emojis), []);

  const updateSuggestions = (value: string) => {
    if (value.length > 1) {
      const newSuggestions = allEmojis
        .filter(emoji =>
          emoji.name.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 7);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    updateSuggestions(value);

    const lowercasedValue = value.toLowerCase().trim();
    const foundEgg = EASTER_EGGS.find(egg => egg.keywords.includes(lowercasedValue));
    if (foundEgg) {
      setActiveEasterEgg(foundEgg.content);
    } else {
      setActiveEasterEgg(null);
    }
  };

  const handleSuggestionClick = (emoji: Emoji) => {
    setSearchTerm(emoji.name);
    setSuggestions([]);
    setSelectedEmoji(emoji);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredEmojis = useMemo(() => {
    const baseEmojis = selectedCategory === "All"
      ? allEmojis
      : EMOJI_CATEGORIES.find(c => c.name === selectedCategory)?.emojis || [];

    if (!searchTerm) {
      return baseEmojis;
    }

    const lowercasedTerm = searchTerm.toLowerCase();
    return baseEmojis.filter(emoji =>
      emoji.name.toLowerCase().includes(lowercasedTerm) ||
      emoji.description.toLowerCase().includes(lowercasedTerm) ||
      emoji.usage.some(use => use.toLowerCase().includes(lowercasedTerm))
    );
  }, [searchTerm, selectedCategory, allEmojis]);

  const categories = ["All", ...EMOJI_CATEGORIES.map((c) => c.name)];
  const isIsraelSearch = searchTerm.toLowerCase().trim() === "israel";

  const EmojiDetails = () => selectedEmoji && (
    <>
      <div className="text-center">
        <div className="text-8xl mb-4">{selectedEmoji.char}</div>
        <DrawerHeader className="text-left p-0">
          <DrawerTitle className="text-3xl font-bold text-center">
            {selectedEmoji.name}
          </DrawerTitle>
          <DrawerDescription className="text-lg text-muted-foreground mt-2 text-center">
            {selectedEmoji.description}
          </DrawerDescription>
        </DrawerHeader>
      </div>
      <div className="mt-6">
        <h3 className="font-semibold mb-3 text-xl text-center">
          Example Usage
        </h3>
        <div className="space-y-3">
          {selectedEmoji.usage.map((use, index) => (
            <Card key={index} className="bg-muted/50">
              <CardContent className="p-3 flex items-start gap-3">
                <MessageCircle className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
                <span className="text-base text-left">{use}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 w-full bg-background/80 backdrop-blur-lg z-40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center h-16">
            <Button asChild variant="outline" className="rounded-lg">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <ThemeToggle />
          </div>

          <div className="pt-2 pb-6 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold tracking-tighter"
            >
              Emoji Explorer
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground mt-3 max-w-2xl mx-auto"
            >
              Browse {allEmojis.length} emojis across {EMOJI_CATEGORIES.length} categories.
            </motion.p>
            <div className="relative max-w-xl mx-auto mt-6 mb-6" ref={searchContainerRef}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => updateSuggestions(searchTerm)}
                  className="h-12 w-full bg-muted/50 border-white/10 pl-12 pr-4 text-base rounded-full focus-visible:ring-2 focus-visible:ring-primary/50"
                />
              </div>
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="absolute top-full mt-2 w-full bg-card/80 backdrop-blur-lg text-card-foreground shadow-xl border border-white/10 rounded-2xl z-50">
                      <CardContent className="p-2">
                        <ul className="flex flex-col">
                          {suggestions.map((suggestion) => (
                            <li key={suggestion.char}>
                              <Button
                                variant="ghost"
                                className="w-full justify-start h-12 px-4 text-base rounded-lg"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                <span className="text-2xl mr-4 w-8 text-center">{suggestion.char}</span>
                                <span>{suggestion.name}</span>
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="mx-auto max-w-fit flex justify-center gap-2 p-1 bg-muted/50 rounded-full border border-white/10">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`relative shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      selectedCategory === category ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {selectedCategory === category && (
                      <motion.div
                        layoutId="active-category-pill"
                        className="absolute inset-0 bg-primary rounded-full"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{category}</span>
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </div>

      <main className="px-4 sm:px-6 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {isIsraelSearch ? (
            <div className="mt-8 flex justify-center p-4">
              <Card className="w-full max-w-xl bg-card/80 backdrop-blur-lg text-card-foreground shadow-xl border border-white/10 rounded-2xl">
                <CardContent className="p-8 text-center">
                  <div className="flex flex-col items-center gap-4 mb-6">
                    <span className="text-8xl">🇵🇸</span>
                    <h2 className="text-4xl font-bold tracking-tight text-primary">
                      Free Palestine
                    </h2>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-prose mx-auto">
                    For over 75 years, Palestinians have endured occupation,
                    apartheid, and displacement. This is a reminder that
                    symbols carry weight and silence is complicity.
                  </p>
                  <p className="mt-4 text-lg font-semibold text-muted-foreground">
                    Learn. Share. Act.
                  </p>
                  <Button asChild size="lg" className="mt-8">
                    <Link
                      href="https://www.amnesty.org/en/latest/news/2022/02/israels-apartheid-against-palestinians-a-cruel-system-of-domination-and-a-crime-against-humanity/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn More from Amnesty International
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : activeEasterEgg ? (
            <div className="mt-8 flex justify-center p-4">
              <Card className="w-full max-w-xl bg-card/80 backdrop-blur-lg text-card-foreground shadow-xl border border-white/10 rounded-2xl">
                <CardContent className="p-8 text-center">
                  <div className="flex flex-col items-center gap-4 mb-6">
                    <span className="text-8xl">{activeEasterEgg.emoji}</span>
                    <h2 className="text-4xl font-bold tracking-tight text-primary">
                      {activeEasterEgg.title}
                    </h2>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-prose mx-auto">
                    {activeEasterEgg.description}
                  </p>
                  {activeEasterEgg.link && (
                    <Button asChild size="lg" className="mt-8">
                      <Link
                        href={activeEasterEgg.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {activeEasterEgg.linkText}
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              {filteredEmojis.length === 0 && searchTerm !== "" ? (
                <div className="text-center text-muted-foreground text-lg mt-16">
                  No emojis found for "{searchTerm}". Try a different search!
                </div>
              ) : (
                <>
                  <Drawer
                    open={!!selectedEmoji}
                    onOpenChange={(isOpen) => {
                      if (!isOpen) {
                        setSelectedEmoji(null);
                      }
                    }}
                  >
                    <DrawerContent className="bg-card/80 backdrop-blur-lg border-t border-white/10">
                      <div className="mx-auto w-full max-w-md p-4">
                        <EmojiDetails />
                        <DrawerFooter className="pt-6 px-0">
                          <DrawerClose asChild>
                            <Button variant="outline">Close</Button>
                          </DrawerClose>
                        </DrawerFooter>
                      </div>
                    </DrawerContent>
                  </Drawer>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    <AnimatePresence>
                      {filteredEmojis.map((emoji) => (
                        <motion.div
                          layout
                          key={emoji.char}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                          <motion.div 
                            onClick={() => setSelectedEmoji(emoji)} 
                            whileHover={{ y: -5, scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} 
                            whileTap={{ scale: 0.95 }}
                            className="cursor-pointer"
                          >
                            <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center aspect-square">
                              <CardContent className="p-2 flex flex-col items-center justify-center text-center gap-2">
                                <span className="text-4xl">{emoji.char}</span>
                                <p className="text-xs font-medium text-muted-foreground">
                                  {emoji.name}
                                </p>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}