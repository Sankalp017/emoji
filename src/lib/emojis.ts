export type Emoji = {
  char: string;
  name: string;
  description: string;
  usage: string[];
};

export const EMOJIS: Emoji[] = [
  {
    char: "😀",
    name: "Grinning",
    description: "A classic, happy face with a wide, open-mouthed grin. Conveys general pleasure and good cheer.",
    usage: [
      "Just passed my exam! 😀",
      "Thanks for the birthday wishes!",
      "Can't wait to see you this weekend 😀",
    ],
  },
  {
    char: "😂",
    name: "Laughing",
    description: "Represents hysterical laughter, often with tears of joy. Used when something is extremely funny.",
    usage: [
      "You're hilarious! I'm crying 😂",
      "That cat video is the best thing I've seen all day 😂",
      "I can't believe you actually did that 😂",
    ],
  },
  {
    char: "😍",
    name: "In Love",
    description: "A face with hearts for eyes. Expresses feelings of love, adoration, or infatuation with a person, place, or thing.",
    usage: [
      "This new album is amazing 😍",
      "Look at this puppy! 😍",
      "I'm so in love with you 😍",
    ],
  },
  {
    char: "🤔",
    name: "Thinking",
    description: "A face with a hand on its chin, looking upwards thoughtfully. Indicates pondering, deep thought, or skepticism.",
    usage: [
      "Hmm, I'm not sure about that 🤔",
      "Let me think about it for a moment.",
      "Is that really the best way to do it? 🤔",
    ],
  },
  { char: "😴", name: "Sleeping", description: "A face with 'Zzz's coming out of its mouth, indicating sleep. Can be used to show you're tired, going to bed, or bored.", usage: ["Long day, I'm heading to bed 😴", "This lecture is putting me to sleep.", "Wake me up when it's Friday 😴"] },
  { char: "😠", name: "Angry", description: "A red-tinted face with a frowning mouth and furrowed brows. Conveys anger, annoyance, or frustration.", usage: ["I can't believe you broke my favorite mug! 😠", "The traffic is terrible this morning.", "Why won't this code compile?! 😠"] },
  { char: "🤯", name: "Mind Blown", description: "An exploding head. Represents shock, amazement, or disbelief, as if one's mind has just been blown.", usage: ["I just found out how they filmed that scene 🤯", "That plot twist was incredible!", "You can do THAT with CSS? 🤯"] },
  { char: "🥳", name: "Partying", description: "A face with a party hat and noisemaker. Used for celebrating birthdays, achievements, or other happy occasions.", usage: ["Happy New Year! 🥳", "I got the job! Time to celebrate!", "Congratulations on your graduation! 🥳"] },
  { char: "🥺", name: "Pleading", description: "A face with large, glossy 'puppy-dog' eyes. Used to express adoration, or to beg or plead for something.", usage: ["Can we please get ice cream? 🥺", "You're the best, thank you so much!", "Look at this tiny kitten 🥺"] },
  { char: "😭", name: "Crying", description: "A face with streams of tears. Can represent intense sadness, but also overwhelming joy or laughter.", usage: ["I'm so sad the show is over 😭", "These are tears of joy, I'm so happy for you!", "I dropped my phone and the screen shattered 😭"] },
  { char: "😱", name: "Screaming", description: "A face screaming in fear, inspired by Edvard Munch's painting 'The Scream'. Conveys shock, horror, or fright.", usage: ["I just saw a huge spider! 😱", "I can't believe I forgot about the deadline!", "AHHH! You scared me! 😱"] },
  { char: "😎", name: "Cool", description: "A smiling face wearing sunglasses. Radiates confidence, coolness, or a carefree attitude. Can also mean 'deal with it'.", usage: ["Just finished my last final 😎", "Nailed the presentation.", "Leaving work on a Friday like 😎"] },
  { char: "😇", name: "Angel", description: "A smiling face with a halo. Represents innocence, goodness, or angelic behavior (often used ironically).", usage: ["I promise I didn't eat the last cookie 😇", "He's a perfect little angel when he's asleep.", "Of course I'll help you move!"] },
  { char: "🤠", name: "Cowboy", description: "A smiling face wearing a cowboy hat. Can convey a sense of adventure, fun, or a 'yee-haw' attitude.", usage: ["Ready for the road trip! 🤠", "Giddy up! Let's get this done.", "Just bought my first pair of cowboy boots."] },
  { char: "🤡", name: "Clown", description: "A classic circus clown face. Often used to describe foolish or silly behavior, or to indicate that someone is making a fool of themselves.", usage: ["I replied all to the entire company email 🤡", "Me thinking I could finish this project in one night.", "He really showed up in that outfit? 🤡"] },
  { char: "🤢", name: "Nauseated", description: "A green face with scrunched eyes and a sick-looking mouth. Represents nausea, disgust, or illness.", usage: ["I ate too much candy 🤢", "The smell in here is awful.", "Thinking about my to-do list makes me feel 🤢"] },
  { char: "🥶", name: "Freezing", description: "A blue face with icicles, chattering teeth. Represents feeling extremely cold.", usage: ["It's -10 degrees outside! 🥶", "I forgot my jacket and now I'm freezing.", "Turn up the heat, please! 🥶"] },
  { char: "🤫", name: "Shushing", description: "A face with a finger held to its lips. Asks for silence, or can indicate a secret.", usage: ["Don't tell anyone, it's a surprise! 🤫", "Be quiet, the movie is starting.", "I know something you don't know... 🤫"] },
];