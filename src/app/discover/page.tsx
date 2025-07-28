"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { EMOJIS, Emoji } from "@/lib/emojis";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle } from "lucide-react";

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
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold tracking-tighter">Emoji Explorer</h1>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Emoji World
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-lg mx-auto"
          />
        </div>

        <Dialog open={!!selectedEmoji} onOpenChange={(isOpen) => !isOpen && setSelectedEmoji(null)}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {filteredEmojis.map((emoji) => (
              <DialogTrigger asChild key={emoji.char} onClick={() => setSelectedEmoji(emoji)}>
                <Card className="cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-200 flex flex-col items-center justify-center aspect-square">
                  <CardContent className="p-2 flex flex-col items-center justify-center text-center gap-2">
                    <span className="text-4xl">{emoji.char}</span>
                    <p className="text-xs font-medium text-muted-foreground">{emoji.name}</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
            ))}
          </div>

          {selectedEmoji && (
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-4">
                  <span className="text-5xl">{selectedEmoji.char}</span>
                  <span className="text-3xl font-bold">{selectedEmoji.name}</span>
                </DialogTitle>
                <DialogDescription className="pt-2 text-base">
                  {selectedEmoji.description}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <h3 className="font-semibold mb-2 text-lg">Example Usage:</h3>
                <ul className="space-y-2">
                  {selectedEmoji.usage.map((use, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <MessageCircle className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <span>{use}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </div>
  );
}