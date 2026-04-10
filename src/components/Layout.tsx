import { ReactNode } from 'react';
import { ShieldAlert, LogOut, LayoutDashboard, FileText, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Link, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface LayoutProps {
  children: ReactNode;
  user: any;
  isAdmin?: boolean;
}

export default function Layout({ children, user, isAdmin = false }: LayoutProps) {
  const location = useLocation();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error('Gagal keluar');
    else toast.success('Berhasil keluar');
  };

  const navItems = isAdmin 
    ? [
        { label: 'Overview', icon: LayoutDashboard, path: '/admin' },
        { label: 'Semua Laporan', icon: FileText, path: '/admin/reports' },
      ]
    : [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { label: 'Laporan Saya', icon: FileText, path: '/dashboard/my-reports' },
      ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-red-600 p-1.5 rounded-lg">
              <ShieldAlert className="text-white w-5 h-5" />
            </div>
            <span className="font-display font-bold text-base md:text-lg">PrimaPeduli</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button 
                variant={location.pathname === item.path ? 'secondary' : 'ghost'} 
                className={`w-full justify-start gap-3 rounded-xl h-11 ${location.pathname === item.path ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'text-gray-500'}`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2 mb-4">
            <Avatar className="h-10 w-10 border-2 border-red-100">
              <AvatarFallback className="bg-red-600 text-white uppercase">
                {user.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{user.email?.split('@')[0]}</p>
              <p className="text-xs text-gray-500 truncate">{isAdmin ? 'Administrator' : 'Siswa'}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30">
          <h2 className="font-bold text-gray-900 md:hidden flex items-center gap-2">
             <ShieldAlert className="text-red-600 w-5 h-5" /> PrimaPeduli
          </h2>
          <div className="hidden md:block">
            <p className="text-sm text-gray-500">Selamat datang kembali,</p>
            <p className="font-bold text-gray-900">{user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full md:hidden" onClick={handleLogout}>
              <LogOut className="w-5 h-5 text-red-600" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
