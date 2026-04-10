import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, Send, Calendar, MapPin, User, Loader2, History } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Report } from '@/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';

export default function Dashboard({ user }: { user: any }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // Form state
  const [victimName, setVictimName] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Gagal memuat laporan');
    } else {
      setReports(data || []);
    }
    setFetching(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('reports').insert({
        user_id: user.id,
        reporter_name: isAnonymous ? 'Anonim' : user.email?.split('@')[0],
        victim_name: victimName,
        incident_date: incidentDate,
        location: location,
        description: description,
        status: 'pending'
      });

      if (error) throw error;

      toast.success('Laporan berhasil dikirim. Terima kasih atas keberanian Anda.');
      
      // Reset form
      setVictimName('');
      setIncidentDate('');
      setLocation('');
      setDescription('');
      
      fetchMyReports();
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengirim laporan');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Menunggu</Badge>;
      case 'in-progress': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Diproses</Badge>;
      case 'resolved': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Selesai</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout user={user}>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Report Form */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-none shadow-xl shadow-red-100/50 rounded-3xl overflow-hidden">
              <CardHeader className="bg-red-600 text-white p-8">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldAlert className="w-6 h-6 md:w-8 md:h-8" />
                  <CardTitle className="text-xl md:text-2xl font-bold">Buat Laporan Baru</CardTitle>
                </div>
                <CardDescription className="text-red-100 text-base">
                  Laporkan tindakan bullying yang Anda alami atau saksikan. Identitas Anda akan kami jaga dengan ketat.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="victim">Nama Korban</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <Input 
                          id="victim" 
                          placeholder="Nama lengkap korban" 
                          className="pl-10 h-12 rounded-xl"
                          value={victimName}
                          onChange={(e) => setVictimName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Tanggal Kejadian</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <Input 
                          id="date" 
                          type="date" 
                          className="pl-10 h-12 rounded-xl"
                          value={incidentDate}
                          onChange={(e) => setIncidentDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Lokasi Kejadian</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input 
                        id="location" 
                        placeholder="Contoh: Kantin, Kelas X-A, Lapangan" 
                        className="pl-10 h-12 rounded-xl"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Kronologi Kejadian</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Ceritakan apa yang terjadi secara detail..." 
                      className="min-h-[150px] rounded-xl p-4"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <input 
                      type="checkbox" 
                      id="anon" 
                      className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                    />
                    <Label htmlFor="anon" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Laporkan sebagai Anonim (Nama Anda tidak akan ditampilkan)
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-red-100 transition-all active:scale-[0.98]"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        Kirim Laporan <Send className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Reports Sidebar */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <History className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-lg">Riwayat Laporan</h3>
          </div>

          {fetching ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
          ) : reports.length === 0 ? (
            <Card className="border-dashed border-2 border-gray-200 bg-transparent rounded-3xl">
              <CardContent className="p-8 text-center">
                <p className="text-gray-400 text-sm">Belum ada laporan yang dikirim.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {reports.map((report, idx) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          {getStatusBadge(report.status)}
                          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                            {format(new Date(report.created_at), 'dd MMM yyyy', { locale: id })}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1 truncate">Korban: {report.victim_name}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-4">{report.description}</p>
                        
                        {report.response && (
                          <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100">
                            <p className="text-[10px] font-bold text-red-600 uppercase mb-1">Tanggapan Admin:</p>
                            <p className="text-xs text-red-800 italic">"{report.response}"</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
