import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldAlert, 
  Loader2, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MessageSquare,
  ChevronRight,
  User,
  Calendar
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Report, ReportStatus } from '@/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminDashboard({ user }: { user: any }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [fetching, setFetching] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [response, setResponse] = useState('');
  const [updating, setUpdating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchReports();
    
    // Subscribe to real-time changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reports' },
        (payload) => {
          toast.info('Ada laporan baru masuk!');
          setReports(prev => [payload.new as Report, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchReports = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Gagal memuat semua laporan');
    } else {
      setReports(data || []);
    }
    setFetching(false);
  };

  const handleUpdateStatus = async (reportId: string, status: ReportStatus) => {
    setUpdating(true);
    const { error } = await supabase
      .from('reports')
      .update({ status })
      .eq('id', reportId);

    if (error) {
      toast.error('Gagal memperbarui status');
    } else {
      toast.success(`Status diperbarui menjadi ${status}`);
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status } : r));
      if (selectedReport?.id === reportId) {
        setSelectedReport(prev => prev ? { ...prev, status } : null);
      }
    }
    setUpdating(false);
  };

  const handleSendResponse = async () => {
    if (!selectedReport) return;
    setUpdating(true);
    
    const { error } = await supabase
      .from('reports')
      .update({ response, status: 'in-progress' })
      .eq('id', selectedReport.id);

    if (error) {
      toast.error('Gagal mengirim tanggapan');
    } else {
      toast.success('Tanggapan berhasil dikirim');
      setReports(prev => prev.map(r => r.id === selectedReport.id ? { ...r, response, status: 'in-progress' } : r));
      setIsDialogOpen(false);
      setResponse('');
    }
    setUpdating(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'in-progress': return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case 'resolved': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 gap-1.5">{getStatusIcon(status)} Menunggu</Badge>;
      case 'in-progress': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1.5">{getStatusIcon(status)} Diproses</Badge>;
      case 'resolved': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1.5">{getStatusIcon(status)} Selesai</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout user={user} isAdmin>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm rounded-3xl bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-yellow-100 p-4 rounded-2xl">
                <Clock className="text-yellow-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Menunggu</p>
                <p className="text-2xl font-bold text-gray-900">{reports.filter(r => r.status === 'pending').length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-3xl bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-blue-100 p-4 rounded-2xl">
                <AlertCircle className="text-blue-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Diproses</p>
                <p className="text-2xl font-bold text-gray-900">{reports.filter(r => r.status === 'in-progress').length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-3xl bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-green-100 p-4 rounded-2xl">
                <CheckCircle2 className="text-green-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Selesai</p>
                <p className="text-2xl font-bold text-gray-900">{reports.filter(r => r.status === 'resolved').length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports Table/List */}
        <Card className="border-none shadow-xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white">
          <CardHeader className="border-b border-gray-50 p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl md:text-2xl font-bold">Daftar Laporan Masuk</CardTitle>
                <CardDescription>Kelola dan tindak lanjuti laporan bullying dari siswa</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Cari laporan..." 
                    className="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-red-500 w-full md:w-64"
                  />
                </div>
                <Button variant="outline" size="icon" className="rounded-xl border-gray-200">
                  <Filter className="w-4 h-4 text-gray-500" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {fetching ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-red-600" />
              </div>
            ) : reports.length === 0 ? (
              <div className="py-20 text-center">
                <ShieldAlert className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400">Belum ada laporan yang masuk.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {reports.map((report) => (
                  <div 
                    key={report.id} 
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group"
                    onClick={() => {
                      setSelectedReport(report);
                      setResponse(report.response || '');
                      setIsDialogOpen(true);
                    }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                          report.status === 'pending' ? 'bg-yellow-50' : 
                          report.status === 'in-progress' ? 'bg-blue-50' : 'bg-green-50'
                        }`}>
                          <ShieldAlert className={`w-6 h-6 ${
                            report.status === 'pending' ? 'text-yellow-600' : 
                            report.status === 'in-progress' ? 'text-blue-600' : 'text-green-600'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-gray-900 truncate">Korban: {report.victim_name}</h4>
                            {getStatusBadge(report.status)}
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-1">{report.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                              <User className="w-3 h-3" /> Pelapor: {report.reporter_name}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {format(new Date(report.created_at), 'dd MMM yyyy HH:mm', { locale: id })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Report Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          {selectedReport && (
            <>
              <DialogHeader className="bg-red-600 text-white p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <DialogTitle className="font-display text-xl md:text-2xl font-bold mb-1">Detail Laporan</DialogTitle>
                    <DialogDescription className="text-red-100">
                      ID Laporan: {selectedReport.id.slice(0, 8)}
                    </DialogDescription>
                  </div>
                  {getStatusBadge(selectedReport.status)}
                </div>
              </DialogHeader>
              <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Korban</p>
                    <p className="font-bold text-gray-900">{selectedReport.victim_name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pelapor</p>
                    <p className="font-bold text-gray-900">{selectedReport.reporter_name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tanggal Kejadian</p>
                    <p className="font-bold text-gray-900">{format(new Date(selectedReport.incident_date), 'dd MMMM yyyy', { locale: id })}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lokasi</p>
                    <p className="font-bold text-gray-900">{selectedReport.location}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kronologi</p>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm leading-relaxed text-gray-700">
                    {selectedReport.description}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-red-600" />
                    <h5 className="font-bold">Berikan Tanggapan</h5>
                  </div>
                  <Textarea 
                    placeholder="Tulis tanggapan atau langkah yang akan diambil..." 
                    className="min-h-[120px] rounded-2xl p-4 border-gray-200 focus:ring-red-500"
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter className="p-8 bg-gray-50 border-t border-gray-100 flex-col sm:flex-row gap-3">
                <div className="flex gap-2 mr-auto">
                  <Button 
                    variant="outline" 
                    className="rounded-xl border-green-200 text-green-700 hover:bg-green-50"
                    onClick={() => handleUpdateStatus(selectedReport.id, 'resolved')}
                    disabled={updating}
                  >
                    Tandai Selesai
                  </Button>
                  <Button 
                    variant="outline" 
                    className="rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => handleUpdateStatus(selectedReport.id, 'in-progress')}
                    disabled={updating}
                  >
                    Sedang Diproses
                  </Button>
                </div>
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-8"
                  onClick={handleSendResponse}
                  disabled={updating || !response}
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Kirim Tanggapan'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
