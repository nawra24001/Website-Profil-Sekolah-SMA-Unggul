/* ════════════════════════════════════════════════════════════════
   KONFIGURASI SUPABASE
   Ganti dua nilai di bawah ini dengan punya Anda.
   Lihat panduan lengkap di file PANDUAN-SUPABASE.md
   ════════════════════════════════════════════════════════════════ */

const SUPABASE_URL = 'https://xxxxxxxxxxxxxxxxx.supabase.co';   // <- ganti dengan Project URL Anda
const SUPABASE_ANON_KEY = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // <- ganti dengan anon public key Anda

/* Jangan ubah baris di bawah ini */
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
