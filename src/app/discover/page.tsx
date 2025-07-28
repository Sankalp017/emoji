"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { EMOJIS, Emoji } from "@/lib/emojis";
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
import { ArrowLeft, MessageCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DiscoverPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(null);

  const filteredEmojis = useMemo(() => {
    if (!searchTerm) return EMOJIS;
    return EMOJIS.filter(
      (emoji) =>
        emoji.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emoji.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 left-0 w-full p-4 flex justify-between items-center z-50 bg-background/80 backdrop-blur-sm">
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Game
          </Link>
        </Button>
        <ThemeToggle />
      </header>

      <div className="p-4 sm:p-6 md:p-8 pt-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tighter text-center mb-8">
            Emoji Explorer
          </h1>

          <div className="mb-8">
            <Input
              type="text"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-lg mx-auto"
            />
          </div>

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

                  <DrawerFooter className="pt-6 px-0">
                    <DrawerClose asChild>
                      <Button variant="outline">Close</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            )}
          </Drawer>
        </div>
      </div>
    </div>
  );
}