import { useState, useMemo } from 'react';
import { Question, QuizSettings, Operation } from '../types';
import { OPERATION_CONFIGS } from '../utils/mathGenerator';
import {
  Trophy,
  Clock,
  Flame,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sliders,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface ResultsScreenProps {
  completedQuestions: Question[];
  totalTimeMs: number;
  maxStreak: number;
  settings: QuizSettings;
  onRestartSame: () => void;
  onRetryMistakes: (wrongQuestions: Question[]) => void;
  onNewSetup: () => void;
}

export default function ResultsScreen({
  completedQuestions,
  totalTimeMs,
  maxStreak,
  settings,
  onRestartSame,
  onRetryMistakes,
  onNewSetup,
}: ResultsScreenProps) {
  const [filterMode, setFilterMode] = useState<'all' | 'wrong' | 'correct'>('all');

  const totalAnswered = completedQuestions.length;
  const correctQuestions = completedQuestions.filter((q) => q.isCorrect);
  const wrongQuestions = completedQuestions.filter((q) => !q.isCorrect);

  const correctCount = correctQuestions.length;
  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
  const avgTimePerQuestionMs = totalAnswered > 0 ? Math.round(totalTimeMs / totalAnswered) : 0;
  const avgSeconds = (avgTimePerQuestionMs / 1000).toFixed(2);

  const formatTotalTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}m ${s}d`;
  };

  // Performance Assessment
  const performanceInfo = useMemo(() => {
    if (accuracy === 100) {
      return {
        title: 'Sempurna! Luar Biasa!',
        desc: 'Semua jawaban tepat tanpa ada kesalahan. Kecepatan dan ketepatan numerik Anda sangat tajam!',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      };
    } else if (accuracy >= 90) {
      return {
        title: 'Hebat Sekali!',
        desc: 'Ketepatan sangat tinggi. Pertahankan konsistensi dan asah terus kecepatan respon Anda.',
        badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      };
    } else if (accuracy >= 75) {
      return {
        title: 'Bagus! Terus Latihan',
        desc: 'Pemahaman numerik sudah baik. Fokus pada operasi yang masih sering keliru.',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
      };
    } else {
      return {
        title: 'Terus Semangat Berlatih',
        desc: 'Evaluasi kembali soal yang salah di bawah. Ulangi latihan dengan rentang angka yang lebih sederhana.',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      };
    }
  }, [accuracy]);

  // Breakdown by operation
  const operationStats = useMemo(() => {
    const stats: Record<
      Operation,
      { total: number; correct: number; totalTimeMs: number; symbol: string; name: string }
    > = {
      addition: { total: 0, correct: 0, totalTimeMs: 0, symbol: '+', name: 'Penambahan' },
      subtraction: { total: 0, correct: 0, totalTimeMs: 0, symbol: '−', name: 'Pengurangan' },
      multiplication: { total: 0, correct: 0, totalTimeMs: 0, symbol: '×', name: 'Perkalian' },
      division: { total: 0, correct: 0, totalTimeMs: 0, symbol: '÷', name: 'Pembagian' },
    };

    completedQuestions.forEach((q) => {
      const op = stats[q.operation];
      if (op) {
        op.total += 1;
        if (q.isCorrect) op.correct += 1;
        op.totalTimeMs += q.timeSpentMs || 0;
      }
    });

    return Object.entries(stats).filter(([_, data]) => data.total > 0);
  }, [completedQuestions]);

  // Filtered review list
  const displayQuestions = useMemo(() => {
    if (filterMode === 'wrong') return wrongQuestions;
    if (filterMode === 'correct') return correctQuestions;
    return completedQuestions;
  }, [filterMode, completedQuestions, wrongQuestions, correctQuestions]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      {/* Top Banner & Assessment */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-4 shadow-2xs">
          <Trophy className="w-8 h-8" />
        </div>

        <div className={`inline-block px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-2 ${performanceInfo.badgeClass}`}>
          {performanceInfo.title}
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
          {correctCount} / {totalAnswered} Soal Benar
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto mt-2">
          {performanceInfo.desc}
        </p>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-center">
            <div className="text-xs font-semibold text-slate-500 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Akurasi
            </div>
            <div className="font-mono-numbers text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {accuracy}%
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-center">
            <div className="text-xs font-semibold text-slate-500 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              Total Waktu
            </div>
            <div className="font-mono-numbers text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {formatTotalTime(totalTimeMs)}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-center">
            <div className="text-xs font-semibold text-slate-500 flex items-center justify-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              Rata-rata/Soal
            </div>
            <div className="font-mono-numbers text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {avgSeconds}s
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-center">
            <div className="text-xs font-semibold text-slate-500 flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Streak Rekor
            </div>
            <div className="font-mono-numbers text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">
              {maxStreak}
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {wrongQuestions.length > 0 && (
          <button
            type="button"
            id="btn-retry-mistakes"
            onClick={() => onRetryMistakes(wrongQuestions)}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-xs transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            Latih {wrongQuestions.length} Soal Salah
          </button>
        )}

        <button
          type="button"
          id="btn-restart-same"
          onClick={onRestartSame}
          className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Ulangi Latihan Ini
        </button>

        <button
          type="button"
          id="btn-new-setup"
          onClick={onNewSetup}
          className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors border border-slate-200"
        >
          <Sliders className="w-4 h-4" />
          Atur Pengaturan Baru
        </button>
      </div>

      {/* Breakdown per Operation */}
      {operationStats.length > 1 && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4">
            Analisis Berdasarkan Operasi
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {operationStats.map(([opKey, data]) => {
              const opAccuracy = Math.round((data.correct / data.total) * 100);
              const opAvgSec = data.total > 0 ? (data.totalTimeMs / data.total / 1000).toFixed(2) : '0';
              return (
                <div
                  key={opKey}
                  className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-800">{data.name}</span>
                    <span className="font-mono-numbers font-bold text-base text-indigo-600">
                      {data.symbol}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Skor:</span>
                      <span className="font-mono-numbers font-semibold text-slate-800">
                        {data.correct}/{data.total} ({opAccuracy}%)
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Rata-rata:</span>
                      <span className="font-mono-numbers font-semibold text-slate-800">
                        {opAvgSec}s / soal
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        opAccuracy >= 90
                          ? 'bg-emerald-500'
                          : opAccuracy >= 70
                          ? 'bg-indigo-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${opAccuracy}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detailed Question Review */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Review Daftar Soal</h3>
            <p className="text-xs text-slate-500">Periksa jawaban dan waktu pengerjaan setiap butir soal</p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start">
            <button
              type="button"
              id="filter-all"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterMode === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({totalAnswered})
            </button>
            <button
              type="button"
              id="filter-wrong"
              onClick={() => setFilterMode('wrong')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterMode === 'wrong'
                  ? 'bg-white text-rose-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Salah ({wrongQuestions.length})
            </button>
            <button
              type="button"
              id="filter-correct"
              onClick={() => setFilterMode('correct')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterMode === 'correct'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Benar ({correctQuestions.length})
            </button>
          </div>
        </div>

        {/* List of questions */}
        <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-1">
          {displayQuestions.map((q, idx) => (
            <div
              key={q.id || idx}
              className="py-3 flex items-center justify-between gap-4 text-sm"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400 w-6">#{q.id}</span>
                <span className="font-mono-numbers font-bold text-slate-900 text-base">
                  {q.num1} {q.symbol} {q.num2} =
                </span>
                <span className="font-mono-numbers font-semibold text-slate-700">
                  {q.correctAnswer}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* User Answer Status */}
                <div className="flex items-center gap-1.5 text-xs">
                  {q.isCorrect ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Jawaban: {q.userAnswer}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                      <XCircle className="w-3.5 h-3.5" />
                      Jawaban Anda: {q.userAnswer ?? 'Dilewati'}
                    </span>
                  )}
                </div>

                {/* Question Time */}
                {q.timeSpentMs !== undefined && (
                  <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                    {(q.timeSpentMs / 1000).toFixed(1)}s
                  </span>
                )}
              </div>
            </div>
          ))}

          {displayQuestions.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs sm:text-sm">
              Tidak ada soal pada kategori ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
