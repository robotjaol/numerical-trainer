import { useState } from 'react';
import { Operation, DifficultyPreset, QuizSettings } from '../types';
import { OPERATION_CONFIGS } from '../utils/mathGenerator';
import { Check, Sparkles, Play, Sliders, Hash, Zap, HelpCircle } from 'lucide-react';

interface SetupScreenProps {
  onStart: (settings: QuizSettings) => void;
}

const QUESTION_COUNT_PRESETS = [25, 50, 100, 250, 500, 1000];

export default function SetupScreen({ onStart }: SetupScreenProps) {
  const [selectedOps, setSelectedOps] = useState<Operation[]>([
    'addition',
    'subtraction',
    'multiplication',
    'division',
  ]);
  const [questionCount, setQuestionCount] = useState<number>(50);
  const [customCountInput, setCustomCountInput] = useState<string>('50');
  const [isCustomCount, setIsCustomCount] = useState<boolean>(false);

  const [difficulty, setDifficulty] = useState<DifficultyPreset>('1-digit');
  const [customMin, setCustomMin] = useState<number>(1);
  const [customMax, setCustomMax] = useState<number>(1000);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showTimer, setShowTimer] = useState<boolean>(true);
  const [allowNegative, setAllowNegative] = useState<boolean>(false);
  const [autoAdvanceOnCorrect, setAutoAdvanceOnCorrect] = useState<boolean>(false);

  const toggleOperation = (op: Operation) => {
    if (selectedOps.includes(op)) {
      if (selectedOps.length === 1) return; // Keep at least one
      setSelectedOps(selectedOps.filter((o) => o !== op));
    } else {
      setSelectedOps([...selectedOps, op]);
    }
  };

  const selectAllOps = () => {
    setSelectedOps(['addition', 'subtraction', 'multiplication', 'division']);
  };

  const handlePresetCount = (count: number) => {
    setIsCustomCount(false);
    setQuestionCount(count);
    setCustomCountInput(count.toString());
  };

  const handleCustomCountChange = (val: string) => {
    setCustomCountInput(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed)) {
      const clamped = Math.max(5, Math.min(1000, parsed));
      setQuestionCount(clamped);
    }
  };

  const handleStart = () => {
    if (selectedOps.length === 0) return;

    const finalCount = isCustomCount
      ? Math.max(5, Math.min(1000, parseInt(customCountInput, 10) || 50))
      : questionCount;

    onStart({
      operations: selectedOps,
      questionCount: finalCount,
      difficultyPreset: difficulty,
      customMin: Math.max(1, Math.min(customMin, 1000)),
      customMax: Math.max(customMin, Math.min(customMax, 1000)),
      soundEnabled,
      showTimer,
      allowNegative,
      autoAdvanceOnCorrect,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Intro Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Numeric Reasoning Trainer
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Latihan Hitung Cepat & Penalaran Numerik
          </h2>
          <p className="text-indigo-100/90 text-sm sm:text-base leading-relaxed">
            Latih kecepatan dan ketepatan kalkulasi mental Anda. Mulai dari angka 1 digit (1-9) hingga 1000 untuk perkalian, penambahan, pengurangan, dan pembagian.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      <div className="space-y-8">
        {/* Section 1: Jenis Operasi */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600" />
                1. Pilih Operasi Hitung
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Pilih minimal satu operasi atau kombinasikan keempatnya
              </p>
            </div>
            {selectedOps.length < 4 && (
              <button
                type="button"
                id="btn-select-all-ops"
                onClick={selectAllOps}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg self-start transition-colors"
              >
                Pilih Semua (+, −, ×, ÷)
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {OPERATION_CONFIGS.map((op) => {
              const isSelected = selectedOps.includes(op.id);
              return (
                <button
                  key={op.id}
                  type="button"
                  id={`btn-op-${op.id}`}
                  onClick={() => toggleOperation(op.id)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 text-slate-900 shadow-xs ring-1 ring-indigo-600/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className="font-mono-numbers text-2xl font-bold text-indigo-600">
                      {op.symbol}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-indigo-600 text-white' : 'border border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">{op.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {op.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Jumlah Soal (50, 100, s.d. 1000) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
          <div className="mb-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Hash className="w-5 h-5 text-indigo-600" />
              2. Jumlah Soal (Hingga 1000 Soal)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Pilih jumlah soal yang ingin dilatih (tersedia opsi 50, 100, hingga maksimal 1000 soal)
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 mb-4">
            {QUESTION_COUNT_PRESETS.map((count) => {
              const active = !isCustomCount && questionCount === count;
              return (
                <button
                  key={count}
                  type="button"
                  id={`btn-preset-count-${count}`}
                  onClick={() => handlePresetCount(count)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                  }`}
                >
                  {count} Soal
                </button>
              );
            })}

            <button
              type="button"
              id="btn-custom-count-toggle"
              onClick={() => setIsCustomCount(true)}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                isCustomCount
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
              }`}
            >
              Kustom
            </button>
          </div>

          {isCustomCount && (
            <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <label htmlFor="custom-count-input" className="text-xs sm:text-sm font-semibold text-slate-700">
                Masukkan Jumlah Soal (5 - 1000):
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="custom-count-input"
                  type="number"
                  min={5}
                  max={1000}
                  step={5}
                  value={customCountInput}
                  onChange={(e) => handleCustomCountChange(e.target.value)}
                  className="w-32 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono-numbers font-bold text-base focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
                <span className="text-xs text-slate-500 font-medium">Soal</span>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Rentang Angka & Tingkat Kesulitan */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
          <div className="mb-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-600" />
              3. Rentang Angka (1 Digit s.d. 1000)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Tentukan batasan angka soal sesuai tingkat kemampuan Anda
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {/* 1-Digit */}
            <button
              type="button"
              id="btn-diff-1digit"
              onClick={() => setDifficulty('1-digit')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                difficulty === '1-digit'
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  Dasar / Cepat
                </span>
                {difficulty === '1-digit' && <Check className="w-4 h-4 text-indigo-600" />}
              </div>
              <div className="font-bold text-slate-900 text-base mt-2">1 Digit (1 - 9)</div>
              <div className="text-xs text-slate-500 mt-1">
                Kalkulasi kilat 1 digit. Cocok untuk mengasah refleks mental dasar.
              </div>
            </button>

            {/* 2-Digit */}
            <button
              type="button"
              id="btn-diff-2digit"
              onClick={() => setDifficulty('2-digit')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                difficulty === '2-digit'
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  Menengah
                </span>
                {difficulty === '2-digit' && <Check className="w-4 h-4 text-indigo-600" />}
              </div>
              <div className="font-bold text-slate-900 text-base mt-2">2 Digit (10 - 99)</div>
              <div className="text-xs text-slate-500 mt-1">
                Puluhan. Melatih pemecahan angka & retensi memori kerja.
              </div>
            </button>

            {/* Up to 1000 */}
            <button
              type="button"
              id="btn-diff-up1000"
              onClick={() => setDifficulty('up-to-1000')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                difficulty === 'up-to-1000'
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  Tantangan Maksimal
                </span>
                {difficulty === 'up-to-1000' && <Check className="w-4 h-4 text-indigo-600" />}
              </div>
              <div className="font-bold text-slate-900 text-base mt-2">Hingga 1000</div>
              <div className="text-xs text-slate-500 mt-1">
                Ratusan hingga 1000. Untuk latihan penalaran psikotes & tes kerja.
              </div>
            </button>

            {/* Progressive Mode */}
            <button
              type="button"
              id="btn-diff-progressive"
              onClick={() => setDifficulty('progressive')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                difficulty === 'progressive'
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  Bertahap
                </span>
                {difficulty === 'progressive' && <Check className="w-4 h-4 text-indigo-600" />}
              </div>
              <div className="font-bold text-slate-900 text-base mt-2">1 Digit → 1000</div>
              <div className="text-xs text-slate-500 mt-1">
                Dimulai dari angka 1-9 lalu bertahap naik hingga 1000 seiring nomor soal.
              </div>
            </button>
          </div>

          {/* Custom Range Settings */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              id="btn-diff-custom"
              onClick={() => setDifficulty('custom')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                difficulty === 'custom'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Atur Nilai Min & Max Kustom
            </button>

            {difficulty === 'custom' && (
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-700 ml-2">
                <div className="flex items-center gap-1.5">
                  <label htmlFor="input-custom-min" className="font-medium text-slate-600">Min:</label>
                  <input
                    id="input-custom-min"
                    type="number"
                    min={1}
                    max={customMax}
                    value={customMin}
                    onChange={(e) => setCustomMin(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-20 px-2 py-1 bg-white border border-slate-300 rounded font-mono-numbers text-xs"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <label htmlFor="input-custom-max" className="font-medium text-slate-600">Max:</label>
                  <input
                    id="input-custom-max"
                    type="number"
                    min={customMin}
                    max={1000}
                    value={customMax}
                    onChange={(e) => setCustomMax(Math.min(1000, parseInt(e.target.value, 10) || 1000))}
                    className="w-20 px-2 py-1 bg-white border border-slate-300 rounded font-mono-numbers text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Preferensi Tambahan */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            4. Opsi & Preferensi
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                id="checkbox-show-timer"
                checked={showTimer}
                onChange={(e) => setShowTimer(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <div>
                <div className="text-sm font-semibold text-slate-800">Tampilkan Stopwatch / Timer</div>
                <div className="text-xs text-slate-500">Hitung total waktu dan kecepatan rata-rata per soal</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                id="checkbox-sound"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <div>
                <div className="text-sm font-semibold text-slate-800">Efek Suara (Audio Feedback)</div>
                <div className="text-xs text-slate-500">Suara nada respons saat jawaban benar atau salah</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                id="checkbox-auto-advance"
                checked={autoAdvanceOnCorrect}
                onChange={(e) => setAutoAdvanceOnCorrect(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <div>
                <div className="text-sm font-semibold text-slate-800">Lanjut Otomatis (Auto-Advance)</div>
                <div className="text-xs text-slate-500">Langsung pindah ke soal berikutnya tanpa harus menekan Enter saat jawaban benar</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                id="checkbox-allow-negative"
                checked={allowNegative}
                onChange={(e) => setAllowNegative(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <div>
                <div className="text-sm font-semibold text-slate-800">Izinkan Hasil Negatif</div>
                <div className="text-xs text-slate-500">Default: Pengurangan selalu bernilai positif/nol (a ≥ b)</div>
              </div>
            </label>
          </div>
        </div>

        {/* Start Button & Summary */}
        <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-500">
              Konfigurasi Latihan:
            </div>
            <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
              {isCustomCount ? customCountInput : questionCount} Soal •{' '}
              {difficulty === '1-digit'
                ? '1 Digit (1-9)'
                : difficulty === '2-digit'
                ? '2 Digit (10-99)'
                : difficulty === 'up-to-1000'
                ? 'Hingga 1000'
                : difficulty === 'progressive'
                ? 'Bertahap (1-9 s.d. 1000)'
                : `Kustom (${customMin}-${customMax})`}{' '}
              • {selectedOps.length} Operasi
            </div>
          </div>

          <button
            type="button"
            id="btn-start-quiz"
            onClick={handleStart}
            disabled={selectedOps.length === 0}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base sm:text-lg shadow-md hover:shadow-indigo-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            <Play className="w-5 h-5 fill-current" />
            Mulai Latihan Sekarang
          </button>
        </div>

        {/* Helpful Tips Card */}
        <div className="bg-slate-100/80 rounded-xl p-4 text-xs text-slate-600 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-700">Tips Latihan Kecepatan:</span>{' '}
            Gunakan keyboard fisik (numpad atau baris angka atas) untuk mengetik secepat mungkin, lalu tekan <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[11px] shadow-2xs">Enter</kbd>. Anda juga dapat menggunakan tombol kalkulator virtual di layar jika menggunakan perangkat sentuh/HP.
          </div>
        </div>
      </div>
    </div>
  );
}
