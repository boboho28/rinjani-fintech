import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Receipt, 
  Lightbulb, 
  TrendingUp, 
  ShieldAlert, 
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { Transaction } from '../types';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  financialContext: {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpense: number;
    totalInvestment: number;
    totalDebt: number;
    totalReceivable: number;
  };
  onBatchAddTransactions?: (txs: Partial<Transaction>[]) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  financialContext,
  onBatchAddTransactions,
}) => {
  const [activeTab, setActiveTab] = useState<'advisor' | 'parser'>('advisor');
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Halo! Saya **SiKeuangan AI** (Gemini 3.6). Saya siap menganalisis kesehatan keuangan Anda, memberi strategi bebas hutang, serta mengevaluasi portofolio investasi saham Anda. Apa yang ingin Anda tanyakan hari ini?',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Parser State
  const [rawTextNote, setRawTextNote] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedResult, setParsedResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    'Bantu alokasi gajiku dengan rumus 50/30/20',
    'Bagaimana strategi melunasi hutang tercepat?',
    'Evaluasi kesehatan portofolio sahamku',
    'Saran hemat pengeluaran bulan ini',
  ];

  const handleSendMessage = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputPrompt;
    if (!promptToSend.trim() || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = { id: userMsgId, sender: 'user', text: promptToSend };
    
    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          financialContext,
        }),
      });

      const data = await response.json();
      const aiReply = data.reply || 'Maaf, gagal mendapatkan tanggapan dari AI.';

      setMessages((prev) => [
        ...prev,
        { id: `ai-${Date.now()}`, sender: 'ai', text: aiReply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: `ai-err-${Date.now()}`, sender: 'ai', text: 'Terjadi kesalahan koneksi ke server AI.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleParseText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawTextNote.trim() || isParsing) return;

    setIsParsing(true);
    setParsedResult(null);

    try {
      const response = await fetch('/api/ai/parse-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textNote: rawTextNote }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setParsedResult(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#130b20] border border-purple-500/30 rounded-2xl w-full max-w-2xl h-[85vh] flex flex-col shadow-neo-purple overflow-hidden animate-scaleUp">
        
        {/* Modal Header */}
        <div className="bg-[#1a0f30] px-6 py-4 border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-purple-700 text-white shadow-neo-purple">
              <Sparkles className="w-5 h-5 animate-pulse text-fuchsia-300" />
            </div>
            <div>
              <h3 className="font-orbitron font-bold text-base text-neon-purple flex items-center gap-2">
                <span>SiKeuangan AI Assistant</span>
                <span className="text-[10px] bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-orbitron font-semibold">
                  Gemini 3.6 Flash
                </span>
              </h3>
              <p className="text-xs text-purple-200/70 font-rajdhani font-semibold">Konsultan & Auto-Parser Keuangan Pribadi</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#130b20] hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-purple-500/20 bg-[#0d0718]">
          <button
            onClick={() => setActiveTab('advisor')}
            className={`flex-1 py-3 text-xs font-orbitron font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'advisor'
                ? 'border-purple-400 text-purple-300 bg-purple-500/10'
                : 'border-transparent text-purple-200/50 hover:text-purple-200'
            }`}
          >
            💬 Konsultasi & Strategi Keuangan
          </button>
          <button
            onClick={() => setActiveTab('parser')}
            className={`flex-1 py-3 text-xs font-orbitron font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'parser'
                ? 'border-purple-400 text-purple-300 bg-purple-500/10'
                : 'border-transparent text-purple-200/50 hover:text-purple-200'
            }`}
          >
            🧾 AI Auto-Parse Struk / Teks Transaksi
          </button>
        </div>

        {/* Modal Body */}
        {activeTab === 'advisor' ? (
          <div className="flex-1 flex flex-col justify-between overflow-hidden p-6 space-y-4">
            
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0 text-purple-400">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 text-white font-bold shadow-neo-purple'
                        : 'bg-[#1a0f30] border border-purple-500/20 text-purple-100 shadow-md whitespace-pre-wrap'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-purple-500/30 border border-purple-500/50 flex items-center justify-center shrink-0 text-purple-300">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-purple-400 text-xs py-2 font-orbitron">
                  <Loader2 className="w-4 h-4 animate-spin text-fuchsia-400" />
                  <span>SiKeuangan AI sedang merumuskan analisis...</span>
                </div>
              )}
            </div>

            {/* Quick Prompt Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {quickPrompts.map((qp) => (
                <button
                  key={qp}
                  onClick={() => handleSendMessage(qp)}
                  className="px-3 py-1 rounded-full bg-[#1a0f30] hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-orbitron font-semibold whitespace-nowrap transition-all cursor-pointer"
                >
                  {qp}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Tanyakan analisis keuangan, alokasi gaji, atau saham..."
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-[#1a0f30] border border-purple-500/30 text-white placeholder-purple-200/30 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputPrompt.trim()}
                className="bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-500 hover:to-fuchsia-400 disabled:opacity-50 text-white p-3 rounded-xl transition-all cursor-pointer shadow-neo-purple"
              >
                <Send className="w-4 h-4 font-bold" />
              </button>
            </div>

          </div>
        ) : (
          /* Auto-Parser Tab */
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="bg-purple-950/30 border border-purple-500/30 rounded-xl p-4 text-xs text-purple-200/80 space-y-1">
              <p className="font-orbitron font-bold text-purple-300 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-fuchsia-400" />
                <span>Format Teks Transaksi Bebas:</span>
              </p>
              <p className="text-[11px] text-purple-200/70">
                Ketik atau paste catatan struk belanja. Contoh: <em className="text-purple-100 font-medium">"Beli saham BBCA 5juta via Ajaib tanggal 1 agustus"</em> atau <em className="text-purple-100 font-medium">"Makan siang Bakso 35ribu pakai GoPay"</em>.
              </p>
            </div>

            <form onSubmit={handleParseText} className="space-y-3">
              <textarea
                rows={4}
                placeholder="Ketik catatan transaksi Anda di sini..."
                value={rawTextNote}
                onChange={(e) => setRawTextNote(e.target.value)}
                className="w-full bg-[#1a0f30] border border-purple-500/30 text-white placeholder-purple-200/30 rounded-xl p-3 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
              />

              <button
                type="submit"
                disabled={isParsing || !rawTextNote.trim()}
                className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 hover:from-purple-500 hover:to-fuchsia-400 text-white font-orbitron font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-neo-purple transition-all cursor-pointer"
              >
                {isParsing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-fuchsia-300" />
                    <span>Mengekstrak Data dengan AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-fuchsia-300" />
                    <span>Ekstrak Data Transaksi Otomatis</span>
                  </>
                )}
              </button>
            </form>

            {/* Parsed Result Display */}
            {parsedResult && (
              <div className="bg-[#1a0f30] border border-purple-500/40 rounded-2xl p-4 space-y-3 animate-fadeIn shadow-neo-purple">
                <div className="flex items-center justify-between text-xs text-purple-400 font-orbitron font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Hasil Ekstraksi AI Berhasil!
                  </span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full uppercase border border-purple-500/30">
                    {parsedResult.type}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-[#0d0718] p-3 rounded-xl border border-purple-500/20">
                  <div>
                    <p className="text-[10px] font-orbitron text-purple-200/60">Deskripsi</p>
                    <p className="font-bold text-white">{parsedResult.description}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-orbitron text-purple-200/60">Nominal</p>
                    <p className="font-extrabold font-mono text-neon-purple">Rp {parsedResult.amount?.toLocaleString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-orbitron text-purple-200/60">Kategori</p>
                    <p className="font-medium text-purple-100">{parsedResult.category}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-orbitron text-purple-200/60">Akun Pembayaran</p>
                    <p className="font-medium text-purple-100">{parsedResult.account}</p>
                  </div>
                </div>

                {onBatchAddTransactions && (
                  <button
                    onClick={() => {
                      onBatchAddTransactions([parsedResult]);
                      onClose();
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 hover:from-purple-500 hover:to-fuchsia-400 text-white font-orbitron font-bold text-xs py-2.5 rounded-xl shadow-neo-purple cursor-pointer transition-all"
                  >
                    Simpan Langsung ke Jurnal
                  </button>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
