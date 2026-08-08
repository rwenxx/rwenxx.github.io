const fs = require('fs');

function writeWav(filename, durationSec, getSample) {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * durationSec);
  const buffer = Buffer.alloc(44 + numSamples * 2);
  
  // WAV Header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);
  
  for (let i = 0; i < numSamples; i++) {
    let t = i / sampleRate;
    let val = getSample(t);
    // Envelope
    let env = 1.0;
    if (i < 441) env = i / 441.0;
    else if (i > numSamples - 441) env = (numSamples - i) / 441.0;
    
    let out = Math.floor(val * env * 32767);
    if (out > 32767) out = 32767;
    if (out < -32768) out = -32768;
    buffer.writeInt16LE(out, 44 + i * 2);
  }
  
  fs.writeFileSync(filename, buffer);
}

// Stamp: short thump (low freq dropping fast)
writeWav('public/audio/stamp-click.wav', 0.3, t => {
  let freq = Math.max(20, 200 - 1500 * t);
  let amp = Math.max(0, 1.0 - t * 5);
  return Math.sin(2 * Math.PI * freq * t) * amp;
});

// Paper: white noise with quick decay
writeWav('public/audio/paper-hover.wav', 0.4, t => {
  let amp = Math.max(0, 1.0 - t * 3);
  return (Math.random() - 0.5) * amp;
});

// Marker: rhythmic noise bursts
writeWav('public/audio/marker-hover.wav', 0.8, t => {
  let burst = Math.sin(2 * Math.PI * 10 * t) > 0;
  let amp = Math.max(0, 1.0 - t * 1.5);
  return (Math.random() - 0.5) * amp * (burst ? 1 : 0);
});

// Doom: low sinister hum
writeWav('public/audio/doom-hover.wav', 2.0, t => {
  let freq = 60 + Math.sin(2 * Math.PI * 5 * t) * 10;
  let amp = Math.min(1.0, t * 2) * Math.max(0, 1.0 - t / 3.0);
  return Math.sin(2 * Math.PI * freq * t) * 0.8 * amp;
});

console.log("WAV files generated!");
