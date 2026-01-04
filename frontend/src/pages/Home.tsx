import { useNavigate } from "react-router-dom";
import { UserCircle, GraduationCap, LogIn, UserPlus } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col bg-slate-900 overflow-hidden relative">
      {/* 2. CONȚINUTUL CENTRAL */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="mb-12 text-center">
            <h1 className="text-5xl font-black text-white mb-2 tracking-tighter italic">
                STUDY<span className="text-indigo-500">FLOW</span>
            </h1>
            <p className="text-slate-400 font-medium">Sistem de feedback în timp real pentru educație modernă</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
          {/* Card STUDENT */}
          <div 
            onClick={() => navigate("/join")} 
            className="group flex-1 p-10 bg-indigo-600 rounded-[2.5rem] cursor-pointer hover:bg-indigo-500 hover:scale-[1.02] transition-all text-white border-b-8 border-indigo-800 flex flex-col items-center text-center gap-4 shadow-2xl"
          >
            <div className="p-4 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
                <GraduationCap size={48} />
            </div>
            <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">Sunt STUDENT</h2>
                <p className="text-indigo-100 text-sm mt-2 opacity-80">Introdu codul și oferă feedback live</p>
            </div>
          </div>

          {/* Card PROFESOR */}
          <div 
            onClick={() => navigate("/login")} 
            className="group flex-1 p-10 bg-slate-100 rounded-[2.5rem] cursor-pointer hover:bg-white hover:scale-[1.02] transition-all text-slate-900 border-b-8 border-slate-300 flex flex-col items-center text-center gap-4 shadow-2xl"
          >
            <div className="p-4 bg-slate-200 rounded-full group-hover:scale-110 transition-transform">
                <UserCircle size={48} />
            </div>
            <div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-slate-800">Sunt PROFESOR</h2>
                <p className="text-slate-500 text-sm mt-2 font-medium">Gestionează cursul și vezi statistici</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer discret */}
      <div className="p-8 text-center text-slate-600 text-xs font-medium uppercase tracking-widest">
        © 2025 StudyFlow Platform • Real-time Academic Analytics
      </div>
    </div>
  );
};

export default Home;