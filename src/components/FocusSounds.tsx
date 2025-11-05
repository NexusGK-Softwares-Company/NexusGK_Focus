import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Cloud, Waves, Music, Wind } from 'lucide-react';

const sounds = [
  { id: 'rain', name: 'Rain', icon: <Cloud size={20} />, url: 'https://cdn.pixabay.com/audio/2022/05/13/audio_257112e6b4.mp3' },
  { id: 'ocean', name: 'Ocean', icon: <Waves size={20} />, url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_4d463d2e70.mp3' },
  { id: 'wind', name: 'Wind', icon: <Wind size={20} />, url: 'https://cdn.pixabay.com/audio/2022/03/12/audio_0929d2e6c2.mp3' },
];

export const FocusSounds: React.FC = () => {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const toggleSound = (soundId: string, url: string) => {
    if (activeSound === soundId) {
      audioRef.current?.pause();
      setActiveSound(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(url);
      audio.loop = true;
      audio.volume = volume;
      audio.play();
      audioRef.current = audio;
      setActiveSound(soundId);
    }
  };

  return (
    <div className="glass rounded-2xl p-6 shadow-xl">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Music size={24} />
        Focus Sounds
      </h3>
      
      <div className="space-y-3">
        <div className="flex gap-2">
          {sounds.map((sound) => (
            <button
              key={sound.id}
              onClick={() => toggleSound(sound.id, sound.url)}
              className={`flex-1 px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                activeSound === sound.id
                  ? 'bg-secondary text-white'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {sound.icon}
              <span className="hidden sm:inline">{sound.name}</span>
            </button>
          ))}
        </div>

        {activeSound && (
          <div className="flex items-center gap-3 pt-2">
            <VolumeX size={20} className="text-white/60" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
            <Volume2 size={20} className="text-white/60" />
          </div>
        )}
      </div>
    </div>
  );
};

