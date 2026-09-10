import { TrainingHistoryItem } from '../types';
import { X, Trash2, Calendar, Clock, Trophy, TrendingUp } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: TrainingHistoryItem[];
  onClearHistory: () => void;
}

export default function HistoryModal({
  isOpen,
  onClose,
  history,
  onClearHistory,
}: HistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-2xl w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-indigo-600" />
              Riwayat Latihan Numerik
            </h3>
            <p className="text-xs text-slate-500">
              Catatan sesi latihan hitung cepat yang tersimpan
            </p>
          </div>
          <button
            type="button"
            id="btn-close-history"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto py-4 divide-y divide-slate-100 flex-1 pr-1">
          {history.length > 0 ? (
            history.map((item) => {
              const dateStr = new Date(item.date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={item.id} className="py-3.5 first:pt-0 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono-numbers font-extrabold text-base text-slate-900">
                          {item.correctCount}/{item.totalQuestions} Benar
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                            item.accuracy >= 90
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.accuracy >= 75
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.accuracy}%
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{dateStr}</span>
                        <span>•</span>
                        <span className="capitalize">
                          {item.difficultyPreset === '1-digit'
                            ? '1 Digit (1-9)'
                            : item.difficultyPreset === '2-digit'
                            ? '2 Digit (10-99)'
                            : item.difficultyPreset === 'up-to-1000'
                            ? 'Maks 1000'
                            : item.difficultyPreset === 'progressive'
                            ? 'Bertahap'
                            : 'Kustom'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-600 self-start sm:self-auto">
                      <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60 font-mono">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{Math.round(item.totalTimeMs / 1000)}s total</span>
                      </div>
                      <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60 font-mono">
                        <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                        <span>{(item.avgTimePerQuestionMs / 1000).toFixed(2)}s/soal</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              Belum ada riwayat latihan. Selesaikan satu sesi untuk melihat perkembangan Anda!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {history.length > 0 ? (
            <button
              type="button"
              id="btn-clear-history"
              onClick={onClearHistory}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Hapus Semua Riwayat
            </button>
          ) : <div />}

          <button
            type="button"
            id="btn-close-modal-footer"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
