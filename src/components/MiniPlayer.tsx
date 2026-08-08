"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAudio, CASSETTES } from '@/context/AudioContext';

export default function MiniPlayer() {
  const pathname = usePathname();
  const { currentTrackId, isPlaying, togglePlayPause, stopAudio } = useAudio();

  // Do not show the mini player on the main music page where the big Walkman is.
  // Also don't show it if no track is loaded.
  if (pathname === '/music' || !currentTrackId) {
    return null;
  }

  const activeMeta = CASSETTES.find(c => c.id === currentTrackId);
  if (!activeMeta) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 99999,
      backgroundColor: '#1a1a1a',
      borderRadius: '8px',
      border: '2px solid #000',
      boxShadow: '4px 4px 15px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.1)',
      display: 'flex',
      alignItems: 'center',
      padding: '10px 15px',
      gap: '15px',
      fontFamily: 'var(--font-inter)',
    }}>
      {/* Tape label indicator */}
      <div style={{
        backgroundColor: '#f2efe6',
        borderTop: `4px solid ${activeMeta.color}`,
        padding: '4px 8px',
        borderRadius: '2px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
      }}>
        <span style={{
          fontFamily: 'var(--font-marker)', 
          fontSize: '1.2rem', 
          color: '#111',
          whiteSpace: 'nowrap',
          display: 'inline-block',
          maxWidth: '150px',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {activeMeta.name}
        </span>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          onClick={togglePlayPause}
          style={{
            background: 'linear-gradient(to bottom, #444, #222)',
            border: '1px solid #000',
            color: '#fff',
            borderRadius: '4px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
            fontSize: '0.8rem'
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button 
          onClick={stopAudio}
          style={{
            background: 'linear-gradient(to bottom, #444, #222)',
            border: '1px solid #000',
            color: '#fff',
            borderRadius: '4px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
            fontSize: '0.8rem'
          }}
        >
          ⏹
        </button>
      </div>

      {/* LED */}
      <div style={{
        width: '8px', 
        height: '8px', 
        borderRadius: '50%',
        backgroundColor: isPlaying ? '#ff3b30' : '#333',
        boxShadow: isPlaying ? '0 0 5px #ff3b30' : 'inset 1px 1px 2px rgba(0,0,0,0.8)',
        border: '1px solid #000'
      }} />
    </div>
  );
}
