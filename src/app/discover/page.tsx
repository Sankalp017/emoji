"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function DiscoverPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const allEmojis = useMemo(() => EMOJI_CATEGORIES.flatMap(c => c.emojis), []);

  const filteredEmojis = useMemo(() => {
    let emojisToFilter: Emoji[];

    if (selectedCategory === "All") {
      emojisToFilter = allEmojis;
    } else {
      emojisToFilter =
        EMOJI_CATEGORIES.find((c) => c.name === selectedCategory)?.emojis || [];
    }

    if (!searchTerm) {
      return emojisToFilter;
    }

    return emojisToFilter.filter(
      (emoji) =>
        emoji.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emoji.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, selectedCategory, allEmojis]);

  const categories = ["All", ...EMOJI_CATEGORIES.map((c) => c.name)];
  const isIsraelSearch = searchTerm.toLowerCase().trim() === "israel";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Single Sticky Header with Glassmorphism */}
      <div className="sticky top-0 w-full bg-background/95 backdrop-blur-sm z-40 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Top Nav */}
          <div className="flex justify-between items-center h-16">
            <Button asChild variant="outline" className="rounded-lg">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <ThemeToggle />
          </div>

          {/* Title, Search, and Categories */}
          <div className="pt-2 pb-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Emoji Explorer
            </h1>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              Browse {allEmojis.length} emojis across {EMOJI_CATEGORIES.length} categories.
            </p>
            <div className="max-w-xl mx-auto mt-6 mb-6">
              <Input
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 text-center rounded-lg text-base"
              />
            </div>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex justify-center gap-2 pb-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className="shrink-0 rounded-lg"
                  >
                    {category}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <main className="px-4 sm:px-6 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {isIsraelSearch ? (
            <div className="mt-8 flex justify-center p-4">
              <Card className="w-full max-w-xl bg-card text-card-foreground shadow-lg border rounded-2xl">
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
          ) : (
            <>
              {filteredEmojis.length === 0 && searchTerm !== "" ? (
                <div className="text-center text-muted-foreground text-lg mt-16">
                  No emojis found for "{searchTerm}". Try a different search!
                </div>
              ) : (
                isDesktop ? (
                  <Dialog
                    open={!!selectedEmoji}
                    onOpenChange={(isOpen) => !isOpen && setSelectedEmoji(null)}
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                      {filteredEmojis.map((emoji) => (
                        <DialogTrigger
                          asChild
                          key={emoji.char}
                          onClick={() => setSelectedEmoji(emoji)}
                        >
                          <Card className="cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-200 flex flex-col items-center justify-center aspect-square">
                            <CardContent className="p-2 flex flex-col items-center justify-center text-center gap-2">
                              <span className="text-4xl">{emoji.char}</span>
                              <p className="text-xs font-medium text-muted-foreground">
                                {emoji.name}
                              </p>
                            </CardContent>
                          </Card>
                        </DialogTrigger>
                      ))}
                    </div>

                    {selectedEmoji && (
                      <DialogContent className="sm:max-w-[425px]">
                        <div className="text-center">
                          <div className="text-8xl mb-4">{selectedEmoji.char}</div>
                          <DialogHeader>
                            <DialogTitle className="text-3xl font-bold">
                              {selectedEmoji.name}
                            </DialogTitle>
                            <DialogDescription className="text-lg text-muted-foreground mt-2">
                              {selectedEmoji.description}
                            </DialogDescription>
                          </DialogHeader>
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

                        <DialogFooter className="pt-6">
                          <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    )}
                  </Dialog>
                ) : (
                  <Drawer
                    open={!!selectedEmoji}
                    onOpenChange={(isOpen) => !isOpen && setSelectedEmoji(null)}
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                      {filteredEmojis.map((emoji) => (
                        <DrawerTrigger
                          asChild
                          key={emoji.char}
                          onClick={() => setSelectedEmoji(emoji)}
                        >
                          <Card className="cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-200 flex flex-col items-center justify-center aspect-square">
                            <CardContent className="p-2 flex flex-col items-center justify-center text-center gap-2">
                              <span className="text-4xl">{emoji.char}</span>
                              <p className="text-xs font-medium text-muted-foreground">
                                {emoji.name}
                              </p>
                            </CardContent>
                          </Card>
                        </DrawerTrigger>
                      ))}
                    </div>

                    {selectedEmoji && (
                      <DrawerContent>
                        <div className="mx-auto w-full max-w-md p-4">
                          <div className="text-center">
                            <div className="text-8xl mb-4">{selectedEmoji.char}</div>
                            <DrawerHeader className="p-0">
                              <DrawerTitle className="text-3xl font-bold">
                                {selectedEmoji.name}
                              </DrawerTitle>
                              <DrawerDescription className="text-lg text-muted-foreground mt-2">
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

                          <DrawerFooter className="pt-6 px-0">
                            <DrawerClose asChild>
                              <Button variant="outline">Close</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </div>
                      </DrawerContent>
                    )}
                  </Drawer>
                )
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}