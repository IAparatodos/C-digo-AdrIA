import React from 'react';
import { VoiceName } from '../types';
import { User, Loader2, Volume2 } from 'lucide-react';

interface VoiceSelectorProps {
  selectedVoice: VoiceName;
  onVoiceChange: (voice: VoiceName) => void;
  onPreview: (voice: VoiceName) => void;
  previewLoading: VoiceName | null;
  disabled?: boolean;
}

const voices = [
  { id: VoiceName.Puck, label: 'Narrativa, Suave', gender: 'Male', description: 'Ideal para historias y charlas' },
  { id: VoiceName.Charon, label: 'Profunda, Grave', gender: 'Male', description: 'Para noticias o anuncios serios' },
  { id: VoiceName.Kore, label: 'Calmada, Serena', gender: 'Female', description: 'Perfecta para meditación o guías' },
  { id: VoiceName.Fenrir, label: 'Enérgica, Dinámica', gender: 'Male', description: 'Excelente para podcast y acción' },
  { id: VoiceName.Zephyr, label: 'Clara, Brillante', gender: 'Female', description: 'Voz estándar para asistentes' },
];

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({ 
  selectedVoice, 
  onVoiceChange, 
  onPreview,
  previewLoading,
  disabled 
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-brand-400 flex items-center gap-2">
          <User className="w-4 h-4" />
          Seleccionar Voz
        </label>
        <span className="text-xs text-slate-500 font-medium">5 voces disponibles</span>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {voices.map((voice) => (
          <div
            key={voice.id}
            className={`
              relative p-3 rounded-xl border transition-all duration-300 group
              ${selectedVoice === voice.id 
                ? 'bg-brand-600/10 border-brand-400 shadow-[0_0_15px_rgba(77,210,208,0.1)]' 
                : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 hover:border-brand-600/50'
              }
            `}
          >
            <div className="flex items-center gap-3">
              {/* Radio Button Area - Clickable to select */}
              <div 
                className={`flex-1 flex items-center gap-3 cursor-pointer ${disabled ? 'pointer-events-none' : ''}`}
                onClick={() => !disabled && onVoiceChange(voice.id)}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                  ${selectedVoice === voice.id 
                    ? 'bg-brand-400 text-slate-900 shadow-md scale-105' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700 group-hover:border-brand-600'
                  }
                `}>
                  {voice.id.charAt(0)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${selectedVoice === voice.id ? 'text-brand-400' : 'text-slate-200'}`}>
                      {voice.id}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border uppercase tracking-wider font-semibold
                      ${selectedVoice === voice.id 
                        ? 'bg-brand-400/10 text-brand-400 border-brand-400/20' 
                        : 'bg-slate-700/50 text-slate-400 border-slate-600/50'
                      }
                    `}>
                      {voice.gender === 'Male' ? 'Masc' : 'Fem'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-medium text-slate-300">{voice.label}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                    <span className="hidden sm:inline opacity-75">{voice.description}</span>
                  </div>
                </div>
              </div>

              {/* Preview Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(voice.id);
                }}
                disabled={!!previewLoading || disabled}
                className={`
                  p-2.5 rounded-full transition-all duration-200
                  ${previewLoading === voice.id 
                    ? 'bg-brand-400/20 text-brand-400 cursor-wait'
                    : 'bg-slate-800 hover:bg-brand-400 hover:text-slate-900 text-slate-400 border border-slate-700 hover:border-brand-400'
                  }
                `}
                title="Escuchar muestra"
              >
                {previewLoading === voice.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};