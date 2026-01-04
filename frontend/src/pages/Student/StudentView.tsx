import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { io, Socket } from "socket.io-client";

const FEEDBACK_OPTIONS = [
  { type: "HAPPY", emoji: "😊", color: "bg-emerald-500", label: "Înțeleg" },
  { type: "FROWNY", emoji: "☹️", color: "bg-rose-500", label: "Nu înțeleg" },
  {
    type: "SURPRISED",
    emoji: "😱",
    color: "bg-amber-500",
    label: "Prea repede!",
  },
  {
    type: "CONFUSED",
    emoji: "😵‍💫",
    color: "bg-indigo-500",
    label: "Sunt confuz",
  },
];

const StudentView = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("");

  // Folosim useRef pentru socket ca să păstrăm aceeași conexiune la re-randare
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Inițializăm socket-ul o singură dată
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000");
    }

    const checkActivity = async () => {
      try {
        const response = await axiosInstance.get(`/activities/${code}`);
        const { status, id, scheduledDate } = response.data.data;

        setActivity(response.data.data);

        if (status === "ACTIVE") {
          socketRef.current?.emit("join_activity", id);
          setStatusMsg(""); // Resetăm mesajul dacă e activă
        } else if (status === "UPCOMING") {
          const dateFormated = new Date(scheduledDate).toLocaleString("ro-RO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
          setStatusMsg(
            `Activitatea încă nu a început. Este programată pentru: ${dateFormated}`
          );
        } else if (status === "EXPIRED") {
          setStatusMsg("Această sesiune s-a încheiat.");
        } else {
          setStatusMsg("Status sesiune necunoscut.");
        }
      } catch (err) {
        setStatusMsg("Sesiunea nu a fost găsită.");
      } finally {
        setLoading(false);
      }
    };

    if (code) checkActivity();

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leave_activity", activity?.id);
        socketRef.current.off();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [code, activity?.id]);

  // Funcția UNICĂ de trimitere feedback
  const sendFeedback = async (emojiType: string) => {
    if (!activity || !code) return; // 'code' vine din useParams()

    try {
      await axiosInstance.post("/feedback/send", {
        // Asigură-te că ruta e corectă
        code: code.toUpperCase(), // Trimitem codul (ex: "X4Y7"), NU id-ul
        emojiType: emojiType,
      });

      // Feedback vizual rapid
      const originalTitle = document.title;
      document.title = "Trimis!";
      setTimeout(() => (document.title = originalTitle), 1000);
    } catch (err: any) {
      console.error("Eroare salvare DB:", err.response?.data || err.message);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 text-white">
        Se încarcă...
      </div>
    );

  if (statusMsg)
    return (
      <div className="h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{statusMsg}</h2>
        <button
          onClick={() => navigate("/")}
          className="text-indigo-600 font-semibold underline"
        >
          Înapoi la pagina principala
        </button>
      </div>
    );

  return (
    <div className="h-screen flex flex-col bg-slate-900 overflow-hidden">
      <div className="bg-white/10 backdrop-blur-md p-4 flex justify-between items-center border-b border-white/10">
        <h1 className="text-white font-bold truncate pr-4">
          {activity?.title}
        </h1>
        <span className="bg-indigo-500 text-white text-xs px-2 py-1 rounded-md font-mono uppercase">
          {code}
        </span>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-2 p-2">
        {FEEDBACK_OPTIONS.map((option) => (
          <button
            key={option.type}
            onClick={() => sendFeedback(option.type)}
            className={`${option.color} rounded-xl flex flex-col items-center justify-center gap-3 text-white shadow-lg active:scale-95 active:brightness-90 transition-all duration-75`}
          >
            <div className="bg-white/20 p-4 rounded-full text-6xl sm:text-7xl">
              {option.emoji}
            </div>
            <span className="font-black text-xs uppercase tracking-tighter sm:text-lg">
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudentView;
