"use client";

import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

export interface CassetteData {
  id: string; 
  name: string; 
  audioSrc: string; 
  color: string;
  offset: { x: number; y: number; r: number };
}

export const CASSETTES: CassetteData[] = [
  { id: 'cas-1', name: 'На Заре — Баста', audioSrc: '/audio/track1.mp3', color: '#c0392b', offset: { x: -340, y: 160,  r: -14 } },
  { id: 'cas-2', name: 'Звезда по Имени Солнце — Кино',   audioSrc: '/audio/track2.mp3', color: '#1565c0', offset: { x:  330, y:  80,  r:  22 } },
  { id: 'cas-3', name: 'Aşk Eski Bir Yalan — Kamuran Akkor',   audioSrc: '/audio/track3.mp3', color: '#2e7d32', offset: { x: -310, y: -220, r:  -6 } },
];

interface AudioContextType {
  currentTrackId: string | null;
  isPlaying: boolean;
  currentTime: number;
  playTrack: (id: string) => void;
  stopAudio: () => void;
  togglePlayPause: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const GlobalAudioProvider = ({ children }: { children: React.ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Initialize audio object once
  useEffect(() => {
    const audio = new Audio();
    audio.addEventListener('ended', () => setIsPlaying(false));
    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const playTrack = (id: string) => {
    const track = CASSETTES.find(c => c.id === id);
    if (!track || !audioRef.current) return;
    
    // If playing the same track, just resume
    if (currentTrackId === id) {
      audioRef.current.play().catch(() => setIsPlaying(false));
      return;
    }

    // New track
    setCurrentTrackId(id);
    audioRef.current.src = track.audioSrc;
    audioRef.current.play().catch(() => setIsPlaying(false));
  };

  const stopAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setCurrentTrackId(null);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrackId) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  };

  return (
    <AudioContext.Provider value={{ currentTrackId, isPlaying, currentTime, playTrack, stopAudio, togglePlayPause }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within a GlobalAudioProvider");
  return ctx;
};
