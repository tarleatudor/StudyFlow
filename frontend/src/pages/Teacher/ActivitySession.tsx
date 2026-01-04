import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axiosInstance from "../../api/axiosInstance";
import { ArrowLeft, Users, MessageSquare } from "lucide-react";
import NotFound from "../NotFound";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  upgrade: false,
});

const ActivitySession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [activityTitle, setActivityTitle] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [isNotFound, setIsNotFound] = useState(false);

  // 1. Calculăm statisticile live direct din lista de feedback-uri
  const stats = useMemo(() => {
    const counts: any = {
      HAPPY: 0,
      FROWNY: 0,
      SURPRISED: 0,
      CONFUSED: 0,
      TOTAL: 0,
    };
    feedbacks.forEach((f) => {
      if (counts[f.emojiType] !== undefined) {
        counts[f.emojiType]++;
        counts.TOTAL++;
      }
    });
    return counts;
  }, [feedbacks]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const actRes = await axiosInstance.get(`/activities/find/${id}`);

        if (actRes.data.success && actRes.data.data) {
          setActivityTitle(actRes.data.data.title);
          setAccessCode(actRes.data.data.code);
          setIsNotFound(false);
        }

        const feedRes = await axiosInstance.get(`/feedback/stats/${id}`);
        setFeedbacks(feedRes.data.data);
      } catch (err: any) {
        // Dacă backend-ul întoarce 404
        if (err.response?.status === 404) {
          setIsNotFound(true);
        }
        console.error("Eroare la încărcarea datelor:", err);
      }
    };

    if (id) {
      loadInitialData();

      // IMPORTANT: Verifică dacă socket-ul e conectat
      socket.emit("join_activity", id);

      // Listener pentru feedback-ul nou
      socket.on("new_feedback", (data) => {
        console.log("Feedback primit:", data); // Debugging
        // Folosim funcția de update pentru a fi siguri că avem starea cea mai nouă
        setFeedbacks((prev) => {
          // Evităm duplicatele dacă socket-ul trimite de două ori
          if (prev.find((f) => f.id === data.id)) return prev;
          return [data, ...prev];
        });
      });
    }

    return () => {
      socket.off("new_feedback");
      socket.emit("leave_activity", id);
    };
  }, [id]);
  if (isNotFound) {
    return (
      <NotFound
        title="Activitate inexistentă"
        message={`Sesiunea #${id} nu a putut fi găsită. Verifică dacă ID-ul este corect sau dacă activitatea a fost ștearsă.`}
      />
    );
  }

  const getWidth = (type: string) => {
    if (stats.TOTAL === 0) return "0%";
    return `${(stats[type] / stats.TOTAL) * 100}%`;
  };

  const FEEDBACK_CONFIG = [
    { type: "HAPPY", label: "Înțeleg", color: "bg-emerald-500", emoji: "😊" },
    { type: "FROWNY", label: "Nu înțeleg", color: "bg-rose-500", emoji: "☹️" },
    {
      type: "SURPRISED",
      label: "Prea repede",
      color: "bg-amber-500",
      emoji: "😱",
    },
    { type: "CONFUSED", label: "Confuz", color: "bg-indigo-500", emoji: "😵‍💫" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Navigare Back */}
        <button
          onClick={() => navigate("/teacher")}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 font-bold transition-colors"
        >
          <ArrowLeft size={20} /> ÎNAPOI LA DASHBOARD
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* SECȚIUNEA 1: STATISTICI LIVE (Display-ul vizual) */}
          <div className="lg:w-1/2 flex flex-col gap-6">
            {/* Cardul de Statistici */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                    {activityTitle}
                  </h1>
                  <p className="text-slate-400 text-sm font-mono uppercase">
                    Sesiunea #{id}
                  </p>
                </div>
                <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-2xl flex flex-col items-center min-w-80px">
                  <span className="text-xl font-black">{stats.TOTAL}</span>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">
                    Total Reacții
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {FEEDBACK_CONFIG.map((item) => (
                  <div key={item.type}>
                    <div className="flex justify-between mb-2 font-bold text-slate-700">
                      <span className="flex items-center gap-2">
                        <span className="text-2xl">{item.emoji}</span>{" "}
                        {item.label}
                      </span>
                      <span>{stats[item.type]}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className={`${item.color} h-full transition-all duration-700 ease-out`}
                        style={{ width: getWidth(item.type) }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Secțiunea de COD - Integrată discret jos */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-slate-900 p-3 rounded-2xl">
                  <Users className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                    Cod Acces Elevi
                  </p>
                  <p className="text-2xl font-black text-slate-800 font-mono tracking-tighter">
                    {accessCode || "---"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(accessCode);
                  alert("Cod copiat!");
                }}
                className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-200 active:scale-95"
              >
                COPIAZĂ CODUL
              </button>
            </div>
          </div>
          {/* SECȚIUNEA 2: FEED-UL LIVE */}
          <div className="lg:w-1/2">
            {/* Am corectat h-[600px] și am adăugat flex flex-col */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
              <div className="p-6 border-b bg-slate-50 flex items-center gap-2 font-bold text-slate-700 shrink-0">
                <MessageSquare className="text-indigo-600" size={20} />
                FLUX CONTINU REACȚII
              </div>

              {/* flex-1 și overflow-y-auto vor activa scroll-ul acum că părintele are h-[600px] */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200">
                {feedbacks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 italic">
                    <Users size={40} className="mb-2 opacity-20" />
                    Așteptare feedback...
                  </div>
                ) : (
                  feedbacks.map((f, idx) => (
                    <div
                      key={f.id || idx}
                      className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">
                          {FEEDBACK_CONFIG.find((c) => c.type === f.emojiType)
                            ?.emoji || "❓"}
                        </span>
                        <span className="font-bold text-slate-700 uppercase text-sm tracking-tight">
                          {FEEDBACK_CONFIG.find((c) => c.type === f.emojiType)
                            ?.label || f.emojiType}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
                        {new Date(f.timestamp || Date.now()).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitySession;
