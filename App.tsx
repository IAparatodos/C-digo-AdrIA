import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { VoiceSelector } from './components/VoiceSelector';
import { AudioPlayer } from './components/AudioPlayer';
import { generateSpeech } from './services/geminiService';
import { base64ToUint8Array, pcmToAudioBuffer, audioBufferToWav } from './utils/audio';
import { VoiceName } from './types';
import { Wand2, AlertCircle, MessageSquare, RefreshCw } from 'lucide-react';

const DEFAULT_TEXT = "Hola, soy la voz de Gemini. Puedo leer cualquier texto que escribas aquí con una entonación natural y clara. ¡Pruébame!";

function App() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [voice, setVoice] = useState<VoiceName>(VoiceName.Puck);
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState<VoiceName | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Ref for preview audio to stop it if needed
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError("Por favor ingresa algún texto para generar audio.");
      return;
    }
    
    setLoading(true);
    setError(null);
    // Note: We don't clear audioUrl here immediately to avoid UI jump, 
    // but we will replace it upon success.

    try {
      const base64Data = await generateSpeech(text, voice);
      const pcmData = base64ToUint8Array(base64Data);
      const audioBuffer = await pcmToAudioBuffer(pcmData);
      const wavBlob = audioBufferToWav(audioBuffer);
      const url = URL.createObjectURL(wavBlob);
      
      // Revoke old URL if it exists to avoid memory leaks
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      
      setAudioUrl(url);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado al generar el audio.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (previewVoice: VoiceName) => {
    if (previewLoading || loading) return;
    
    // Stop any playing preview
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }

    setPreviewLoading(previewVoice);
    try {
      const previewText = "Hola, esta es una prueba de mi voz en español.";
      const base64Data = await generateSpeech(previewText, previewVoice);
      const pcmData = base64ToUint8Array(base64Data);
      const audioBuffer = await pcmToAudioBuffer(pcmData);
      const wavBlob = audioBufferToWav(audioBuffer);
      const url = URL.createObjectURL(wavBlob);

      const audio = new Audio(url);
      previewAudioRef.current = audio;
      audio.onended = () => {
        URL.revokeObjectURL(url);
        setPreviewLoading(null);
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        setPreviewLoading(null);
      };
      await audio.play();
    } catch (err) {
      console.error("Preview failed", err);
      setPreviewLoading(null);
    }
  };

  const handleReset = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-brand-400/30 selection:text-white">
      <Header />

      <main className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
        <div className="flex flex-col gap-8">
          
          {/* Intro Section */}
          <div className="text-center space-y-4 mb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Generador de Voz <span className="text-brand-400">IA</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">
              Transforma tu texto en voz realista al instante utilizando el modelo multimodal más avanzado de Google.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Controls */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Text Input Area */}
              <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-1 shadow-lg overflow-hidden group focus-within:ring-2 focus-within:ring-brand-400/50 transition-all">
                <div className="bg-slate-900/50 px-4 py-3 border-b border-slate-700/50 flex justify-between items-center">
                  <label htmlFor="tts-input" className="text-sm font-semibold text-brand-400 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Entrada de Texto
                  </label>
                  <span className="text-xs text-slate-500 font-medium">{text.length} caracteres</span>
                </div>
                <textarea
                  id="tts-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Escribe algo aquí para convertirlo a voz..."
                  className="w-full h-48 bg-transparent text-slate-200 p-4 resize-none outline-none placeholder:text-slate-600 leading-relaxed text-lg"
                  disabled={loading}
                />
              </div>

              {/* Voice Selection */}
              <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-6">
                <VoiceSelector 
                  selectedVoice={voice} 
                  onVoiceChange={setVoice} 
                  onPreview={handlePreview}
                  previewLoading={previewLoading}
                  disabled={loading}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleGenerate}
                disabled={loading || !text.trim()}
                className={`
                  w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300
                  ${loading 
                    ? 'bg-slate-700 text-slate-400 cursor-wait' 
                    : audioUrl 
                      ? 'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white shadow-lg shadow-brand-600/20'
                      : 'bg-gradient-to-r from-brand-600 to-brand-400 hover:from-brand-500 hover:to-brand-300 text-white shadow-lg shadow-brand-400/20'
                  }
                  hover:scale-[1.01] active:scale-[0.99]
                  disabled:opacity-70 disabled:cursor-not-allowed
                `}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{audioUrl ? 'Regenerando...' : 'Generando Audio...'}</span>
                  </>
                ) : (
                  <>
                    {audioUrl ? <RefreshCw className="w-5 h-5" /> : <Wand2 className="w-5 h-5" />}
                    <span>{audioUrl ? 'Regenerar Voz' : 'Generar Voz'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Right Column: Output / Info */}
            <div className="flex flex-col gap-6">
              {audioUrl ? (
                <AudioPlayer audioUrl={audioUrl} onReset={handleReset} />
              ) : (
                <div className="h-full min-h-[300px] bg-slate-800/20 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center text-slate-500 border-dashed border-2">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Wand2 className="w-8 h-8 opacity-40 text-brand-600" />
                  </div>
                  <h3 className="text-slate-300 font-semibold mb-2">Esperando generación</h3>
                  <p className="text-sm max-w-[200px] leading-relaxed">Selecciona una voz y escribe tu texto para escuchar la magia de Gemini.</p>
                </div>
              )}

              <div className="bg-brand-900/20 border border-brand-600/20 rounded-xl p-5">
                <h4 className="text-brand-400 font-bold text-sm mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-400" />
                  Consejo Pro
                </h4>
                <p className="text-brand-100/70 text-xs leading-relaxed">
                  Las voces <strong>Puck</strong> y <strong>Zephyr</strong> suelen tener una entonación más neutra y clara, ideales para contenido educativo o narraciones largas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;