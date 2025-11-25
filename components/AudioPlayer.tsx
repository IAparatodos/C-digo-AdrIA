import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Download, Volume2, X } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string | null;
  onReset: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, onReset }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setProgress(0);
      setDuration(0);
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      if (total > 0) {
        setProgress((current / total) * 100);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!audioUrl) return null;

  return (
    <div className="w-full bg-slate-900/50 rounded-2xl border border-brand-600/30 p-6 shadow-xl backdrop-blur-sm animate-fade-in relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-400/5 rounded-full blur-3xl pointer-events-none" />

      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        className="hidden"
      />

      <div className="flex flex-col gap-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-400/10 rounded-full border border-brand-400/20">
              <Volume2 className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Audio Generado</h3>
              <p className="text-xs text-brand-400/80">Listo para reproducir</p>
            </div>
          </div>
          <button
            onClick={onReset}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visualizer / Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer group" onClick={(e) => {
            if (audioRef.current) {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              audioRef.current.currentTime = pos * audioRef.current.duration;
            }
          }}>
            <div 
              className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-100 ease-linear relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <a
            href={audioUrl}
            download="gemini-speech.wav"
            className="p-3 rounded-full text-slate-400 hover:text-brand-400 hover:bg-slate-800 transition-all border border-transparent hover:border-brand-600/30"
            title="Descargar WAV"
          >
            <Download className="w-5 h-5" />
          </a>

          <button
            onClick={togglePlay}
            className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-400/20 hover:shadow-brand-400/40 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </button>

          <div className="w-11 h-11" /> {/* Spacer to balance layout */}
        </div>
      </div>
    </div>
  );
};