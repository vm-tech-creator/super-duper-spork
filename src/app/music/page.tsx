'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Music() {
  const router = useRouter();
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [activeGenre, setActiveGenre] = useState('Pop');
  const [activeAgeLevel, setActiveAgeLevel] = useState('All Ages');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [showPlaylistShare, setShowPlaylistShare] = useState(false);
  const [showMusicMaker, setShowMusicMaker] = useState(false);
  const [showAlbumBuilder, setShowAlbumBuilder] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [playlistName, setPlaylistName] = useState('My Playlist');
  const [emailTo, setEmailTo] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<any>(null);
  const synthTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Organized tracks by genre with lyrics
  const tracksByGenre: { [key: string]: any[] } = {
    Pop: [
      { id: 1, title: 'Upbeat Vibes', artist: 'Luna Sky', duration: '3:45', lyrics: 'Dancing through the night\nFeel the rhythm, feel the light\nMove your body to the beat\nMake this moment so complete\nUpbeat vibes, here we go\nLet your spirit start to glow' },
      { id: 2, title: 'Dance Tonight', artist: 'Pop Stars', duration: '4:12', lyrics: 'Tonight we dance, tonight we shine\nYour hand in mine, everything\'s fine\nThe music plays, we sway and spin\nLet the magic close you in\nDance tonight, dance so free\nYou and me, wild and carefree' },
      { id: 3, title: 'Sunny Days', artist: 'Bright Mood', duration: '3:28', lyrics: 'Sunny days, here they come\nWalking to the beat of a drum\nGolden rays on my face\nFound my happy, found my place\nSunny days, never fade\nIn this moment, unafraid' },
    ],
    Rock: [
      { id: 4, title: 'Guitar Thunder', artist: 'Rock Masters', duration: '5:03', lyrics: 'Turn it up, feel the sound\nChords are shaking all around\nGuitar thunder in the air\nRocking out without a care\nLoud and proud, here we stand\nFeeling power, hand in hand' },
      { id: 5, title: 'Desert Winds', artist: 'Sand Dunes', duration: '4:12', lyrics: 'Desert winds are calling me\nOut beneath the open sea\nRock and roll is life\nThrough the day and through the night\nDesert winds blow strong and true\nBuilding something wild and new' },
      { id: 6, title: 'Electric Dream', artist: 'Neon Rocks', duration: '4:56', lyrics: 'Living in an electric dream\nNothing\'s ever what it seems\nFlashing lights and power chords\nTelling stories, spreading words\nElectric dreams come alive\nWhere the wild things thrive' },
    ],
    Classical: [
      { id: 7, title: 'Symphony No. 5', artist: 'Orchestra', duration: '6:15', lyrics: 'Powerful notes fill the air\nComposed with elegant care\nStrings and brass in harmony\nA timeless symphony\nSymphony No. 5 plays on\nThroughout the night, until the dawn' },
      { id: 8, title: 'Piano Sonata', artist: 'Classical Vibes', duration: '5:30', lyrics: 'Keys dancing on the grand\nGuided by a master\'s hand\nBeautiful melodies flow\nIn a sonata\'s gentle glow\nPiano plays a story true\nA classical rendezvous' },
      { id: 9, title: 'Violin Concerto', artist: 'String Ensemble', duration: '7:20', lyrics: 'Violin strings sing so sweet\nMaking hearts and souls complete\nConcerto in D major key\nPlaying perfectly and free\nViolin concerto high\nReaches to the starlit sky' },
    ],
    Jazz: [
      { id: 10, title: 'Blue Moon Jazz', artist: 'Jazz Legends', duration: '5:45', lyrics: 'Blue moon rising, saxophone cries\nJazz is playing, touching the skies\nImprovisations, smooth and slow\nLet the blue moon guide the flow\nBlue moon jazz, a timeless sound\nWhere beauty\'s always found' },
      { id: 11, title: 'Smooth Saxophone', artist: 'Jazz Nights', duration: '4:30', lyrics: 'Smooth saxophone playing late\nCreating something truly great\nNotes are floating through the air\nSoftness, soulfulness, and flair\nSmooth saxophone, you\'re my song\nKeeping me where I belong' },
      { id: 12, title: 'Midnight Improvisation', artist: 'Jazz Trio', duration: '6:00', lyrics: 'At midnight when the world sleeps\nJazz improvisations deep\nTrio playing, feeling free\nWhat the music\'s meant to be\nMidnight improvisation flows\nAs the gentle evening glows' },
    ],
    Electronic: [
      { id: 13, title: 'Digital Dreams', artist: 'Neon Vibes', duration: '3:28', lyrics: 'Digital dreams in electric light\nSynthesizers burning bright\nBeat drops down, mind takes flight\nTechnology feels so right\nDigital dreams, pixels blend\nWhere reality transcends' },
      { id: 14, title: 'Synthetic Wave', artist: 'Electronic Soul', duration: '4:15', lyrics: 'Synthetic waves upon the shore\nElectronic beats and more\nWave after wave, the sound so pure\nA future we can all endure\nSynthetic waves that make us feel\nWhat electronic soul reveals' },
      { id: 15, title: 'Cyber Pulse', artist: 'Digital Masters', duration: '3:50', lyrics: 'Cyber pulse is beating fast\nFuture building, coming past\nDigital and so alive\nIn this electronic hive\nCyber pulse, don\'t let it fade\nTechnological escapade' },
    ],
    Hip_Hop: [
      { id: 16, title: 'Urban Beats', artist: 'Hip Hop Kings', duration: '3:55', lyrics: 'Urban beats, city sounds\nRhymes and rhythm all around\nMicrophone in my hand\nSpitting bars across the land\nUrban beats keep going strong\nThis is where I belong' },
      { id: 17, title: 'Rhythm Flow', artist: 'Rap Masters', duration: '4:10', lyrics: 'Rhythm flowing, never stops\nDropping bars like beats and pops\nFlow is smooth, flow is tight\nRhymes come perfect every night\nRhythm flow, take control\nPouring passion from my soul' },
      { id: 18, title: 'Street Vibes', artist: 'Urban Legends', duration: '3:40', lyrics: 'Street vibes, that\'s my life\nThrough the joy and through the strife\nUrban story, urban song\nThis is where I all along\nStreet vibes echo in the night\nEverything feels so right' },
    ],
  };

  // Organized tracks by age level
  const tracksByAge: { [key: string]: any[] } = {
    Kids: [
      { id: 19, title: 'Rainbow Song', artist: 'Kidz Fun', duration: '2:30' },
      { id: 20, title: 'Happy Playground', artist: 'Children Music', duration: '2:45' },
      { id: 21, title: 'Magical Adventure', artist: 'Kids Band', duration: '3:00' },
    ],
    Teens: [
      { id: 22, title: 'Growing Up', artist: 'Teen Vibes', duration: '3:45' },
      { id: 23, title: 'High School Dreams', artist: 'Youth Music', duration: '4:00' },
      { id: 24, title: 'Cool Summer', artist: 'Teen Legends', duration: '3:50' },
    ],
    Adults: [
      { id: 25, title: 'Life Journey', artist: 'Adult Sounds', duration: '4:30' },
      { id: 26, title: 'Evening Jazz', artist: 'Smooth Sounds', duration: '5:00' },
      { id: 27, title: 'Sophisticated Soul', artist: 'Elite Music', duration: '4:45' },
    ],
    'All Ages': [
      { id: 1, title: 'Upbeat Vibes', artist: 'Luna Sky', duration: '3:45' },
      { id: 4, title: 'Guitar Thunder', artist: 'Rock Masters', duration: '5:03' },
      { id: 7, title: 'Symphony No. 5', artist: 'Orchestra', duration: '6:15' },
      { id: 10, title: 'Blue Moon Jazz', artist: 'Jazz Legends', duration: '5:45' },
    ],
  };

  // Other categories
  const moods = ['Energetic', 'Relaxing', 'Romantic', 'Motivating'];
  const eras = ['80s', '90s', '2000s', '2010s', '2020s'];

  const allTracks = Object.values(tracksByGenre).flat();

  const handlePlayPause = () => {
    const currentTrackObj = allTracks[currentTrack];
    
    // Check if this is a demo track (not an uploaded file)
    const isDemoTrack = currentTrack < allTracks.length;
    
    if (isDemoTrack) {
      if (!isPlaying) {
        try {
          generateSynthesizedTrack(currentTrackObj);
          setIsPlaying(true);
          // Auto-stop after 180 seconds (3 minutes)
          synthTimeoutRef.current = setTimeout(() => setIsPlaying(false), 180000);
        } catch (err) {
          console.warn('Synthesis failed:', err);
          alert('Audio synthesis failed. Please try again.');
        }
      } else {
        // Stop the audio context to pause the synthesized song
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
        // Clear the auto-stop timeout
        if (synthTimeoutRef.current) {
          clearTimeout(synthTimeoutRef.current);
          synthTimeoutRef.current = null;
        }
        setIsPlaying(false);
      }
      return;
    }
    
    // Handle uploaded files
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => {
          console.warn('Playback failed:', err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    // Note: To sync volume with synth oscillators, a master gain node 
    // would be required in the synthesis logic.
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          setUploadedFiles(prev => [...prev, url]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const playTrackFromList = (index: number) => {
    setCurrentTrack(index);
    // Only auto-play if it's an uploaded file
    if (index >= allTracks.length) {
      setIsPlaying(true);
    } else {
      // For demo tracks, just show selection
      setIsPlaying(false);
    }
  };

  const formatTime = (time: number) => {
    if (!time) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Generate synthesized song based on track
  const generateSynthesizedTrack = (track: any) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;
    
    // Resume audio context if suspended (for browser autoplay policies)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    const now = audioContext.currentTime;
    const songDuration = 180; // 3 minutes

    const trackId = track.id;
    
    // Generate different music based on track ID
    if (trackId === 1) {
      // Upbeat Vibes - Pop (original)
      generatePopUpbeat(audioContext, now, songDuration);
    } else if (trackId === 2) {
      // Dance Tonight - Pop
      generateDancePop(audioContext, now, songDuration);
    } else if (trackId === 3) {
      // Sunny Days - Pop
      generateSunnyPop(audioContext, now, songDuration);
    } else if (trackId === 4) {
      // Guitar Thunder - Rock
      generateRockGuitar(audioContext, now, songDuration);
    } else if (trackId === 5) {
      // Desert Winds - Rock
      generateRockDesert(audioContext, now, songDuration);
    } else if (trackId === 6) {
      // Electric Dream - Rock
      generateRockElectric(audioContext, now, songDuration);
    } else if (trackId === 7) {
      // Symphony No. 5 - Classical
      generateSymphony(audioContext, now, songDuration);
    } else if (trackId === 8) {
      // Piano Sonata - Classical
      generatePiano(audioContext, now, songDuration);
    } else if (trackId === 9) {
      // Violin Concerto - Classical
      generateViolin(audioContext, now, songDuration);
    } else if (trackId === 10) {
      // Blue Moon Jazz - Jazz
      generateJazzBlue(audioContext, now, songDuration);
    } else if (trackId === 11) {
      // Smooth Saxophone - Jazz
      generateJazzSax(audioContext, now, songDuration);
    } else if (trackId === 12) {
      // Midnight Improvisation - Jazz
      generateJazzMidnight(audioContext, now, songDuration);
    } else if (trackId === 13) {
      // Digital Dreams - Electronic
      generateElectronicDreams(audioContext, now, songDuration);
    } else if (trackId === 14) {
      // Synthetic Wave - Electronic
      generateElectronicWave(audioContext, now, songDuration);
    } else if (trackId === 15) {
      // Cyber Pulse - Electronic
      generateElectronicPulse(audioContext, now, songDuration);
    } else if (trackId === 16) {
      // Urban Beats - Hip-Hop
      generateHipHopUrban(audioContext, now, songDuration);
    } else if (trackId === 17) {
      // Rhythm Flow - Hip-Hop
      generateHipHopFlow(audioContext, now, songDuration);
    } else if (trackId === 18) {
      // Street Vibes - Hip-Hop
      generateHipHopStreet(audioContext, now, songDuration);
    }
  };

  // Pop Genre Generators
  const generatePopUpbeat = (audioContext: any, now: number, songDuration: number) => {
    // Upbeat Vibes - Modern pop with layered synths, contemporary beats, and professional production
    const reverbDelay = audioContext.createDelay(0.5);
    reverbDelay.delayTime.value = 0.1;
    
    // Main bright lead synth
    const lead = audioContext.createOscillator();
    const leadGain = audioContext.createGain();
    lead.type = 'sine';
    lead.connect(leadGain);
    leadGain.connect(reverbDelay);
    reverbDelay.connect(audioContext.destination);
    leadGain.gain.setValueAtTime(0.2, now);
    
    // Warm pad underneath
    const pad = audioContext.createOscillator();
    const padGain = audioContext.createGain();
    pad.type = 'sine';
    pad.connect(padGain);
    padGain.connect(audioContext.destination);
    pad.frequency.setValueAtTime(220, now);
    padGain.gain.setValueAtTime(0.08, now);
    
    // Modern pop progression with movement
    const popMelody = [392.00, 440.00, 494.00, 523.25, 494.00, 440.00, 392.00, 330.00];
    for (let i = 0; i < 22; i++) {
      for (let j = 0; j < popMelody.length; j++) {
        lead.frequency.setTargetAtTime(popMelody[j], now + i * 2.8 + j * 0.32, 0.05);
      }
    }
    
    // Professional bass line with more movement
    const bass = audioContext.createOscillator();
    const bassGain = audioContext.createGain();
    bass.type = 'sine';
    bass.connect(bassGain);
    bassGain.connect(audioContext.destination);
    bassGain.gain.setValueAtTime(0.2, now);
    
    const bassLine = [65.41, 65.41, 73.42, 82.41, 73.42, 65.41];
    for (let i = 0; i < 30; i++) {
      for (let j = 0; j < bassLine.length; j++) {
        bass.frequency.setTargetAtTime(bassLine[j], now + i * 2.16 + j * 0.36, 0.01);
      }
    }
    
    // Professional drum kit - kick pattern
    for (let i = 0; i < songDuration; i += 0.5) {
      const kick = audioContext.createOscillator();
      const kickGain = audioContext.createGain();
      kick.connect(kickGain);
      kickGain.connect(audioContext.destination);
      kick.frequency.setValueAtTime(120, now + i);
      kick.frequency.exponentialRampToValueAtTime(50, now + i + 0.08);
      kick.frequency.exponentialRampToValueAtTime(0.01, now + i + 0.15);
      kickGain.gain.setValueAtTime(0.7, now + i);
      kickGain.gain.exponentialRampToValueAtTime(0.01, now + i + 0.15);
      kick.start(now + i);
      kick.stop(now + i + 0.15);
    }
    
    // Snare on 2 and 4
    for (let i = 0; i < songDuration; i += 1) {
      if (Math.floor((i * 2)) % 2 === 1) {
        const snare = audioContext.createOscillator();
        const snareGain = audioContext.createGain();
        snare.type = 'square';
        snare.connect(snareGain);
        snareGain.connect(audioContext.destination);
        snare.frequency.setValueAtTime(250, now + i);
        snare.frequency.exponentialRampToValueAtTime(100, now + i + 0.05);
        snareGain.gain.setValueAtTime(0.25, now + i);
        snareGain.gain.exponentialRampToValueAtTime(0.01, now + i + 0.08);
        snare.start(now + i);
        snare.stop(now + i + 0.08);
      }
    }
    
    // Hi-hats for groove
    for (let i = 0; i < songDuration; i += 0.25) {
      if (Math.random() > 0.3) {
        const hat = audioContext.createBufferSource();
        const hatGain = audioContext.createGain();
        hatGain.connect(audioContext.destination);
        hatGain.gain.setValueAtTime(0.12, now + i);
        hatGain.gain.exponentialRampToValueAtTime(0.001, now + i + 0.1);
        
        const bufferSize = audioContext.sampleRate * 0.1;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let k = 0; k < bufferSize; k++) {
          data[k] = (Math.random() * 2 - 1) * (1 - k / bufferSize);
        }
        hat.buffer = buffer;
        hat.connect(hatGain);
        hat.start(now + i);
      }
    }
    
    lead.start(now);
    lead.stop(now + songDuration);
    pad.start(now);
    pad.stop(now + songDuration);
    bass.start(now);
    bass.stop(now + songDuration);
  };

  const generateDancePop = (audioContext: any, now: number, songDuration: number) => {
    // Dance Tonight - Modern EDM-influenced pop with dynamic filters and tight production
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2500, now);
    filter.Q.setValueAtTime(3, now);
    
    // Main synth with movement
    const synth = audioContext.createOscillator();
    const synthGain = audioContext.createGain();
    synth.type = 'sawtooth';
    synth.connect(filter);
    filter.connect(synthGain);
    synthGain.connect(audioContext.destination);
    synthGain.gain.setValueAtTime(0.24, now);
    
    // Sub-bass layer
    const subBass = audioContext.createOscillator();
    const subGain = audioContext.createGain();
    subBass.type = 'sine';
    subBass.connect(subGain);
    subGain.connect(audioContext.destination);
    subGain.gain.setValueAtTime(0.22, now);
    subBass.frequency.setValueAtTime(65, now);
    
    // Modern dance progression
    const danceRiff = [880.00, 784.00, 659.25, 587.33, 659.25, 784.00];
    for (let i = 0; i < 30; i++) {
      for (let j = 0; j < danceRiff.length; j++) {
        synth.frequency.setTargetAtTime(danceRiff[j], now + i * 1.92 + j * 0.32, 0.02);
      }
      // Dynamic filter movement for modern feel
      filter.frequency.exponentialRampToValueAtTime(3500, now + i * 1.92 + 0.96);
      filter.frequency.exponentialRampToValueAtTime(1500, now + i * 1.92 + 1.92);
    }
    
    // Professional 4-on-the-floor kick
    for (let i = 0; i < songDuration; i += 0.5) {
      const kick = audioContext.createOscillator();
      const kickGain = audioContext.createGain();
      kick.connect(kickGain);
      kickGain.connect(audioContext.destination);
      kick.frequency.setValueAtTime(150, now + i);
      kick.frequency.exponentialRampToValueAtTime(40, now + i + 0.1);
      kick.frequency.exponentialRampToValueAtTime(0.01, now + i + 0.2);
      kickGain.gain.setValueAtTime(0.75, now + i);
      kickGain.gain.exponentialRampToValueAtTime(0.01, now + i + 0.2);
      kick.start(now + i);
      kick.stop(now + i + 0.2);
    }
    
    // Tight snare
    for (let i = 0; i < songDuration; i += 1) {
      if (Math.floor(i * 2) % 2 === 1) {
        const snare = audioContext.createOscillator();
        const snareGain = audioContext.createGain();
        snare.type = 'triangle';
        snare.connect(snareGain);
        snareGain.connect(audioContext.destination);
        snare.frequency.setValueAtTime(300, now + i);
        snare.frequency.exponentialRampToValueAtTime(80, now + i + 0.04);
        snareGain.gain.setValueAtTime(0.28, now + i);
        snareGain.gain.exponentialRampToValueAtTime(0.01, now + i + 0.06);
        snare.start(now + i);
        snare.stop(now + i + 0.06);
      }
    }
    
    // Fast dance hi-hat groove
    for (let i = 0; i < songDuration; i += 0.125) {
      const hat = audioContext.createBufferSource();
      const hatGain = audioContext.createGain();
      hatGain.connect(audioContext.destination);
      hatGain.gain.setValueAtTime(0.15, now + i);
      hatGain.gain.exponentialRampToValueAtTime(0.001, now + i + 0.08);
      
      const bufferSize = audioContext.sampleRate * 0.08;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      for (let k = 0; k < bufferSize; k++) {
        data[k] = (Math.random() * 2 - 1) * (1 - k / bufferSize);
      }
      hat.buffer = buffer;
      hat.connect(hatGain);
      hat.start(now + i);
    }
    
    synth.start(now);
    synth.stop(now + songDuration);
    subBass.start(now);
    subBass.stop(now + songDuration);
  };

  const generateSunnyPop = (audioContext: any, now: number, songDuration: number) => {
    // Sunny Days - Uplifting modern pop with warm synths and positive energy
    const reverbDelay = audioContext.createDelay(0.3);
    reverbDelay.delayTime.value = 0.12;
    const delayGain = audioContext.createGain();
    delayGain.gain.value = 0.2;
    
    // Warm pad layer
    const pad = audioContext.createOscillator();
    const padGain = audioContext.createGain();
    pad.type = 'sine';
    pad.connect(padGain);
    padGain.connect(audioContext.destination);
    padGain.gain.setValueAtTime(0.12, now);
    pad.frequency.setValueAtTime(220, now);
    
    // Bright lead melody
    const lead = audioContext.createOscillator();
    const leadGain = audioContext.createGain();
    lead.type = 'sine';
    lead.connect(leadGain);
    leadGain.connect(reverbDelay);
    reverbDelay.connect(delayGain);
    delayGain.connect(audioContext.destination);
    leadGain.gain.setValueAtTime(0.18, now);
    
    const sunnyMelody = [330, 392, 440, 494, 523, 494, 440, 392];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < sunnyMelody.length; j++) {
        lead.frequency.setTargetAtTime(sunnyMelody[j], now + i * 2.56 + j * 0.32, 0.08);
      }
    }
    
    // Uplifting bass
    const bass = audioContext.createOscillator();
    const bassGain = audioContext.createGain();
    bass.type = 'sine';
    bass.connect(bassGain);
    bassGain.connect(audioContext.destination);
    bassGain.gain.setValueAtTime(0.18, now);
    bass.frequency.setValueAtTime(110, now);
    
    // Soft kick pattern
    for (let i = 0; i < songDuration; i += 0.64) {
      const kick = audioContext.createOscillator();
      const kickGain = audioContext.createGain();
      kick.connect(kickGain);
      kickGain.connect(audioContext.destination);
      kick.frequency.setValueAtTime(100, now + i);
      kick.frequency.exponentialRampToValueAtTime(40, now + i + 0.12);
      kickGain.gain.setValueAtTime(0.55, now + i);
      kickGain.gain.exponentialRampToValueAtTime(0.01, now + i + 0.12);
      kick.start(now + i);
      kick.stop(now + i + 0.12);
    }
    
    // Shaker/percussion for brightness
    for (let i = 0; i < songDuration; i += 0.32) {
      const shaker = audioContext.createBufferSource();
      const shakerGain = audioContext.createGain();
      shakerGain.connect(audioContext.destination);
      shakerGain.gain.setValueAtTime(0.1, now + i);
      shakerGain.gain.exponentialRampToValueAtTime(0.001, now + i + 0.15);
      
      const bufferSize = audioContext.sampleRate * 0.15;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      for (let k = 0; k < bufferSize; k++) {
        data[k] = (Math.random() * 2 - 1) * 0.6 * (1 - k / bufferSize);
      }
      shaker.buffer = buffer;
      shaker.connect(shakerGain);
      shaker.start(now + i);
    }
    
    // Chime bells for warmth
    for (let i = 0; i < songDuration; i += 2.56) {
      const bell = audioContext.createOscillator();
      const bellGain = audioContext.createGain();
      bell.type = 'sine';
      bell.connect(bellGain);
      bellGain.connect(audioContext.destination);
      bell.frequency.setValueAtTime(528, now + i);
      bellGain.gain.setValueAtTime(0.12, now + i);
      bellGain.gain.exponentialRampToValueAtTime(0.01, now + i + 1.6);
      bell.start(now + i);
      bell.stop(now + i + 1.6);
    }
    
    pad.start(now);
    pad.stop(now + songDuration);
    lead.start(now);
    lead.stop(now + songDuration);
    bass.start(now);
    bass.stop(now + songDuration);
  };
    
  // Rock Genre Generators
  const generateRockGuitar = (audioContext: any, now: number, songDuration: number) => {
    // Guitar Thunder - Modern rock with heavy riffs, distortion feel, and tight drums
    const filter = audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(180, now);
    filter.Q.setValueAtTime(2, now);
    
    // Overdriven synth simulating distorted guitar
    const riff = audioContext.createOscillator();
    const riffGain = audioContext.createGain();
    riff.type = 'sawtooth';
    riff.connect(filter);
    filter.connect(riffGain);
    riffGain.connect(audioContext.destination);
    riffGain.gain.setValueAtTime(0.32, now);
    
    // Power chord progression
    const chords = [82.41, 110.00, 123.47, 82.41, 110.00, 164.81];
    for (let i = 0; i < 28; i++) {
      for (let j = 0; j < chords.length; j++) {
        riff.frequency.setTargetAtTime(chords[j], now + i * 2.4 + j * 0.36, 0.05);
      }
    }
    
    // Heavy bass foundation
    const bass = audioContext.createOscillator();
    const bassGain = audioContext.createGain();
    bass.type = 'sine';
    bass.connect(bassGain);
    bassGain.connect(audioContext.destination);
    bassGain.gain.setValueAtTime(0.26, now);
    bass.frequency.setValueAtTime(55, now);
    
    // Tight drum kick pattern - classic rock
    for (let i = 0; i < songDuration; i += 0.6) {
      const kick = audioContext.createOscillator();
      const kickGain = audioContext.createGain();
      kick.connect(kickGain);
      kickGain.connect(audioContext.destination);
      kick.frequency.setValueAtTime(100, now + i);
      kick.frequency.exponentialRampToValueAtTime(35, now + i + 0.12);
      kick.frequency.exponentialRampToValueAtTime(0.01, now + i + 0.25);
      kickGain.gain.setValueAtTime(0.7, now + i);
      kickGain.gain.exponentialRampToValueAtTime(0.01, now + i + 0.25);
      kick.start(now + i);
      kick.stop(now + i + 0.25);
    }
    
    // Snare - classic rock backbeat
    for (let i = 0; i < songDuration; i += 1.2) {
      const snare = audioContext.createOscillator();
      const snareGain = audioContext.createGain();
      snare.type = 'square';
      snare.connect(snareGain);
      snareGain.connect(audioContext.destination);
      snare.frequency.setValueAtTime(280, now + i + 0.6);
      snare.frequency.exponentialRampToValueAtTime(70, now + i + 0.68);
      snareGain.gain.setValueAtTime(0.32, now + i + 0.6);
      snareGain.gain.exponentialRampToValueAtTime(0.01, now + i + 0.68);
      snare.start(now + i + 0.6);
      snare.stop(now + i + 0.68);
    }
    
    // Tom fill patterns
    for (let i = 0; i < songDuration; i += 2.4) {
      if (i > 0.6) {
        for (let j = 0; j < 2; j++) {
          const tom = audioContext.createOscillator();
          const tomGain = audioContext.createGain();
          tom.connect(tomGain);
          tomGain.connect(audioContext.destination);
          tom.frequency.setValueAtTime(200 - j * 40, now + i + 1.8 + j * 0.15);
          tom.frequency.exponentialRampToValueAtTime(80 - j * 20, now + i + 1.95 + j * 0.15);
          tomGain.gain.setValueAtTime(0.25, now + i + 1.8 + j * 0.15);
          tomGain.gain.exponentialRampToValueAtTime(0.01, now + i + 1.95 + j * 0.15);
          tom.start(now + i + 1.8 + j * 0.15);
          tom.stop(now + i + 1.95 + j * 0.15);
        }
      }
    }
    
    riff.start(now);
    riff.stop(now + songDuration);
    bass.start(now);
    bass.stop(now + songDuration);
  };

  const generateRockDesert = (audioContext: any, now: number, songDuration: number) => {
    // Desert Winds - Rock ballad with sustain, delays, and atmospheric elements
    const reverbDelay = audioContext.createDelay(1.2);
    reverbDelay.delayTime.value = 0.5;
    const delayGain = audioContext.createGain();
    delayGain.gain.value = 0.3;
    
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3000, now);
    
    // Sustained lead
    const lead = audioContext.createOscillator();
    const leadGain = audioContext.createGain();
    lead.type = 'sine';
    lead.connect(filter);
    filter.connect(leadGain);
    leadGain.connect(reverbDelay);
    reverbDelay.connect(delayGain);
    delayGain.connect(audioContext.destination);
    leadGain.gain.setValueAtTime(0.22, now);
    
    // Slow blues rock melody
    const bluesRock = [110.00, 138.59, 164.81, 196.00, 220.00, 196.00, 164.81, 138.59];
    for (let i = 0; i < 18; i++) {
      for (let j = 0; j < bluesRock.length; j++) {
        lead.frequency.setTargetAtTime(bluesRock[j], now + i * 4.0 + j * 0.5, 0.15);
      }
    }
    
    // Sustained bass
    const bass = audioContext.createOscillator();
    const bassGain = audioContext.createGain();
    bass.type = 'sine';
    bass.connect(bassGain);
    bassGain.connect(audioContext.destination);
    bassGain.gain.setValueAtTime(0.2, now);
    bass.frequency.setValueAtTime(55, now);
    
    // Slower, looser kick pattern for ballad feel
    for (let i = 0; i < songDuration; i += 1.2) {
      const kick = audioContext.createOscillator();
      const kickGain = audioContext.createGain();
      kick.connect(kickGain);
      kickGain.connect(audioContext.destination);
      kick.frequency.setValueAtTime(70, now + i);
      kick.frequency.exponentialRampToValueAtTime(25, now + i + 0.3);
      kickGain.gain.setValueAtTime(0.5, now + i);
      kickGain.gain.exponentialRampToValueAtTime(0.01, now + i + 0.3);
      kick.start(now + i);
      kick.stop(now + i + 0.3);
    }
    
    // Sparse snare
    for (let i = 0; i < songDuration; i += 2.4) {
      const snare = audioContext.createOscillator();
      const snareGain = audioContext.createGain();
      snare.type = 'triangle';
      snare.connect(snareGain);
      snareGain.connect(audioContext.destination);
      snare.frequency.setValueAtTime(250, now + i + 1.2);
      snare.frequency.exponentialRampToValueAtTime(80, now + i + 1.35);
      snareGain.gain.setValueAtTime(0.2, now + i + 1.2);
      snareGain.gain.exponentialRampToValueAtTime(0.01, now + i + 1.35);
      snare.start(now + i + 1.2);
      snare.stop(now + i + 1.35);
    }
    
    lead.start(now);
    lead.stop(now + songDuration);
    bass.start(now);
    bass.stop(now + songDuration);
  };

  const generateRockElectric = (audioContext: any, now: number, songDuration: number) => {
    // Electric Dream - Modern rock with synth-rock fusion and modern production
    const filter = audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(250, now);
    filter.Q.setValueAtTime(2.5, now);
    
    // Main synth-rock lead
    const lead = audioContext.createOscillator();
    const leadGain = audioContext.createGain();
    lead.type = 'square';
    lead.connect(filter);
    filter.connect(leadGain);
    leadGain.connect(audioContext.destination);
    leadGain.gain.setValueAtTime(0.3, now);
    
    // Deep tremolo modulation
    const tremolo = audioContext.createOscillator();
    tremolo.frequency.setValueAtTime(6.5, now);
    const tremoloGain = audioContext.createGain();
    tremoloGain.gain.setValueAtTime(0.22, now);
    tremolo.connect(tremoloGain);
    tremoloGain.connect(leadGain.gain);
    
    // Modern rock progression
    const syncRiff = [220.00, 275.00, 330.00, 440.00, 550.00, 659.25, 550.00, 440.00];
    for (let i = 0; i < 30; i++) {
      for (let j = 0; j < syncRiff.length; j++) {
        lead.frequency.setTargetAtTime(syncRiff[j], now + i * 2.0 + j * 0.25, 0.04);
      }
      filter.frequency.exponentialRampToValueAtTime(900, now + i * 2.0 + 1.0);
      filter.frequency.exponentialRampToValueAtTime(250, now + i * 2.0 + 2.0);
    }
    
    // Rock rhythm bass
    const bass = audioContext.createOscillator();
    const bassGain = audioContext.createGain();
    bass.type = 'sine';
    bass.connect(bassGain);
    bassGain.connect(audioContext.destination);
    bassGain.gain.setValueAtTime(0.24, now);
    bass.frequency.setValueAtTime(110, now);
    
    // Rock kick pattern
    for (let i = 0; i < songDuration; i += 0.5) {
      const kick = audioContext.createOscillator();
      const kickGain = audioContext.createGain();
      kick.connect(kickGain);
      kickGain.connect(audioContext.destination);
      kick.frequency.setValueAtTime(120, now + i);
      kick.frequency.exponentialRampToValueAtTime(30, now + i + 0.15);
      kickGain.gain.setValueAtTime(0.65, now + i);
      kickGain.gain.exponentialRampToValueAtTime(0.01, now + i + 0.15);
      kick.start(now + i);
      kick.stop(now + i + 0.15);
    }
    
    // Snare backbeat
    for (let i = 0; i < songDuration; i += 1) {
      if (Math.floor(i * 2) % 2 === 1) {
        const snare = audioContext.createOscillator();
        const snareGain = audioContext.createGain();
        snare.type = 'square';
        snare.connect(snareGain);
        snareGain.connect(audioContext.destination);
        snare.frequency.setValueAtTime(300, now + i);
        snare.frequency.exponentialRampToValueAtTime(80, now + i + 0.08);
        snareGain.gain.setValueAtTime(0.3, now + i);
        snareGain.gain.exponentialRampToValueAtTime(0.01, now + i + 0.08);
        snare.start(now + i);
        snare.stop(now + i + 0.08);
      }
    }
    
    lead.start(now);
    lead.stop(now + songDuration);
    tremolo.start(now);
    tremolo.stop(now + songDuration);
    bass.start(now);
    bass.stop(now + songDuration);
  };

  // Classical Genre Generators
  const generateSymphony = (audioContext: any, now: number, songDuration: number) => {
    // Symphony No. 5 - Orchestral arrangement with strings, brass, and dramatic dynamics
    const strings = [];
    for (let i = 0; i < 5; i++) {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(audioContext.destination);
      gain.gain.setValueAtTime(0.08, now);
      strings.push({ osc, gain });
    }
    
    // Iconic Symphony No. 5 fate motif
    const symphony = [392, 392, 392, 329.63, 349.23, 392];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < symphony.length; j++) {
        const noteStart = now + i * 3.6 + j * 0.55;
        // Orchestral octaves and harmonics
        strings[0].osc.frequency.setTargetAtTime(symphony[j], noteStart, 0.05);
        strings[1].osc.frequency.setTargetAtTime(symphony[j] * 1.25, noteStart, 0.05);
        strings[2].osc.frequency.setTargetAtTime(symphony[j] * 0.5, noteStart, 0.05);
        strings[3].osc.frequency.setTargetAtTime(symphony[j] * 2, noteStart, 0.05);
        strings[4].osc.frequency.setTargetAtTime(symphony[j] * 1.5, noteStart, 0.05);
      }
    }
    
    // Timpani - dramatic low drums
    for (let i = 0; i < songDuration; i += 1.8) {
      const timpani = audioContext.createOscillator();
      const timpaniGain = audioContext.createGain();
      timpani.connect(timpaniGain);
      timpaniGain.connect(audioContext.destination);
      timpani.frequency.setValueAtTime(150, now + i);
      timpani.frequency.exponentialRampToValueAtTime(60, now + i + 0.3);
      timpaniGain.gain.setValueAtTime(0.35, now + i);
      timpaniGain.gain.exponentialRampToValueAtTime(0.01, now + i + 0.3);
      timpani.start(now + i);
      timpani.stop(now + i + 0.3);
    }
    
    strings.forEach(({ osc }) => {
      osc.start(now);
      osc.stop(now + songDuration);
    });
  };

  const generatePiano = (audioContext: any, now: number, songDuration: number) => {
    // Piano Sonata - Realistic piano with sustain pedal effect and natural decay
    const reverbDelay = audioContext.createDelay(0.6);
    reverbDelay.delayTime.value = 0.35;
    const delayGain = audioContext.createGain();
    delayGain.gain.value = 0.25;
    
    const pianoArp = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63];
    
    for (let i = 0; i < 26; i++) {
      for (let j = 0; j < pianoArp.length; j++) {
        const noteTime = now + i * 2.88 + j * 0.38;
        const piano = audioContext.createOscillator();
        const pianoGain = audioContext.createGain();
        piano.type = 'sine';
        piano.connect(pianoGain);
        pianoGain.connect(reverbDelay);
        reverbDelay.connect(delayGain);
        delayGain.connect(audioContext.destination);
        pianoGain.connect(audioContext.destination);
        
        piano.frequency.setValueAtTime(pianoArp[j], noteTime);
        pianoGain.gain.setValueAtTime(0.15, noteTime);
        pianoGain.gain.exponentialRampToValueAtTime(0.005, noteTime + 1.4);
        piano.start(noteTime);
        piano.stop(noteTime + 1.4);
      }
    }
  };

  const generateViolin = (audioContext: any, now: number, songDuration: number) => {
    // Violin Concerto - Lyrical with pronounced vibrato and legato phrasing
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(audioContext.destination);
    gain.gain.setValueAtTime(0.28, now);
    
    // Expressive vibrato
    const vibrato = audioContext.createOscillator();
    vibrato.frequency.setValueAtTime(5.8, now);
    const vibratoGain = audioContext.createGain();
    vibratoGain.gain.setValueAtTime(28, now);
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);
    
    // Soaring violin melody
    const violin = [587.33, 659.25, 783.99, 880.00, 987.77, 1046.50, 987.77, 880.00];
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < violin.length; j++) {
        osc.frequency.setTargetAtTime(violin[j], now + i * 3.44 + j * 0.43, 0.12);
      }
    }
    
    // Gentle orchestral strings underneath
    for (let i = 0; i < 3; i++) {
      const stringPad = audioContext.createOscillator();
      const stringGain = audioContext.createGain();
      stringPad.type = 'sine';
      stringPad.connect(stringGain);
      stringGain.connect(audioContext.destination);
      stringPad.frequency.setValueAtTime(293.66 + i * 146.83, now);
      stringGain.gain.setValueAtTime(0.06, now);
      stringPad.start(now);
      stringPad.stop(now + songDuration);
    }
    
    osc.start(now);
    osc.stop(now + songDuration);
    vibrato.start(now);
    vibrato.stop(now + songDuration);
  };

  // Jazz Genre Generators
  const generateJazzBlue = (audioContext: any, now: number, songDuration: number) => {
    // Blue Moon Jazz - Soulful with walking bass, swing feel, and sophisticated harmony
    const reverbDelay = audioContext.createDelay(0.4);
    reverbDelay.delayTime.value = 0.18;
    const delayGain = audioContext.createGain();
    delayGain.gain.value = 0.2;
    
    const lead = audioContext.createOscillator();
    const leadGain = audioContext.createGain();
    lead.type = 'sine';
    lead.connect(leadGain);
    leadGain.connect(reverbDelay);
    reverbDelay.connect(delayGain);
    delayGain.connect(audioContext.destination);
    leadGain.gain.setValueAtTime(0.28, now);
    
    // Jazz blues scale with swing triplets
    const bluesScale = [110.00, 130.81, 146.83, 164.81, 196.00, 220.00, 196.00, 164.81];
    for (let i = 0; i < 22; i++) {
      for (let j = 0; j < bluesScale.length; j++) {
        const swingOffset = j % 2 === 1 ? 0.1 : 0;
        lead.frequency.setTargetAtTime(bluesScale[j], now + i * 3.2 + j * 0.37 + swingOffset, 0.08);
      }
    }
    
    // Jazz walking bass
    for (let i = 0; i < songDuration; i += 0.8) {
      const bass = audioContext.createOscillator();
      const bassGain = audioContext.createGain();
      bass.type = 'sine';
      bass.connect(bassGain);
      bassGain.connect(audioContext.destination);
      const bassPattern = [55, 65.41, 73.42, 82.41];
      bass.frequency.setValueAtTime(bassPattern[Math.floor(i / 0.8) % bassPattern.length], now + i);
      bassGain.gain.setValueAtTime(0.18, now + i);
      bassGain.gain.exponentialRampToValueAtTime(0.01, now + i + 0.5);
      bass.start(now + i);
      bass.stop(now + i + 0.5);
    }
    
    // Subtle jazz brushes/swish drums
    for (let i = 0; i < songDuration; i += 1.6) {
      const brushes = audioContext.createBufferSource();
      const brushesGain = audioContext.createGain();
      brushesGain.connect(audioContext.destination);
      brushesGain.gain.setValueAtTime(0.08, now + i);
      brushesGain.gain.exponentialRampToValueAtTime(0.001, now + i + 0.4);
      
      const bufferSize = audioContext.sampleRate * 0.4;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      for (let k = 0; k < bufferSize; k++) {
        data[k] = (Math.random() * 2 - 1) * 0.3 * (1 - k / bufferSize);
      }
      brushes.buffer = buffer;
      brushes.connect(brushesGain);
      brushes.start(now + i);
    }
    
    lead.start(now);
    lead.stop(now + songDuration);
  };

  const generateJazzSax = (audioContext: any, now: number, songDuration: number) => {
    // Smooth Saxophone - Warm tone with expressive wah filter and legato phrasing
    const filter = audioContext.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.setValueAtTime(1300, now);
    filter.gain.setValueAtTime(14, now);
    filter.Q.setValueAtTime(2, now);
    
    const sax = audioContext.createOscillator();
    const saxGain = audioContext.createGain();
    sax.type = 'sine';
    sax.connect(filter);
    filter.connect(saxGain);
    saxGain.connect(audioContext.destination);
    saxGain.gain.setValueAtTime(0.3, now);
    
    // Smooth wah expression
    for (let i = 0; i < songDuration; i += 1.6) {
      filter.frequency.exponentialRampToValueAtTime(2600, now + i + 0.8);
      filter.frequency.exponentialRampToValueAtTime(1300, now + i + 1.6);
    }
    
    // Soulful descending melody
    const saxMelody = [523.25, 493.88, 440.00, 392.00, 349.23, 392.00, 440.00, 493.88];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < saxMelody.length; j++) {
        sax.frequency.setTargetAtTime(saxMelody[j], now + i * 2.88 + j * 0.36, 0.12);
      }
    }
    
    // Walking jazz bass
    for (let i = 0; i < songDuration; i += 0.72) {
      const bass = audioContext.createOscillator();
      const bassGain = audioContext.createGain();
      bass.type = 'sine';
      bass.connect(bassGain);
      bassGain.connect(audioContext.destination);
      const jazzBass = [49.00, 61.74, 73.42, 82.41];
      bass.frequency.setValueAtTime(jazzBass[Math.floor(i / 0.72) % jazzBass.length], now + i);
      bassGain.gain.setValueAtTime(0.16, now + i);
      bassGain.gain.exponentialRampToValueAtTime(0.01, now + i + 0.5);
      bass.start(now + i);
      bass.stop(now + i + 0.5);
    }
    
    sax.start(now);
    sax.stop(now + songDuration);
  };

  const generateJazzMidnight = (audioContext: any, now: number, songDuration: number) => {
    // Midnight Improvisation - Sophisticated swing with extended chords and chromatic approach
    const reverbDelay = audioContext.createDelay(0.5);
    reverbDelay.delayTime.value = 0.25;
    const delayGain = audioContext.createGain();
    delayGain.gain.value = 0.18;
    
    const melodist = audioContext.createOscillator();
    const melodyGain = audioContext.createGain();
    melodist.type = 'sine';
    melodist.connect(melodyGain);
    melodyGain.connect(reverbDelay);
    reverbDelay.connect(delayGain);
    delayGain.connect(audioContext.destination);
    melodyGain.gain.setValueAtTime(0.26, now);
    
    // Jazz chord progression with chromatic passing notes
    const jazzChords = [174.61, 196.00, 220.00, 246.94, 277.18, 293.66, 277.18, 246.94];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < jazzChords.length; j++) {
        const chromatic = (Math.random() - 0.5) * 1;
        melodist.frequency.setTargetAtTime(jazzChords[j] + chromatic, now + i * 3.2 + j * 0.38, 0.1);
      }
    }
    
    // Jazz double bass with swing pattern
    for (let i = 0; i < songDuration; i += 0.8) {
      const bassNote = audioContext.createOscillator();
      const bassGain = audioContext.createGain();
      bassNote.type = 'sine';
      bassNote.connect(bassGain);
      bassGain.connect(audioContext.destination);
      const doubleBassPat = [65.41, 73.42, 82.41, 92.50];
      bassNote.frequency.setValueAtTime(doubleBassPat[Math.floor(i / 0.8) % doubleBassPat.length], now + i);
      bassGain.gain.setValueAtTime(0.2, now + i);
      bassGain.gain.exponentialRampToValueAtTime(0.01, now + i + 0.55);
      bassNote.start(now + i);
      bassNote.stop(now + i + 0.55);
    }
    
    // Brushed drums - subtle
    for (let i = 0; i < songDuration; i += 1.6) {
      const brushDrums = audioContext.createBufferSource();
      const brushGain = audioContext.createGain();
      brushGain.connect(audioContext.destination);
      brushGain.gain.setValueAtTime(0.06, now + i);
      brushGain.gain.exponentialRampToValueAtTime(0.001, now + i + 0.4);
      
      const bufferSize = audioContext.sampleRate * 0.4;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      for (let k = 0; k < bufferSize; k++) {
        data[k] = (Math.random() * 2 - 1) * 0.2 * (1 - k / bufferSize);
      }
      brushDrums.buffer = buffer;
      brushDrums.connect(brushGain);
      brushDrums.start(now + i);
    }
    
    melodist.start(now);
    melodist.stop(now + songDuration);
  };

  // Electronic Genre Generators
  const generateElectronicDreams = (audioContext: any, now: number, songDuration: number) => {
    // Digital Dreams - Modern EDM with layered pads, arpeggiator, and filter automation
    // Three-layer pad system
    const pads = [];
    for (let i = 0; i < 3; i++) {
      const pad = audioContext.createOscillator();
      const padGain = audioContext.createGain();
      pad.type = 'sine';
      pad.connect(padGain);
      padGain.connect(audioContext.destination);
      pad.frequency.setValueAtTime(174.61 + i * 87.31, now);
      padGain.gain.setValueAtTime(0.07, now);
      pads.push({ osc: pad, gain: padGain });
    }
    
    // Automated filter for arpeggiator
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, now);
    filter.Q.setValueAtTime(2.5, now);
    
    const arpeggiator = audioContext.createOscillator();
    const arpGain = audioContext.createGain();
    arpeggiator.type = 'triangle';
    arpeggiator.connect(filter);
    filter.connect(arpGain);
    arpGain.connect(audioContext.destination);
    arpGain.gain.setValueAtTime(0.2, now);
    
    // Modern EDM arpeggio
    const edm = [523.25, 587.33, 659.25, 783.99, 659.25, 587.33];
    for (let i = 0; i < 32; i++) {
      for (let j = 0; j < edm.length; j++) {
        arpeggiator.frequency.setTargetAtTime(edm[j], now + i * 1.76 + j * 0.28, 0.02);
      }
      // Dynamic filter movement
      filter.frequency.exponentialRampToValueAtTime(3500, now + i * 1.76 + 0.88);
      filter.frequency.exponentialRampToValueAtTime(1500, now + i * 1.76 + 1.76);
    }
    
    // Modern electronic kick (tight and punchy)
    for (let i = 0; i < songDuration; i += 0.44) {
      const kick = audioContext.createOscillator();
      const kickGain = audioContext.createGain();
      kick.connect(kickGain);
      kickGain.connect(audioContext.destination);
      kick.frequency.setValueAtTime(140, now + i);
      kick.frequency.exponentialRampToValueAtTime(40, now + i + 0.08);
      kick.frequency.exponentialRampToValueAtTime(0.01, now + i + 0.18);
      kickGain.gain.setValueAtTime(0.75, now + i);
      kickGain.gain.exponentialRampToValueAtTime(0.01, now + i + 0.18);
      kick.start(now + i);
      kick.stop(now + i + 0.18);
    }
    
    // Electronic snare
    for (let i = 0; i < songDuration; i += 0.88) {
      if (Math.floor(i * 2 / 0.88) % 2 === 1) {
        const snare = audioContext.createOscillator();
        const snareGain = audioContext.createGain();
        snare.type = 'square';
        snare.connect(snareGain);
        snareGain.connect(audioContext.destination);
        snare.frequency.setValueAtTime(350, now + i);
        snare.frequency.exponentialRampToValueAtTime(100, now + i + 0.06);
        snareGain.gain.setValueAtTime(0.3, now + i);
        snareGain.gain.exponentialRampToValueAtTime(0.01, now + i + 0.08);
        snare.start(now + i);
        snare.stop(now + i + 0.08);
      }
    }
    
    // Hi-hat pattern for texture
    for (let i = 0; i < songDuration; i += 0.22) {
      const hat = audioContext.createBufferSource();
      const hatGain = audioContext.createGain();
      hatGain.connect(audioContext.destination);
      hatGain.gain.setValueAtTime(0.14, now + i);
      hatGain.gain.exponentialRampToValueAtTime(0.001, now + i + 0.1);
      
      const bufferSize = audioContext.sampleRate * 0.1;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      for (let k = 0; k < bufferSize; k++) {
        data[k] = (Math.random() * 2 - 1) * (1 - k / bufferSize);
      }
      hat.buffer = buffer;
      hat.connect(hatGain);
      hat.start(now + i);
    }
    
    pads.forEach(({ osc }) => {
      osc.start(now);
      osc.stop(now + songDuration);
    });
    arpeggiator.start(now);
    arpeggiator.stop(now + songDuration);
  };

  const generateElectronicWave = (audioContext: any, now: number, songDuration: number) => {
    // Synthetic Wave - Lush FM synthesis with evolving pad and bass movement
    const carrierOsc = audioContext.createOscillator();
    const carrierGain = audioContext.createGain();
    carrierOsc.type = 'sine';
    carrierOsc.connect(carrierGain);
    carrierGain.connect(audioContext.destination);
    carrierGain.gain.setValueAtTime(0.16, now);
    
    // Sophisticated FM modulation
    const modulator = audioContext.createOscillator();
    modulator.frequency.setValueAtTime(1.6, now);
    const modGain = audioContext.createGain();
    modGain.gain.setValueAtTime(65, now);
    modulator.connect(modGain);
    modGain.connect(carrierOsc.frequency);
    
    // Deep sub-bass layer
    const subBass = audioContext.createOscillator();
    const subGain = audioContext.createGain();
    subBass.type = 'sine';
    subBass.connect(subGain);
    subGain.connect(audioContext.destination);
    subGain.gain.setValueAtTime(0.14, now);
    subBass.frequency.setValueAtTime(110, now);
    
    // Pad swell automation
    for (let i = 0; i < 14; i++) {
      carrierOsc.frequency.setTargetAtTime(330 + i * 45, now + i * 12.8, 3);
    }
    
    // Subtle kick for pulse
    for (let i = 0; i < songDuration; i += 1.6) {
      const kick = audioContext.createOscillator();
      const kickGain = audioContext.createGain();
      kick.connect(kickGain);
      kickGain.connect(audioContext.destination);
      kick.frequency.setValueAtTime(100, now + i);
      kick.frequency.exponentialRampToValueAtTime(35, now + i + 0.16);
      kickGain.gain.setValueAtTime(0.4, now + i);
      kickGain.gain.exponentialRampToValueAtTime(0.01, now + i + 0.16);
      kick.start(now + i);
      kick.stop(now + i + 0.16);
    }
    
    modulator.start(now);
    modulator.stop(now + songDuration);
    carrierOsc.start(now);
    carrierOsc.stop(now + songDuration);
    subBass.start(now);
    subBass.stop(now + songDuration);
  };

  const generateElectronicPulse = (audioContext: any, now: number, songDuration: number) => {
    // Cyber Pulse - Intense modern tech beats with layered oscillators and modulation
    const osc1 = audioContext.createOscillator();
    const osc1Gain = audioContext.createGain();
    osc1.type = 'square';
    osc1.connect(osc1Gain);
    osc1Gain.connect(audioContext.destination);
    osc1Gain.gain.setValueAtTime(0.22, now);
    
    const osc2 = audioContext.createOscillator();
    const osc2Gain = audioContext.createGain();
    osc2.type = 'sawtooth';
    osc2.connect(osc2Gain);
    osc2Gain.connect(audioContext.destination);
    osc2Gain.gain.setValueAtTime(0.18, now);
    
    const osc3 = audioContext.createOscillator();
    const osc3Gain = audioContext.createGain();
    osc3.type = 'triangle';
    osc3.connect(osc3Gain);
    osc3Gain.connect(audioContext.destination);
    osc3Gain.gain.setValueAtTime(0.14, now);
    
    // Fast cyber beat pattern
    for (let i = 0; i < songDuration; i += 0.22) {
      osc1.frequency.setTargetAtTime(950, now + i, 0.01);
      osc1.frequency.setTargetAtTime(250, now + i + 0.11, 0.01);
      osc2.frequency.setTargetAtTime(1300, now + i, 0.01);
      osc2.frequency.setTargetAtTime(200, now + i + 0.11, 0.01);
      osc3.frequency.setTargetAtTime(650, now + i, 0.01);
      osc3.frequency.setTargetAtTime(150, now + i + 0.11, 0.01);
    }
    
    // Cyber kick with pitch drop
    for (let i = 0; i < songDuration; i += 0.22) {
      const kick = audioContext.createOscillator();
      const kickGain = audioContext.createGain();
      kick.connect(kickGain);
      kickGain.connect(audioContext.destination);
      kick.frequency.setValueAtTime(160, now + i);
      kick.frequency.exponentialRampToValueAtTime(50, now + i + 0.1);
      kickGain.gain.setValueAtTime(0.72, now + i);
      kickGain.gain.exponentialRampToValueAtTime(0.01, now + i + 0.1);
      kick.start(now + i);
      kick.stop(now + i + 0.1);
    }
    
    osc1.start(now);
    osc1.stop(now + songDuration);
    osc2.start(now);
    osc2.stop(now + songDuration);
    osc3.start(now);
    osc3.stop(now + songDuration);
  };

  // Hip-Hop Genre Generators
  const generateHipHopUrban = (audioContext: any, now: number, songDuration: number) => {
    // Urban Beats - Modern trap with sub-bass, crisp drums, and layered melodics
    const subBass = audioContext.createOscillator();
    const subGain = audioContext.createGain();
    subBass.type = 'sine';
    subBass.connect(subGain);
    subGain.connect(audioContext.destination);
    subGain.gain.setValueAtTime(0.32, now);
    subBass.frequency.setValueAtTime(50, now);
    
    // Melodic layer
    const melodic = audioContext.createOscillator();
    const melodicGain = audioContext.createGain();
    melodic.type = 'square';
    melodic.connect(melodicGain);
    melodicGain.connect(audioContext.destination);
    melodicGain.gain.setValueAtTime(0.24, now);
    
    const urbanPattern = [98.00, 110.00, 123.47, 146.83, 123.47, 110.00];
    for (let i = 0; i < 36; i++) {
      for (let j = 0; j < urbanPattern.length; j++) {
        melodic.frequency.setTargetAtTime(urbanPattern[j], now + i * 2.16 + j * 0.36, 0.02);
      }
    }
    
    // Trap kick pattern (808)
    for (let i = 0; i < songDuration; i += 0.6) {
      const kick = audioContext.createOscillator();
      const kickGain = audioContext.createGain();
      kick.connect(kickGain);
      kickGain.connect(audioContext.destination);
      kick.frequency.setValueAtTime(150, now + i);
      kick.frequency.exponentialRampToValueAtTime(35, now + i + 0.12);
      kick.frequency.exponentialRampToValueAtTime(0.01, now + i + 0.25);
      kickGain.gain.setValueAtTime(0.75, now + i);
      kickGain.gain.exponentialRampToValueAtTime(0.01, now + i + 0.25);
      kick.start(now + i);
      kick.stop(now + i + 0.25);
    }
    
    // Trap snare roll
    for (let i = 0; i < songDuration; i += 0.3) {
      if (Math.random() > 0.4) {
        const snare = audioContext.createOscillator();
        const snareGain = audioContext.createGain();
        snare.type = 'square';
        snare.connect(snareGain);
        snareGain.connect(audioContext.destination);
        snare.frequency.setValueAtTime(320, now + i);
        snare.frequency.exponentialRampToValueAtTime(80, now + i + 0.06);
        snareGain.gain.setValueAtTime(0.3, now + i);
        snareGain.gain.exponentialRampToValueAtTime(0.01, now + i + 0.08);
        snare.start(now + i);
        snare.stop(now + i + 0.08);
      }
    }
    
    // Tight hi-hat pattern
    for (let i = 0; i < songDuration; i += 0.15) {
      const hat = audioContext.createBufferSource();
      const hatGain = audioContext.createGain();
      hatGain.connect(audioContext.destination);
      hatGain.gain.setValueAtTime(0.16, now + i);
      hatGain.gain.exponentialRampToValueAtTime(0.001, now + i + 0.08);
      
      const bufferSize = audioContext.sampleRate * 0.08;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      for (let k = 0; k < bufferSize; k++) {
        data[k] = (Math.random() * 2 - 1) * (1 - k / bufferSize) * 0.8;
      }
      hat.buffer = buffer;
      hat.connect(hatGain);
      hat.start(now + i);
    }
    
    subBass.start(now);
    subBass.stop(now + songDuration);
    melodic.start(now);
    melodic.stop(now + songDuration);
  };

  const generateHipHopFlow = (audioContext: any, now: number, songDuration: number) => {
    // Rhythm Flow - Boom-bap style with funky swing and classic hip-hop groove
    const bass = audioContext.createOscillator();
    const bassGain = audioContext.createGain();
    bass.type = 'sawtooth';
    bass.connect(bassGain);
    bassGain.connect(audioContext.destination);
    bassGain.gain.setValueAtTime(0.28, now);
    
    const melody = audioContext.createOscillator();
    const melodyGain = audioContext.createGain();
    melody.type = 'sine';
    melody.connect(melodyGain);
    melodyGain.connect(audioContext.destination);
    melodyGain.gain.setValueAtTime(0.26, now);
    
    // Classic boom-bap pattern with swing
    const boombapPattern = [164.81, 196.00, 220.00, 246.94, 220.00, 196.00];
    for (let i = 0; i < 32; i++) {
      for (let j = 0; j < boombapPattern.length; j++) {
        const swingOffset = j % 2 === 1 ? 0.15 : 0;
        melody.frequency.setTargetAtTime(boombapPattern[j], now + i * 2.16 + j * 0.34 + swingOffset, 0.05);
      }
    }
    
    bass.frequency.setValueAtTime(82, now);
    
    // Boom-bap kick on 1 and 3
    for (let i = 0; i < songDuration; i += 0.54) {
      const kick = audioContext.createOscillator();
      const kickGain = audioContext.createGain();
      kick.connect(kickGain);
      kickGain.connect(audioContext.destination);
      kick.frequency.setValueAtTime(80, now + i);
      kick.frequency.exponentialRampToValueAtTime(30, now + i + 0.16);
      kickGain.gain.setValueAtTime(0.68, now + i);
      kickGain.gain.exponentialRampToValueAtTime(0.01, now + i + 0.16);
      kick.start(now + i);
      kick.stop(now + i + 0.16);
    }
    
    // Classic snare backbeat
    for (let i = 0; i < songDuration; i += 1.08) {
      const snare = audioContext.createOscillator();
      const snareGain = audioContext.createGain();
      snare.type = 'triangle';
      snare.connect(snareGain);
      snareGain.connect(audioContext.destination);
      snare.frequency.setValueAtTime(280, now + i + 0.54);
      snare.frequency.exponentialRampToValueAtTime(90, now + i + 0.64);
      snareGain.gain.setValueAtTime(0.32, now + i + 0.54);
      snareGain.gain.exponentialRampToValueAtTime(0.01, now + i + 0.64);
      snare.start(now + i + 0.54);
      snare.stop(now + i + 0.64);
    }
    
    // Vintage hi-hat groove
    for (let i = 0; i < songDuration; i += 0.27) {
      const hat = audioContext.createBufferSource();
      const hatGain = audioContext.createGain();
      hatGain.connect(audioContext.destination);
      hatGain.gain.setValueAtTime(0.12, now + i);
      hatGain.gain.exponentialRampToValueAtTime(0.001, now + i + 0.12);
      
      const bufferSize = audioContext.sampleRate * 0.12;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      for (let k = 0; k < bufferSize; k++) {
        data[k] = (Math.random() * 2 - 1) * (1 - k / bufferSize) * 0.6;
      }
      hat.buffer = buffer;
      hat.connect(hatGain);
      hat.start(now + i);
    }
    
    melody.start(now);
    melody.stop(now + songDuration);
    bass.start(now);
    bass.stop(now + songDuration);
  };

  const generateHipHopStreet = (audioContext: any, now: number, songDuration: number) => {
    // Street Vibes - Heavy funk bass with vocoder effect and trap elements
    const bass = audioContext.createOscillator();
    const bassGain = audioContext.createGain();
    bass.type = 'sawtooth';
    bass.connect(bassGain);
    bassGain.connect(audioContext.destination);
    bassGain.gain.setValueAtTime(0.34, now);
    
    // Layered harmonics for vocoder-like effect
    const harmonics = [];
    for (let h = 1; h <= 3; h++) {
      const harm = audioContext.createOscillator();
      const harmGain = audioContext.createGain();
      harm.type = 'sine';
      harm.connect(harmGain);
      harmGain.connect(audioContext.destination);
      harmGain.gain.setValueAtTime(0.07 / h, now);
      harmonics.push({ osc: harm, gain: harmGain });
    }
    
    const streetGroove = [55.00, 65.41, 82.41, 110.00, 82.41, 73.42];
    for (let i = 0; i < 32; i++) {
      for (let j = 0; j < streetGroove.length; j++) {
        bass.frequency.setTargetAtTime(streetGroove[j], now + i * 2.16 + j * 0.36, 0.02);
        // Harmonics move with bass
        harmonics[0].osc.frequency.setTargetAtTime(streetGroove[j] * 2, now + i * 2.16 + j * 0.36, 0.02);
        harmonics[1].osc.frequency.setTargetAtTime(streetGroove[j] * 3, now + i * 2.16 + j * 0.36, 0.02);
        harmonics[2].osc.frequency.setTargetAtTime(streetGroove[j] * 4, now + i * 2.16 + j * 0.36, 0.02);
      }
    }
    
    // Street trap kick
    for (let i = 0; i < songDuration; i += 0.54) {
      const kick = audioContext.createOscillator();
      const kickGain = audioContext.createGain();
      kick.connect(kickGain);
      kickGain.connect(audioContext.destination);
      kick.frequency.setValueAtTime(140, now + i);
      kick.frequency.exponentialRampToValueAtTime(40, now + i + 0.14);
      kickGain.gain.setValueAtTime(0.7, now + i);
      kickGain.gain.exponentialRampToValueAtTime(0.01, now + i + 0.14);
      kick.start(now + i);
      kick.stop(now + i + 0.14);
    }
    
    // Stutter snare for modern feel
    for (let i = 0; i < songDuration; i += 0.54) {
      for (let s = 0; s < 2; s++) {
        const snare = audioContext.createOscillator();
        const snareGain = audioContext.createGain();
        snare.type = 'square';
        snare.connect(snareGain);
        snareGain.connect(audioContext.destination);
        snare.frequency.setValueAtTime(320, now + i + 0.27 + s * 0.08);
        snare.frequency.exponentialRampToValueAtTime(100, now + i + 0.34 + s * 0.08);
        snareGain.gain.setValueAtTime(0.28, now + i + 0.27 + s * 0.08);
        snareGain.gain.exponentialRampToValueAtTime(0.01, now + i + 0.34 + s * 0.08);
        snare.start(now + i + 0.27 + s * 0.08);
        snare.stop(now + i + 0.34 + s * 0.08);
      }
    }
    
    // Crisp hi-hats
    for (let i = 0; i < songDuration; i += 0.135) {
      const hat = audioContext.createBufferSource();
      const hatGain = audioContext.createGain();
      hatGain.connect(audioContext.destination);
      hatGain.gain.setValueAtTime(0.14, now + i);
      hatGain.gain.exponentialRampToValueAtTime(0.001, now + i + 0.08);
      
      const bufferSize = audioContext.sampleRate * 0.08;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      for (let k = 0; k < bufferSize; k++) {
        data[k] = (Math.random() * 2 - 1) * (1 - k / bufferSize) * 0.85;
      }
      hat.buffer = buffer;
      hat.connect(hatGain);
      hat.start(now + i);
    }
    
    bass.start(now);
    bass.stop(now + songDuration);
    harmonics.forEach(({ osc }) => {
      osc.start(now);
      osc.stop(now + songDuration);
    });
  };

  const currentTracks = activeGenre ? tracksByGenre[activeGenre] : tracksByGenre.Pop;
  const ageLevelTracks = tracksByAge[activeAgeLevel];

  // Toggle favorite
  const toggleFavorite = (trackId: number) => {
    setFavorites(favs => 
      favs.includes(trackId) 
        ? favs.filter(id => id !== trackId)
        : [...favs, trackId]
    );
  };

  // Create new album
  const createAlbum = () => {
    if (newAlbumName.trim()) {
      setAlbums([...albums, { id: Date.now(), name: newAlbumName, tracks: [] }]);
      setNewAlbumName('');
    }
  };

  // Add track to album
  const addTrackToAlbum = (albumId: number, trackId: number) => {
    setAlbums(albums.map(album => 
      album.id === albumId
        ? { ...album, tracks: [...album.tracks, trackId] }
        : album
    ));
  };

  // Share playlist via email
  const sharePlaylist = () => {
    const playlistContent = `
Music Playlist: ${playlistName}
From Sahara Supersite's Music Section

Favorite Tracks:
${favorites.map(fav => {
  const track = allTracks.find(t => t.id === fav);
  return track ? `- ${track.title} by ${track.artist}` : '';
}).join('\n')}

${albums.length > 0 ? `My Albums:\n${albums.map(a => `\n${a.name} (${a.tracks.length} tracks)`).join('\n')}` : ''}

Check it out at: /music
    `;
    
    const mailtoLink = `mailto:${emailTo}?subject=Check out my music playlist&body=${encodeURIComponent(playlistContent)}`;
    window.location.href = mailtoLink;
  };

  // Stop any active synthesis
  const stopSynth = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (synthTimeoutRef.current) {
      clearTimeout(synthTimeoutRef.current);
      synthTimeoutRef.current = null;
    }
  };

  // Update audio element when track changes
  useEffect(() => {
    // Stop synth music when switching tracks
    stopSynth();

    if (audioRef.current) {
      // Only set src if it's an uploaded file (has actual audio data)
      if (currentTrack >= allTracks.length && uploadedFiles[currentTrack - allTracks.length]) {
        audioRef.current.src = uploadedFiles[currentTrack - allTracks.length];
        audioRef.current.load();
        if (isPlaying) {
          audioRef.current.play().catch(() => {
            // Handle autoplay errors silently
          });
        }
      } else {
        // Demo tracks don't have audio files - just show selection
        audioRef.current.src = '';
      }
    }
  }, [currentTrack, uploadedFiles, isPlaying]);

  // Auto-play when switching to uploaded files
  useEffect(() => {
    if (isPlaying && audioRef.current && audioRef.current.src) {
      audioRef.current.play().catch(() => {
        // Handle play errors silently
      });
    }
  }, [isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopSynth();
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden text-[var(--text)]">
      {/* Noise overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`
           }} />

      {/* Sidebar */}
      <aside className="fixed left-0 top-[88px] z-40 h-[calc(100vh-88px-120px)] w-64 overflow-y-auto border-r border-[var(--border)] bg-[var(--surface)] pb-8 backdrop-blur-md">
        <div className="p-6">
          {/* Genres Section */}
          <div className="mb-8">
            <h3 className="text-cyan-400 font-bold uppercase text-xs tracking-widest mb-4">Genres</h3>
            <div className="space-y-2">
              {Object.keys(tracksByGenre).map((genre) => (
                <button
                  key={genre}
                  onClick={() => setActiveGenre(genre)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-all ${
                    activeGenre === genre
                      ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                      : 'text-gray-400 hover:text-cyan-400 hover:bg-slate-800/50'
                  }`}
                >
                  {genre.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Age Level Section */}
          <div className="mb-8">
            <h3 className="text-cyan-400 font-bold uppercase text-xs tracking-widest mb-4">Age Level</h3>
            <div className="space-y-2">
              {Object.keys(tracksByAge).map((ageLevel) => (
                <button
                  key={ageLevel}
                  onClick={() => setActiveAgeLevel(ageLevel)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-all ${
                    activeAgeLevel === ageLevel
                      ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                      : 'text-gray-400 hover:text-cyan-400 hover:bg-slate-800/50'
                  }`}
                >
                  {ageLevel}
                </button>
              ))}
            </div>
          </div>

          {/* Moods Section */}
          <div className="mb-8">
            <h3 className="text-cyan-400 font-bold uppercase text-xs tracking-widest mb-4">Moods</h3>
            <div className="space-y-2">
              {moods.map((mood) => (
                <button
                  key={mood}
                  className="w-full text-left px-3 py-2 rounded text-sm text-gray-400 hover:text-cyan-400 hover:bg-slate-800/50 transition-all"
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          {/* Eras Section */}
          <div className="mb-8">
            <h3 className="text-cyan-400 font-bold uppercase text-xs tracking-widest mb-4">Eras</h3>
            <div className="space-y-2">
              {eras.map((era) => (
                <button
                  key={era}
                  className="w-full text-left px-3 py-2 rounded text-sm text-gray-400 hover:text-cyan-400 hover:bg-slate-800/50 transition-all"
                >
                  {era}
                </button>
              ))}
            </div>
          </div>

          {/* Favorites Section */}
          <div className="mb-8">
            <h3 className="text-cyan-400 font-bold uppercase text-xs tracking-widest mb-4">
              ❤️ Favorites ({favorites.length})
            </h3>
            {favorites.length > 0 ? (
              <div className="space-y-2">
                {allTracks.filter(t => favorites.includes(t.id)).map(track => (
                  <button
                    key={track.id}
                    onClick={() => setCurrentTrack(allTracks.indexOf(track))}
                    className="w-full text-left px-3 py-2 rounded text-xs text-gray-300 hover:text-cyan-300 hover:bg-slate-800/50 transition-all truncate"
                  >
                    {track.title}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-xs">No favorites yet</p>
            )}
          </div>
        </div>
      </aside>

      {/* Content with top padding for fixed header and left padding for sidebar */}
      <div className="relative z-10 ml-64">
            <div className="p-8">
              {/* Current Playing Track */}
              {isPlaying && currentTrack < allTracks.length && (
                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 rounded-lg p-6 mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-cyan-400 text-sm font-semibold mb-1">NOW PLAYING</p>
                      <h2 className="text-2xl font-bold text-white">{allTracks[currentTrack]?.title}</h2>
                      <p className="text-gray-300 text-sm mt-1">{allTracks[currentTrack]?.artist}</p>
                    </div>
                    <span className="text-4xl animate-pulse">🎵</span>
                  </div>
                </div>
              )}

              {/* Tracks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tracksByGenre[activeGenre]?.map((track, index) => {
                  const globalIndex = allTracks.findIndex(t => t.id === track.id);
                  const isFavorite = favorites.includes(track.id);
                  
                  return (
                    <div
                      key={track.id}
                      onClick={() => setCurrentTrack(globalIndex)}
                      className={`group cursor-pointer p-4 rounded-lg transition-all duration-200 ${
                        currentTrack === globalIndex
                          ? 'bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border border-cyan-500/60'
                          : 'bg-slate-800/40 hover:bg-slate-700/60 border border-slate-700/40'
                      }`}
                    >
                      {/* Album Art Placeholder */}
                      <div className={`w-full aspect-square rounded-lg mb-4 bg-gradient-to-br ${
                        currentTrack === globalIndex
                          ? 'from-cyan-500 to-blue-600'
                          : 'from-slate-700 to-slate-800'
                      } flex items-center justify-center text-4xl group-hover:shadow-lg group-hover:shadow-cyan-500/30 transition-all`}>
                        🎵
                      </div>

                      {/* Track Info */}
                      <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 mb-1">
                        {track.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-1 mb-3">{track.artist}</p>

                      {/* Controls */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{track.duration}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isFavorite) {
                              setFavorites(favorites.filter(id => id !== track.id));
                            } else {
                              setFavorites([...favorites, track.id]);
                            }
                          }}
                          className="text-lg transition-colors"
                        >
                          {isFavorite ? '❤️' : '🤍'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

      {/* Bottom Player Bar */}
      <div className="bg-slate-900/95 backdrop-blur-md border-t border-cyan-500/20 px-8 py-4 fixed bottom-0 w-full z-50">
        <div className="flex items-center gap-4 mb-3">
          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold truncate">
              {currentTrack < allTracks.length ? allTracks[currentTrack]?.title : 'Select a track'}
            </p>
            <p className="text-gray-400 text-sm truncate">
              {currentTrack < allTracks.length ? allTracks[currentTrack]?.artist : 'No track selected'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 max-w-sm">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleProgressChange}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTrack(Math.max(0, currentTrack - 1))}
              className="text-gray-400 hover:text-cyan-400 transition-colors text-lg"
              title="Previous"
            >
              ⏮
            </button>
            <button
              onClick={handlePlayPause}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg transition-all transform hover:scale-110"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button
              onClick={() =>
                setCurrentTrack(
                  Math.min(allTracks.length + uploadedFiles.length - 1, currentTrack + 1)
                )
              }
              className="text-gray-400 hover:text-cyan-400 transition-colors text-lg"
              title="Next"
            >
              ⏭
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 ml-4">
              <span className="text-gray-400">🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
