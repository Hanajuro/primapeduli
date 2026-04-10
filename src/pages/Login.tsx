import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Mail, Lock, ArrowRight, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegistering) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName || email.split('@')[0],
            }
          }
        });
        if (error) throw error;
        toast.success('Registrasi berhasil! Silakan cek email untuk verifikasi.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Selamat datang kembali!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan saat autentikasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-red-600 p-2 rounded-xl shadow-lg shadow-red-200">
              <ShieldAlert className="text-white w-8 h-8" />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-gray-900">PrimaPeduli</span>
          </Link>
        </div>

        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-white pb-2">
            <CardTitle className="text-xl md:text-2xl font-bold text-center">
              {isRegistering ? 'Buat Akun Baru' : 'Masuk ke Akun'}
            </CardTitle>
            <CardDescription className="text-center">
              {isRegistering 
                ? 'Daftar untuk mulai melaporkan tindakan bullying' 
                : 'Silakan masukkan kredensial Anda untuk melanjutkan'}
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white p-8">
            <form onSubmit={handleAuth} className="space-y-6">
              {isRegistering && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nama Lengkap</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input 
                      id="fullName" 
                      type="text" 
                      placeholder="Masukkan nama lengkap Anda" 
                      className="pl-10 h-12 rounded-xl border-gray-200 focus:ring-red-500 focus:border-red-500"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={isRegistering}
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email Sekolah</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="nama@smkprimaunggul.sch.id" 
                    className="pl-10 h-12 rounded-xl border-gray-200 focus:ring-red-500 focus:border-red-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Kata Sandi</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 h-12 rounded-xl border-gray-200 focus:ring-red-500 focus:border-red-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-lg shadow-red-100 transition-all active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    {isRegistering ? 'Daftar Sekarang' : 'Masuk Sekarang'} 
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                {isRegistering ? 'Sudah punya akun?' : 'Belum punya akun?'}
                <button 
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="ml-2 text-red-600 font-bold hover:underline"
                >
                  {isRegistering ? 'Masuk di sini' : 'Daftar di sini'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <p className="mt-8 text-center text-xs text-gray-400">
          Dengan masuk, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi SMK Prima Unggul.
        </p>
      </motion.div>
    </div>
  );
}
