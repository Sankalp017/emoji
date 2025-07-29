"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { EMOJI_CATEGORIES, Emoji } from "@/lib/emojis";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { ArrowLeft, MessageCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function DiscoverPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const allEmojis = useMemo(() => EMOJI_CATEGORIES.flatMap(c => c.emojis), []);

  const filteredEmojis = useMemo(() => {
    let emojisToFilter: Emoji[];

    if (selectedCategory === "All") {
      emojisToFilter = allEmojis;
    } else {
      emojisToFilter =
        EMOJI_CATEGORIES.find((c) => c.name === selectedCategory)?.emojis || [];
    }

    if (!searchTerm) return emojisToFilter;

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
      <header className="fixed top-0 left-0 w-full p-4 flex justify-between items-center z-50 bg-background/80 backdrop-blur-sm">
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <ThemeToggle />
      </header>

      {/* New sticky container for title, search, and categories */}
      <div className="sticky top-[72px] bg-background/95 backdrop-blur-sm z-40 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold tracking-tighter">
              Emoji Explorer
            </h1>
            <p className="text-muted-foreground mt-2">
              Browse {allEmojis.length} emojis across {EMOJI_CATEGORIES.length} categories.
            </p>
          </div>

          <div className="max-w-lg mx-auto mb-4">
            <Input
              type="text"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex justify-center gap-2 pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                  className="shrink-0"
                >
                  {category}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>

      {/* Main content area, removed pt-32 as the sticky header now provides the offset */}
      <div className="p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {isIsraelSearch ? (
            <div className="mt-8 flex justify-center">
              <Card className="max-w-2xl w-full bg-card text-card-foreground shadow-2xl border-2 border-primary/50 rounded-xl overflow-hidden">
                <CardHeader className="text-center bg-primary/10 p-6">
                  <div className="text-8xl mb-4">🇵🇸</div>
                  <CardTitle className="text-4xl font-bold text-primary">Palestine</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4 p-6">
                  <p className="font-extrabold text-2xl text-primary mb-4">🇵🇸 Free Palestine 🇵🇸</p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    For over 75 years, Palestinians have lived under
                    occupation, apartheid, and displacement. Generations have
                    faced restrictions on movement, lack of access to basic
                    rights, and military violence. This is a small reminder that
                    symbols carry meaning and silence is complicity. Learn.
                    Share. Act.
                  </p>
                  <Button asChild className="mt-6" variant="default">
                    <Link
                      href="https://www.amnesty.org/en/latest/news/2022/02/israels-apartheid-against-palestinians-a-cruel-system-of-domination-and-a-crime-against-humanity/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📚 Learn More
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Drawer
              open={!!selectedEmoji}
              onOpenChange={(isOpen) => !isOpen && setSelectedEmoji(null)}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mt-4">
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
                        <DrawerDescription className="text-lg text-muted-foreground mt-2 px-4">
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
                  </div>

                  <DrawerFooter className="pt-6 px-0">
                    <DrawerClose asChild>
                      <Button variant="outline">Close</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              )}
            </Drawer>
          )}
        </div>
      </div>
    </div>
  );
}