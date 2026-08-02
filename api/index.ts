import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
app.use(express.json());

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Financial Advisor Endpoint
app.post('/api/ai/advisor', async (req, res) => {
  try {
    const { prompt, financialContext } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        reply: `⚠️ API Key Gemini belum dikonfigurasi. Berikut adalah panduan umum:
1. Alokasikan gaji Anda dengan rumus 50/30/20 (50% Kebutuhan, 30% Keinginan, 20% Tabungan/Investasi).
2. Utamakan pelunasan hutang dengan bunga tinggi terlebih dahulu.
3. Sisihkan dana darurat minimal 3-6 kali pengeluaran bulanan.`,
      });
    }

    const systemInstruction = `Anda adalah "SiKeuangan AI", seorang Konsultan & Perencana Keuangan Independen Profesional berbahasa Indonesia yang ramah, tajam, dan realistis.
Tugas Anda adalah memberikan saran keuangan berbasis data konkrit, taktik pelunasan hutang, analisis rasio portofolio investasi saham/emas, dan tips efisiensi anggaran bulanan.

Gunakan data finansial pengguna berikut jika tersedia:
- Total Saldo Kas/Bank saat ini: Rp ${financialContext?.totalBalance ?? 0}
- Total Pemasukan Bulan Ini: Rp ${financialContext?.monthlyIncome ?? 0}
- Total Pengeluaran Bulan Ini: Rp ${financialContext?.monthlyExpense ?? 0}
- Total Investasi Aktif: Rp ${financialContext?.totalInvestment ?? 0}
- Total Hutang: Rp ${financialContext?.totalDebt ?? 0}
- Total Piutang: Rp ${financialContext?.totalReceivable ?? 0}

Gunakan format Markdown yang rapi dengan bullet points, emoji yang sesuai, dan angka format Rupiah. Singkat, berbobot, dan aplikatif.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({
      success: true,
      reply: response.text ?? 'Maaf, tidak dapat menghasilkan saran saat ini.',
    });
  } catch (error: any) {
    console.error('Error in AI advisor:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Terjadi kesalahan pada server AI.',
    });
  }
});

// AI Smart Transaction Parser Endpoint
app.post('/api/ai/parse-transaction', async (req, res) => {
  try {
    const { textNote } = req.body;
    const ai = getGeminiClient();

    if (!textNote || typeof textNote !== 'string') {
      return res.status(400).json({ error: 'Text note is required' });
    }

    if (!ai) {
      const amountMatch = textNote.match(/(\d+[\d\.\,]*)/);
      const parsedAmount = amountMatch ? parseInt(amountMatch[1].replace(/[^\d]/g, ''), 10) : 50000;
      return res.json({
        success: true,
        data: {
          description: textNote.slice(0, 40),
          amount: parsedAmount,
          type: textNote.toLowerCase().includes('gaji') || textNote.toLowerCase().includes('dapat') ? 'income' : 'expense',
          category: 'Lain-lain',
          account: 'Bank BCA',
          date: new Date().toISOString().slice(0, 10),
          note: 'Parsed locally',
        },
      });
    }

    const todayStr = new Date().toISOString().slice(0, 10);

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Ekstrak data transaksi keuangan dari teks berikut: "${textNote}". Tanggal hari ini adalah ${todayStr}.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING, description: 'Nama singkat transaksi, contoh: Beli Kopi Starbucks' },
            amount: { type: Type.NUMBER, description: 'Nominal transaksi dalam angka bulat Rupiah' },
            type: { type: Type.STRING, description: 'income atau expense' },
            category: { 
              type: Type.STRING, 
              description: 'Kategori pilihan: Makanan & Minuman, Transportasi, Belanja Bulanan, Tagihan & Utilitas, Hiburan & Gaya Hidup, Investasi, Gaji & Bonus, Sampingan / Freelance, Lain-lain' 
            },
            account: { 
              type: Type.STRING, 
              description: 'Akun pembayaran pilihan: Kas / Tunai, Bank BCA, Bank Mandiri, Bank BRI, E-Wallet (GoPay/OVO/DANA), Rekening Investasi' 
            },
            date: { type: Type.STRING, description: 'Tanggal YYYY-MM-DD' },
            note: { type: Type.STRING, description: 'Catatan tambahan jika ada' },
          },
          required: ['description', 'amount', 'type', 'category', 'account', 'date'],
        },
      },
    });

    const parsedJson = JSON.parse(response.text ?? '{}');
    return res.json({
      success: true,
      data: parsedJson,
    });
  } catch (error: any) {
    console.error('Error in parse transaction:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal memproses transaksi otomatis dengan AI.',
    });
  }
});

export default app;
