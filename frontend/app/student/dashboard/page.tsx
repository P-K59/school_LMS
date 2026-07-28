"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { 
  Smile, 
  Sparkles, 
  Award, 
  Flame, 
  Trophy, 
  BookOpen, 
  Calendar, 
  CreditCard, 
  BookMarked, 
  Bus, 
  LogOut, 
  CheckCircle,
  PlayCircle
} from "lucide-react";

export default function StudentDashboard() {
  const router = useRouter();
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gamified mock stats (as per the Intern 4 spec in the PDF)
  const [xp, setXp] = useState(280);
  const [level, setLevel] = useState("Explorer");
  const [streak, setStreak] = useState(5);
  const [coins, setCoins] = useState(120);

  // Lessons list for the interactive roadmap
  const lessons = [
    { id: 1, title: "Introduction to Fractions", module: "Mathematics", duration: "10 mins", status: "completed", xp: "+30 XP" },
    { id: 2, title: "Fractions on a Number Line", module: "Mathematics", duration: "12 mins", status: "completed", xp: "+30 XP" },
    { id: 3, title: "Equivalent Fractions Game", module: "Mathematics", duration: "15 mins", status: "active", xp: "+50 XP" },
    { id: 4, title: "Adding and Subtracting Fractions", module: "Mathematics", duration: "8 mins", status: "locked", xp: "+30 XP" },
    { id: 5, title: "Module Quiz: Fraction Master", module: "Mathematics", duration: "20 mins", status: "locked", xp: "+80 XP" },
  ];

  // Leaderboard mock data
  const leaderboard = [
    { rank: 1, name: "Aarav Sharma", xp: 1250, avatar: "🦁" },
    { rank: 2, name: "Ananya Iyer", xp: 980, avatar: "🦄" },
    { rank: 3, name: "You (Demo Student)", xp: 280, avatar: "🐼", isCurrentUser: true },
    { rank: 4, name: "Kabir Verma", xp: 240, avatar: "🦊" },
    { rank: 5, name: "Riya Sen", xp: 190, avatar: "🐨" },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/auth/me");
      if (res.success && res.data) {
        setStudentData(res.data);
      } else {
        throw new Error("Unable to load profile data.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load student dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("school");
    router.push("/auth/student-login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-semibold text-sm">Loading your magical dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !studentData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4">
          <Smile size={48} className="mx-auto text-rose-450 rotate-180" />
          <h3 className="text-xl font-bold text-white">Oops, something went wrong!</h3>
          <p className="text-xs text-slate-400">{error || "Failed to load student credentials."}</p>
          <button 
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs cursor-pointer transition-all"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  const { user, school } = studentData;
  const student = user.student || {};
  const currentClass = student.class?.name || "N/A";
  const currentSection = student.section?.name || "N/A";
  const rollNo = student.rollNumber || "N/A";
  
  // Calculate attendance %
  const totalDays = student.attendances?.length || 0;
  const presentDays = student.attendances?.filter((a: any) => a.status === "PRESENT" || a.status === "LATE").length || 0;
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

  // Calculate unpaid fees
  const dueFees = student.fees?.reduce((acc: number, f: any) => acc + Number(f.dueAmount), 0) || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-inter antialiased relative overflow-hidden pb-12">
      {/* Background glowing gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-pink-500/10 to-transparent blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-indigo-500/5 to-transparent blur-3xl" />

      {/* Header bar */}
      <header className="max-w-[1440px] mx-auto w-full px-6 py-5 flex items-center justify-between border-b border-slate-900 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-indigo-500 shadow-md">
            <span className="font-hanken font-bold text-base text-white">EV</span>
          </div>
          <div>
            <h1 className="font-hanken font-bold text-sm leading-none text-white tracking-tight">EduVerse</h1>
            <span className="text-[9px] text-pink-400 font-geist tracking-widest uppercase font-semibold">Student Hub</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Avatar and School */}
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white">{user.firstName} {user.lastName}</p>
            <p className="text-[9px] text-slate-500 font-medium">{school.name}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500/20 to-indigo-500/20 border border-pink-500/30 flex items-center justify-center text-lg shadow-inner">
            🐼
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main content grid */}
      <main className="max-w-[1440px] mx-auto w-full px-6 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8 z-10 relative">
        
        {/* Left Column: Kid Profile & Gamified Stats */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Profile Card */}
          <div className="p-6 bg-slate-900/40 border border-slate-900 rounded-3xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-500" />
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500/10 to-indigo-500/10 border border-pink-500/20 flex items-center justify-center text-3xl shadow-inner mb-3">
                🐼
              </div>
              <h3 className="text-lg font-bold text-white leading-tight">{user.firstName} {user.lastName}</h3>
              <span className="text-[10px] font-bold bg-pink-950 text-pink-400 px-2 py-0.5 rounded-full mt-1.5 uppercase tracking-wider">
                {level} level
              </span>
              
              <div className="w-full mt-6 space-y-2 text-xs border-t border-slate-900/60 pt-4 text-left">
                <div className="flex justify-between"><span className="text-slate-500 font-medium">Class:</span> <span className="text-slate-350 font-semibold">{currentClass}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-medium">Section:</span> <span className="text-slate-350 font-semibold">{currentSection}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-medium">Roll Number:</span> <span className="text-slate-350 font-semibold">{rollNo}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-medium">Admission No:</span> <span className="text-slate-350 font-semibold">{student.admissionNumber || "N/A"}</span></div>
              </div>
            </div>
          </div>

          {/* Gamified Progress Card */}
          <div className="p-6 bg-slate-900/40 border border-slate-900 rounded-3xl backdrop-blur-md relative">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Trophy size={14} className="text-pink-400" /> XP progress
            </h3>
            <div className="space-y-4">
              {/* Level & XP */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1.5">
                  <span>Level 2 ({level})</span>
                  <span className="text-pink-400">{xp}/500 XP</span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full border border-slate-900 overflow-hidden p-0.5">
                  <div className="h-full bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full" style={{ width: `${(xp/500)*100}%` }}></div>
                </div>
              </div>

              {/* Streak & Coins */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-2xl flex items-center gap-2.5">
                  <Flame size={18} className="text-orange-500 animate-pulse" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-medium leading-none">Streak</p>
                    <p className="text-xs font-bold text-white mt-1">{streak} Days</p>
                  </div>
                </div>
                <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-2xl flex items-center gap-2.5">
                  <Sparkles size={18} className="text-yellow-500" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-medium leading-none">Coins</p>
                    <p className="text-xs font-bold text-white mt-1">{coins} 🪙</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Badges Earned */}
          <div className="p-6 bg-slate-900/40 border border-slate-900 rounded-3xl backdrop-blur-md">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award size={14} className="text-pink-400" /> My Badges (3)
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center text-center p-2 bg-slate-950/40 border border-slate-900 rounded-xl" title="Completed your first lesson!">
                <span className="text-2xl mb-1">🏁</span>
                <span className="text-[8px] font-bold text-slate-400 leading-none">First Steps</span>
              </div>
              <div className="flex flex-col items-center text-center p-2 bg-slate-950/40 border border-slate-900 rounded-xl" title="Pass a quiz with 100% score!">
                <span className="text-2xl mb-1">🎯</span>
                <span className="text-[8px] font-bold text-slate-400 leading-none">Quiz Ace</span>
              </div>
              <div className="flex flex-col items-center text-center p-2 bg-slate-950/40 border border-slate-900 rounded-xl" title="Maintained a 5-day study streak!">
                <span className="text-2xl mb-1">🔥</span>
                <span className="text-[8px] font-bold text-slate-400 leading-none">Streak Rider</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Portal Widgets and Lesson Map */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Panel: Real Academic Dashboard Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            
            {/* Widget 1: Attendance */}
            <div className="p-5 bg-slate-900/40 border border-slate-900 rounded-3xl backdrop-blur-md flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Attendance Rate</p>
                <p className="text-base font-bold text-white mt-0.5">{attendanceRate}%</p>
                <p className="text-[9px] text-slate-450 mt-0.5 font-medium">{presentDays} / {totalDays} days marked</p>
              </div>
            </div>

            {/* Widget 2: Fees Ledger */}
            <div className="p-5 bg-slate-900/40 border border-slate-900 rounded-3xl backdrop-blur-md flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                <CreditCard size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Outstanding Fees</p>
                <p className="text-base font-bold text-white mt-0.5">₹{dueFees}</p>
                <p className="text-[9px] text-slate-450 mt-0.5 font-medium">
                  {dueFees > 0 ? "Pending Invoice Payment" : "All cleared! Good job!"}
                </p>
              </div>
            </div>

            {/* Widget 3: Library Status */}
            <div className="p-5 bg-slate-900/40 border border-slate-900 rounded-3xl backdrop-blur-md flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-450">
                <BookMarked size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Issued Books</p>
                <p className="text-base font-bold text-white mt-0.5">{student.bookIssues?.filter((bi: any) => !bi.returnDate).length || 0}</p>
                <p className="text-[9px] text-slate-450 mt-0.5 font-medium">Active library issues</p>
              </div>
            </div>

            {/* Widget 4: Bus Stop Route */}
            <div className="p-5 bg-slate-900/40 border border-slate-900 rounded-3xl backdrop-blur-md flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Bus size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">School Bus Route</p>
                <p className="text-xs font-bold text-white mt-1 truncate max-w-[130px]">
                  {student.transport?.route?.name || "Not Allocated"}
                </p>
                <p className="text-[9px] text-slate-450 font-medium">
                  {student.transport?.stop?.stopName ? `Stop: ${student.transport.stop.stopName}` : "No bus service allocated"}
                </p>
              </div>
            </div>

          </div>

          {/* Interactive Lesson Roadmap & Leaderboard split */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Roadmap: Sequential Lessons */}
            <div className="xl:col-span-2 p-6 bg-slate-900/40 border border-slate-900 rounded-3xl backdrop-blur-md space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen size={16} className="text-pink-400" /> Learning Path: Fractions Island
                </h3>
                <p className="text-[10px] text-slate-450 mt-0.5">Complete lessons sequentially and score &ge;60% on quizzes to unlock the next level.</p>
              </div>

              <div className="space-y-3 mt-4">
                {lessons.map((lesson) => (
                  <div 
                    key={lesson.id}
                    className={`p-4 border rounded-2xl flex items-center justify-between transition-all ${
                      lesson.status === "completed" 
                        ? "bg-emerald-950/10 border-emerald-900/40 text-slate-350"
                        : lesson.status === "active"
                          ? "bg-pink-950/15 border-pink-500/40 text-white shadow-lg shadow-pink-500/5"
                          : "bg-slate-950/30 border-slate-900 text-slate-500 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-lg">
                        {lesson.status === "completed" ? "✅" : lesson.status === "active" ? "⭐️" : "🔒"}
                      </span>
                      <div>
                        <p className="text-xs font-bold leading-tight">{lesson.title}</p>
                        <span className="text-[9px] text-slate-500 font-medium mt-0.5 block">{lesson.module} &bull; {lesson.duration}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold ${lesson.status === "completed" ? "text-emerald-450" : lesson.status === "active" ? "text-pink-400 animate-pulse" : "text-slate-600"}`}>
                        {lesson.xp}
                      </span>
                      {lesson.status === "active" && (
                        <button className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-[10px] cursor-pointer flex items-center gap-1 shadow-md">
                          <PlayCircle size={12} /> Play
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard panel */}
            <div className="xl:col-span-1 p-6 bg-slate-900/40 border border-slate-900 rounded-3xl backdrop-blur-md flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Trophy size={14} className="text-yellow-500" /> Class Leaderboard
                </h3>
                
                <div className="space-y-3">
                  {leaderboard.map((item) => (
                    <div 
                      key={item.rank}
                      className={`p-3 rounded-2xl flex items-center justify-between border ${
                        item.isCurrentUser 
                          ? "bg-pink-950/15 border-pink-500/40" 
                          : "bg-slate-950/40 border-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-bold text-slate-500 w-4">{item.rank}</span>
                        <span className="text-base">{item.avatar}</span>
                        <span className={`text-xs font-semibold ${item.isCurrentUser ? "text-white font-bold" : "text-slate-350"}`}>
                          {item.name}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-400">{item.xp} XP</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-2xl text-[9px] text-center text-indigo-400 font-medium">
                Resets in 4 days. Keep studying to climb the ranks! 🚀
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
