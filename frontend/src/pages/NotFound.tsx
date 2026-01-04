import { useNavigate } from "react-router-dom";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

interface NotFoundProps {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
}

const NotFound = ({ 
  title = "Pagina nu a fost găsită", 
  message = "Ne pare rău, dar resursa pe care o cauți nu există sau a fost mutată.",
  showHomeButton = true 
}: NotFoundProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-sm border border-slate-200 text-center animate-in fade-in zoom-in duration-300">
        <div className="bg-rose-100 text-rose-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={40} />
        </div>
        
        <h1 className="text-2xl font-black text-slate-800 mb-2">{title}</h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          {message}
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center gap-2 bg-white text-slate-700 py-4 rounded-2xl font-bold border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
          >
            <ArrowLeft size={18} /> ÎNAPOI
          </button>
          
          {showHomeButton && (
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
            >
              <Home size={18} /> ACASĂ
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;