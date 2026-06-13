/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Sliders, 
  BookOpen, 
  Calendar, 
  Users, 
  UserPlus, 
  Megaphone, 
  LogOut 
} from "lucide-react";
import { SystemUser, UserRole } from "../types";

interface SidebarProps {
  currentUser: SystemUser;
  role: UserRole;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  logout: () => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export function Sidebar({
  currentUser,
  role,
  currentTab,
  setCurrentTab,
  logout
}: SidebarProps) {
  return (
    <aside className="hidden md:flex w-64 bg-slate-950 text-slate-300 flex-col shrink-0 border-r border-slate-900 z-30">
      {/* Branding Block */}
      <div className="p-5 flex items-center gap-3 border-b border-indigo-950/40 shrink-0">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-extrabold text-sm shadow-md">
          U
        </div>
        <div>
          <span className="font-extrabold text-white tracking-wider text-xs block">SITMS UNN</span>
          <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase block mt-0.5">SIWES Console</span>
        </div>
      </div>

      {/* Navigation options depending on user classification */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block px-3 mb-2">OPERATIONS</span>

        <button
          onClick={() => setCurrentTab("dashboard")}
          className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 text-left transition-all ${
            currentTab === "dashboard" 
              ? "bg-slate-900 text-white font-semibold shadow border-l-2 border-indigo-505" 
              : "hover:bg-slate-900/60 hover:text-white text-slate-300"
          }`}
        >
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span className="text-[11px]">Control Dashboard</span>
        </button>

        {role === "student" && (
          <>
            <button
              onClick={() => setCurrentTab("weekly")}
              className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 text-left transition-all ${
                currentTab === "weekly" ? "bg-slate-900 text-white font-semibold border-l-2 border-indigo-505" : "hover:bg-slate-900/60 hover:text-white text-slate-300"
              }`}
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span className="text-[11px]">Weekly Logbook Logs</span>
            </button>

            <button
              onClick={() => setCurrentTab("attendance")}
              className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 text-left transition-all ${
                currentTab === "attendance" ? "bg-slate-900 text-white font-semibold border-l-2 border-indigo-550" : "hover:bg-slate-900/60 hover:text-white text-slate-300"
              }`}
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px]">Daily Check-in</span>
            </button>
          </>
        )}

        {role === "supervisor" && (
          <>
            <button
              onClick={() => setCurrentTab("trainees")}
              className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 text-left transition-all ${
                currentTab === "trainees" ? "bg-slate-900 text-white font-semibold border-l-2 border-indigo-550" : "hover:bg-slate-900/60 hover:text-white text-slate-300"
              }`}
            >
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="text-[11px]">Assigned Trainees</span>
            </button>

            <button
              onClick={() => setCurrentTab("weekly")}
              className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 text-left transition-all ${
                currentTab === "weekly" ? "bg-slate-900 text-white font-semibold border-l-2 border-indigo-550" : "hover:bg-slate-900/60 hover:text-white text-slate-300"
              }`}
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span className="text-[11px]">Review Logbooks</span>
            </button>
          </>
        )}

        {role === "admin" && (
          <>
            <button
              onClick={() => setCurrentTab("users")}
              className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 text-left transition-all ${
                currentTab === "users" ? "bg-slate-900 text-white font-semibold border-l-2 border-indigo-550" : "hover:bg-slate-900/60 hover:text-white text-slate-300"
              }`}
            >
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="text-[11px]">Directory Database</span>
            </button>

            <button
              onClick={() => setCurrentTab("reassignments")}
              className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 text-left transition-all ${
                currentTab === "reassignments" ? "bg-slate-900 text-white font-semibold border-l-2 border-indigo-550" : "hover:bg-slate-900/60 hover:text-white text-slate-300"
              }`}
            >
              <UserPlus className="w-4 h-4 text-orange-400" />
              <span className="text-[11px]">Bulk Supervisor Link</span>
            </button>
          </>
        )}

        <button
          onClick={() => setCurrentTab("announcements")}
          className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 text-left transition-all ${
            currentTab === "announcements" ? "bg-slate-900 text-white font-semibold border-l-2 border-indigo-550" : "hover:bg-slate-900/60 hover:text-white text-slate-300"
          }`}
        >
          <Megaphone className="w-4 h-4 text-amber-400" />
          <span className="text-[11px]">Portal Bulletins</span>
        </button>
      </nav>

      {/* Profile desk at footer coordinates */}
      <div className="p-4 border-t border-slate-900 bg-slate-950/85">
        <div className="p-3 bg-slate-900 rounded-xl mb-3 space-y-1.5 border border-slate-800/80">
          <p className="text-[8px] text-indigo-400 uppercase tracking-widest font-black">Authorized Profile</p>
          <p className="text-[11px] font-bold text-white truncate">{currentUser.name}</p>
          <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold truncate">{role}</p>
        </div>

        <button
          onClick={logout}
          className="w-full py-2 bg-slate-900 hover:bg-rose-950/65 hover:text-rose-200 text-slate-400 hover:border-rose-500/25 border border-transparent rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <LogOut className="w-3 h-3" />
          <span>Sign Out Account</span>
        </button>
      </div>
    </aside>
  );
}
