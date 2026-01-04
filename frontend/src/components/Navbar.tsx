import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Nu afișăm Navbar-ul pe vizualizarea de student (cele 4 cadrane) 
  // pentru a respecta cerința de interfață full-screen.
  if (location.pathname.startsWith("/session/")) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shadow-sm sticky top-0 z-50">
      <Link to="/home" className="flex items-center gap-2">
        <div className="bg-indigo-600 p-1.5 rounded-lg">
          <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45"></div>
        </div>
        <span className="font-black text-xl tracking-tighter text-slate-800">
          STUDY<span className="text-indigo-600">FLOW</span>
        </span>
      </Link>

      <div className="flex items-center gap-6">
        {token ? (
          <>
            <Link 
              to="/teacher" 
              className={`flex items-center gap-2 font-bold text-sm transition-colors ${
                location.pathname === "/teacher" ? "text-indigo-600" : "text-slate-500 hover:text-indigo-600"
              }`}
            >
              <LayoutDashboard size={18} /> DASHBOARD
            </Link>
            
            <div className="h-6 w-1px bg-slate-200"></div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-500 hover:text-red-600 font-bold text-sm transition-colors"
            >
              <LogOut size={18} /> IEȘIRE
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            {/* Buton LOG IN - Stil "Ghost/Outline" */}
            <Link 
              to="/login" 
              className="px-5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-all active:scale-95 border border-transparent hover:border-slate-200"
            >
              LOG IN
            </Link>

            {/* Buton ÎNREGISTRARE - Stil "Primary" */}
            <Link 
              to="/register" 
              className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-100 active:scale-95 flex items-center gap-2"
            >
              ÎNREGISTRARE
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;