import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, ShieldCheck, MessageSquare, ArrowRight, LogIn, Heart, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-red-600 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-4 md:px-6 py-4 md:py-6 flex justify-between items-center bg-black/20 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2 md:gap-3">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="bg-red-600 p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.4)]"
          >
            <ShieldAlert className="text-white w-5 h-5 md:w-6 md:h-6" />
          </motion.div>
          <span className="font-display text-lg md:text-2xl font-bold tracking-tighter uppercase italic">PrimaPeduli</span>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <Link to="/login" className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors hidden md:block">
            Prosedur
          </Link>
          <Link to="/login">
            <Button className="bg-white text-black hover:bg-red-600 hover:text-white rounded-full px-5 md:px-8 font-bold uppercase tracking-widest text-[10px] md:text-xs h-10 md:h-12 transition-all duration-300">
              Masuk <LogIn className="ml-1.5 md:ml-2 w-3.5 h-3.5 md:w-4 md:h-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section - Editorial Style */}
      <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-red-900/10 rounded-full blur-[120px]"></div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="h-[1px] w-12 bg-red-600"></span>
              <span className="text-red-500 font-black uppercase tracking-[0.3em] text-xs">Official Platform SMK Prima Unggul</span>
            </div>
            
            <h1 className="font-display text-[clamp(3.5rem,10vw,8rem)] font-bold leading-[0.9] tracking-tighter uppercase mb-8 md:mb-12">
              Lawan <br />
              <span className="text-red-600 italic">Bullying</span> <br />
              Sekarang.
            </h1>

            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-end">
              <div className="max-w-md">
                <p className="text-base md:text-lg text-gray-400 leading-relaxed mb-8 md:mb-10 font-medium">
                  Jangan biarkan intimidasi membungkam suaramu. PrimaPeduli hadir sebagai perisai digital untuk setiap siswa SMK Prima Unggul. Aman, anonim, dan berani.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/login" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white rounded-full px-8 md:px-10 h-14 md:h-16 text-lg md:text-xl font-bold uppercase tracking-tight shadow-[0_10px_40px_rgba(220,38,38,0.3)] group">
                      Lapor Sekarang <ArrowRight className="ml-2 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="flex flex-col gap-6 md:gap-8 md:items-end">
                <div className="flex gap-8 md:gap-12">
                  <div className="text-left md:text-right">
                    <p className="text-3xl md:text-4xl font-bold text-white mb-1">100%</p>
                    <p className="text-[10px] md:text-xs uppercase tracking-widest text-red-500 font-bold">Anonimitas</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-3xl md:text-4xl font-bold text-white mb-1">24/7</p>
                    <p className="text-[10px] md:text-xs uppercase tracking-widest text-red-500 font-bold">Siaga Respon</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative Vertical Text */}
        <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 hidden xl:block">
          <p className="writing-mode-vertical text-[8px] md:text-[10px] uppercase tracking-[1em] text-white/20 font-bold rotate-180">
            SMK PRIMA UNGGUL • STOP BULLYING • PROTECT OUR STUDENTS
          </p>
        </div>
      </section>

      {/* Features - Brutalist Grid */}
      <section className="py-20 md:py-32 px-6 border-t border-white/5 bg-white text-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-0 border border-black">
            <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-black hover:bg-red-600 hover:text-white transition-colors duration-500 group">
              <Zap className="w-10 h-10 md:w-12 md:h-12 mb-6 md:mb-8 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter mb-4">Respon Kilat</h3>
              <p className="text-base md:text-lg opacity-70 font-medium">Setiap laporan masuk langsung diverifikasi oleh tim kesiswaan dalam waktu kurang dari 24 jam.</p>
            </div>
            <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-black hover:bg-red-600 hover:text-white transition-colors duration-500 group">
              <Shield className="w-10 h-10 md:w-12 md:h-12 mb-6 md:mb-8 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter mb-4">Privasi Total</h3>
              <p className="text-base md:text-lg opacity-70 font-medium">Data pelapor dienkripsi dan hanya dapat diakses oleh kepala sekolah dan tim konseling terpilih.</p>
            </div>
            <div className="p-8 md:p-12 hover:bg-red-600 hover:text-white transition-colors duration-500 group">
              <Heart className="w-10 h-10 md:w-12 md:h-12 mb-6 md:mb-8 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter mb-4">Pendampingan</h3>
              <p className="text-base md:text-lg opacity-70 font-medium">Bukan sekadar laporan, kami memberikan dukungan psikologis bagi korban hingga tuntas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Immersive */}
      <section className="py-24 md:py-40 px-6 relative overflow-hidden bg-red-600">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-5xl md:text-8xl font-bold uppercase tracking-tighter text-white mb-8 md:mb-12 leading-none">
              Jadilah <br />Pahlawan.
            </h2>
            <p className="text-lg md:text-2xl text-red-100 mb-8 md:mb-12 font-medium">
              Satu laporan darimu bisa menyelamatkan masa depan temanmu. Jangan diam, jangan takut.
            </p>
            <Link to="/login">
              <Button size="lg" className="bg-white text-red-600 hover:bg-black hover:text-white rounded-full px-10 md:px-12 h-16 md:h-20 text-xl md:text-2xl font-bold uppercase tracking-tighter transition-all duration-300">
                Mulai Beraksi
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 bg-black text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-red-600 p-1.5 rounded-lg">
                <ShieldAlert className="text-white w-5 h-5" />
              </div>
              <span className="font-display font-black text-2xl uppercase italic">PrimaPeduli</span>
            </div>
            <p className="text-gray-500 max-w-sm mb-8 font-medium">
              Inisiatif digital SMK Prima Unggul untuk menciptakan ekosistem pendidikan yang sehat dan bermartabat.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h4 className="text-xs uppercase tracking-[0.3em] font-black text-red-600 mb-6">Navigasi</h4>
              <ul className="space-y-4 text-sm font-bold text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Beranda</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Lapor</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Admin</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.3em] font-black text-red-600 mb-6">Kontak</h4>
              <ul className="space-y-4 text-sm font-bold text-gray-400">
                <li>Instagram</li>
                <li>Twitter</li>
                <li>Email Sekolah</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">
            © 2026 SMK PRIMA UNGGUL • BUILT FOR THE FUTURE
          </p>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest text-gray-600 font-bold">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
