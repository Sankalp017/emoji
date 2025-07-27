import { Howl } from 'howler';
import { useCallback } from 'react';

// NOTE: You will need to add these sound files to your `public/sounds` directory.
const SOUNDS = {
  correct: '/sounds/correct.mp3',
  wrong: '/sounds/wrong.mp3',
  start: '/sounds/start.mp3',
  gameOver: '/sounds/gameOver.mp3',
};

// Preload sounds for better performance
const soundPlayer = {
  correct: new Howl({ src: [SOUNDS.correct], volume: 0.4 }),
  wrong: new Howl({ src: [SOUNDS.wrong], volume: 0.4 }),
  start: new Howl({ src: [SOUNDS.start], volume: 0.5 }),
  gameOver: new Howl({ src: [SOUNDS.gameOver], volume: 0.5 }),
};

export function useSound() {
  const playCorrect = useCallback(() => {
    soundPlayer.correct.play();
  }, []);

  const playWrong = useCallback(() => {
    soundPlayer.wrong.play();
  }, []);
  
  const playStart = useCallback(() => {
    soundPlayer.start.play();
  }, []);

  const playGameOver = useCallback(() => {
    soundPlayer.gameOver.play();
  }, []);

  return { playCorrect, playWrong, playStart, playGameOver };
}