import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { Clock, LogOut, Play, History, ExternalLink, Trash2, Calendar, AlignLeft, User } from "lucide-react";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [scheduledDate, setScheduledDate] = useState("");
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacherName, setTeacherName] = useState("");

  const minDateTime = new Date().toISOString().slice(0, 16);

  useEffect(() => {
    // Preluăm numele profesorului salvat la login pentru personalizare
    const savedName = localStorage.getItem("userName") || "Profesor";
    setTeacherName(savedName);
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      // Backend-ul va returna doar activitățile acestui profesor pe baza token-ului
      const res = await axiosInstance.get("/activities");
      setActivities(res.data.data);
    } catch (err) {
      console.error("Eroare la încărcarea activităților");
    } finally {
      setLoading(false);
    }
  };

  const isExpired = (createdAt: string, durationMinutes: number) => {
    const start = new Date(createdAt).getTime();
    const now = new Date().getTime();
    return now > start + durationMinutes * 60 * 1000;
  };

  const startSession = async () => {
    if (!title) return alert("Introduceți un titlu");
    if (duration <= 0 || duration > 360) return alert("Durata trebuie să fie între 1 și 360 minute");
    
    try {
      // NU trimitem teacherId manual. Backend-ul îl extrage din JWT.
      const res = await axiosInstance.post("/activities", { 
        title,
        description,
        duration,
        scheduledAt: scheduledDate || new Date().toISOString() 
      });

      setActivities([res.data.data, ...activities]);
      setTitle("");
      setDescription("");
      setDuration(30);
      setScheduledDate("");
      
      navigate(`/teacher/activity/${res.data.data.id}`);
    } catch (err) {
      alert("Eroare la pornire");
    }
  };

  const deleteActivity = async (id: number) => {
    if (!window.confirm("Ești sigur că vrei să ștergi această activitate?")) return;
    try {
      await axiosInstance.delete(`/activities/${id}`);
      setActivities(activities.filter(act => act.id !== id));
    } catch (err) {
      alert("Eroare la ștergere");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header Personalizat */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight underline decoration-indigo-500 decoration-4">
            STUDYFLOW PANEL
          </h1>
          <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1 uppercase">
            <User size={12} /> Bun venit, {teacherName}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-500 hover:text-red-600 font-bold transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100"
        >
          <LogOut size={20} /> IEȘIRE
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coloana Stângă: Formular */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 h-fit sticky top-6">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
            <Play className="text-indigo-600" size={20} /> SESIUNE NOUĂ
          </h2>
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-400 ml-1 uppercase">Titlu Activitate</label>
              <input
                type="text"
                placeholder="ex: Curs de React"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all font-medium"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 ml-1 uppercase flex items-center gap-1">
                <AlignLeft size={12} /> Descriere (Opțional)
              </label>
              <textarea
                placeholder="Detalii despre sesiune..."
                rows={2}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all font-medium resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 ml-1 uppercase flex items-center gap-1">
                  <Calendar size={12} /> Programare
                </label>
                <input
                  type="datetime-local"
                  min={minDateTime}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all text-slate-600 font-medium"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 ml-1 uppercase flex items-center gap-1">
                  <Clock size={12} /> Durată (Min)
                </label>
                <input
                  type="number"
                  min="1"
                  max="360"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all font-bold"
                  value={duration}
                  onChange={(e) => setDuration(Math.min(360, Math.max(0, parseInt(e.target.value) || 0)))}
                />
              </div>
            </div>

            <button
              onClick={startSession}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-100 active:scale-95"
            >
              LANSEAZĂ ACTIVITATEA
            </button>
          </div>
        </div>

        {/* Coloana Dreaptă: Lista Activităților */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
            <History className="text-indigo-600" size={20} /> ACTIVITĂȚILE TALE
          </h2>

          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
            ) : activities.length === 0 ? (
              <p className="text-slate-400 italic text-center py-10">Nu ai activități create încă.</p>
            ) : (
              activities.map((act) => {
                const expired = isExpired(act.scheduledDate, act.duration);
                // Parsăm data programată pentru afișare frumoasă
                const displayDate = act.scheduledAt ? new Date(act.scheduledAt).toLocaleString('ro-RO', {
                  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                }) : new Date(act.scheduledDate).toLocaleString();

                return (
                  <div
                    key={act.id}
                    className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                      expired ? "bg-slate-50 border-slate-100 opacity-80" : "bg-white border-indigo-50 shadow-sm"
                    }`}
                  >
                    <div className="flex flex-col gap-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${expired ? "bg-slate-300" : "bg-emerald-500 animate-pulse"}`}></span>
                        <h3 className="font-bold text-slate-800 truncate">{act.title}</h3>
                      </div>
                      
                      {/* Badge pentru data programată */}
                      <div className="flex items-center gap-3 ml-4">
                         <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md flex items-center gap-1">
                           <Calendar size={10} /> {displayDate}
                         </span>
                         <span className="text-[10px] font-mono text-indigo-500 font-bold uppercase">
                           Cod: {act.code}
                         </span>
                      </div>

                      {act.description && (
                        <p className="text-[10px] text-slate-400 truncate max-w-300px ml-4 italic">
                          "{act.description}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/teacher/activity/${act.id}`)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                          expired 
                            ? "bg-slate-200 text-slate-600 hover:bg-slate-300" 
                            : "bg-indigo-100 text-indigo-700 hover:bg-indigo-600 hover:text-white"
                        }`}
                      >
                        {expired ? "DETALII" : "LIVE"} <ExternalLink size={14} />
                      </button>
                      
                      <button
                        onClick={() => deleteActivity(act.id)}
                        className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Șterge"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;