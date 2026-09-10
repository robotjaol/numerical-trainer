import { Calculator, Volume2, VolumeX, History, Home, Pause, Play } from 'lucide-react';

interface HeaderProps {
  isPlaying: boolean;
  isPaused: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHistory: () => void;
  onTogglePause?: () => void;
  onExitToHome?: () => void;
}

export default function Header({
  isPlaying,
  isPaused,
  soundEnabled,
  onToggleSound,
  onOpenHistory,
  onTogglePause,
  onExitToHome,
}: HeaderProps) {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onExitToHome}
          className={`flex items-center gap-2.5 ${isPlaying ? 'cursor-pointer hover:opacity-80' : ''} transition-opacity`}
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight">
              Latihan Penalaran Numerik
            </h1>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              Asah kecepatan hitung 1 digit hingga 1000
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {isPlaying && (
            <>
              {onTogglePause && (
                <button
                  type="button"
                  id="btn-header-pause"
                  onClick={onTogglePause}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  title={isPaused ? "Lanjutkan" : "Jeda (Esc)"}
                >
                  {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{isPaused ? 'Lanjut' : 'Jeda'}</span>
                </button>
              )}

              {onExitToHome && (
                <button
                  type="button"
                  id="btn-header-home"
                  onClick={onExitToHome}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                  title="Kembali ke Menu Awal"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Berhenti</span>
                </button>
              )}
            </>
          )}

          {/* Sound Toggle */}
          <button
            type="button"
            id="btn-sound-toggle"
            onClick={onToggleSound}
            className={`p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors ${
              !soundEnabled ? 'text-slate-400' : 'text-indigo-600'
            }`}
            title={soundEnabled ? 'Matikan Suara' : 'Aktifkan Suara'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* History Button */}
          {!isPlaying && (
            <button
              type="button"
              id="btn-open-history"
              onClick={onOpenHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Lihat Riwayat Latihan"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Riwayat</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
