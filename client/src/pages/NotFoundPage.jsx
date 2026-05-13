import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center text-center p-6">
    <div>
      <p className="text-8xl font-bold text-brand-500/30 mb-4">404</p>
      <h1 className="text-2xl font-bold text-slate-200 mb-2">Page Not Found</h1>
      <p className="text-slate-500 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary inline-flex items-center gap-2">
        <Home className="w-4 h-4" /> Go Home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
