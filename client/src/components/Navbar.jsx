import { Link, useNavigate } from 'react-router-dom';
import { Zap, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { admin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center group-hover:bg-brand-500 transition-colors">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-100 hidden sm:block">LeadAI</span>
        </Link>

        {/* Nav links + actions */}
        <div className="flex items-center gap-2">
          {admin ? (
            <>
              <Link to="/dashboard" className="btn-ghost text-sm flex items-center gap-1.5 hidden sm:flex">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <span className="text-slate-600 text-sm hidden sm:block">
                {admin.name}
              </span>
              <button onClick={handleLogout} className="btn-ghost text-sm flex items-center gap-1.5">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary text-sm">Admin Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
