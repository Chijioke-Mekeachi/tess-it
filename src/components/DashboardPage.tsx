/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Plus, 
  Clock, 
  Award, 
  Calendar, 
  Users, 
  FileText, 
  Check, 
  Paperclip, 
  Sparkles 
} from "lucide-react";
import { 
  SystemUser, 
  UserRole, 
  SystemStats, 
  WeeklyReport, 
  Student 
} from "../types";

interface DashboardPageProps {
  role: UserRole;
  currentUser: SystemUser;
  stats: SystemStats;
  reports: WeeklyReport[];
  students: Student[];
  searchQuery: string;
  setCurrentTab: (tab: string) => void;
  setShowAddReport: (val: boolean) => void;
  setSelectedReport: (rep: WeeklyReport) => void;
  setSupervisorFeedbackText: (val: string) => void;
  setSupervisorGradeScore: (val: number) => void;
  setNewRepContent: (val: string) => void;
  triggerToast: (msg: string, type?: "success" | "error" | "info") => void;
  systemCardClass: string;
}

export function DashboardPage({
  role,
  currentUser,
  stats,
  reports,
  students,
  searchQuery,
  setCurrentTab,
  setShowAddReport,
  setSelectedReport,
  setSupervisorFeedbackText,
  setSupervisorGradeScore,
  setNewRepContent,
  triggerToast,
  systemCardClass
}: DashboardPageProps) {
  return (
    <div className="space-y-6">
      {/* Greeting Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-indigo-950 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-955 via-indigo-900 to-indigo-955 pointer-events-none opacity-90"></div>
        
        <div className="relative z-10 space-y-2">
          <span className="bg-indigo-500/20 text-indigo-200 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-400/20">
            {role === "admin" ? "Academic Executive Directorate" : role === "supervisor" ? "Trainee Review Console" : "Weekly Activity Logs Board"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            Welcome to {role === "admin" ? "SITMS Administration" : "Academic SIWES Tracker"}
          </h2>
          <p className="text-xs text-indigo-200 font-light max-w-xl">
            Hello, <strong className="font-extrabold text-white">{currentUser.name}</strong>. Monitor training logs, evaluate trainee coordinate entries, and review system announcements seamlessly.
          </p>
        </div>

        {role === "student" && (
          <button
            onClick={() => {
              setShowAddReport(true);
              setCurrentTab("weekly");
            }}
            className="relative z-10 bg-white text-indigo-950 hover:bg-slate-100 px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 inline-block mr-1.5" />
            SUBMIT NEW LOG
          </button>
        )}
      </div>

      {/* Summary Bento Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {role === "student" && (
          <>
            <div className={`p-5 rounded-2xl border ${systemCardClass}`}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">My Submitted Weekly Logs</p>
              <div className="flex items-end justify-between">
                <h4 className="text-2xl font-black">{reports.length} Week entries</h4>
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-55/40 dark:bg-emerald-950/20 dark:text-emerald-300 px-2.5 py-0.5 rounded-md">Approved: {reports.filter(r => r.status === "Approved").length}</span>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border ${systemCardClass}`}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Work Attendance Rate</p>
              <div className="flex items-end justify-between">
                <h4 className="text-2xl font-black">{stats.attendancePercentage || 100}%</h4>
                <div className="w-12 h-1 bg-slate-100 dark:bg-slate-805 rounded-full overflow-hidden mb-2">
                  <div className="bg-emerald-500 h-full" style={{ width: `${stats.attendancePercentage || 100}%` }}></div>
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border ${systemCardClass}`}>
              <p className="text-[10px] font-bold text-slate-405 uppercase tracking-wider mb-2">SIWES Evaluation Grade</p>
              <div className="flex items-end justify-between">
                <h4 className="text-2xl font-black">95/100</h4>
                <span className="text-[9px] font-mono font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/35 dark:text-indigo-400 px-2 py-0.5 rounded-md">EXCELLENT</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0F4C81] to-indigo-650 text-white shadow">
              <p className="text-[10px] font-medium opacity-80 uppercase tracking-wider mb-2">Current Active Week Task</p>
              <div className="flex items-end justify-between">
                <h4 className="text-xl font-black font-sans">Week {reports.length + 1} Draft</h4>
                <Clock className="w-4 h-4 opacity-50" />
              </div>
            </div>
          </>
        )}

        {role === "supervisor" && (
          <>
            <div className={`p-5 rounded-2xl border ${systemCardClass}`}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">My Assigned Students</p>
              <div className="flex items-end justify-between">
                <h4 className="text-2xl font-black">{students.length} Trainees</h4>
                <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-955/35 px-2 py-1 rounded">Active Link</span>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border ${systemCardClass}`}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Awaiting Logbook Reviews</p>
              <div className="flex items-end justify-between">
                <h4 className="text-2xl font-black text-rose-500">{reports.filter(r => r.status === "Pending").length} logs</h4>
                <span className="text-[9px] font-black text-white bg-rose-600 px-2 py-0.5 rounded-full uppercase tracking-wider">Review Required</span>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border ${systemCardClass}`}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Overall Average Grade</p>
              <div className="flex items-end justify-between">
                <h4 className="text-2xl font-black font-sans">84.6%</h4>
                <Award className="w-5 h-5 text-indigo-550" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0F4C81] to-indigo-650 text-white shadow">
              <p className="text-[10px] font-semibold opacity-85 uppercase tracking-wider mb-2">Oral Defense Schedule</p>
              <div className="flex items-end justify-between">
                <h4 className="text-lg font-black">10 Days Remaining</h4>
                <Calendar className="w-4 h-4 opacity-50" />
              </div>
            </div>
          </>
        )}

        {role === "admin" && (
          <>
            <div className={`p-5 rounded-2xl border ${systemCardClass}`}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Registered Trainees</p>
              <div className="flex items-end justify-between">
                <h4 className="text-2xl font-black">{stats.totalStudents || 3} Students</h4>
                <Users className="w-4 h-4 text-indigo-505" />
              </div>
            </div>

            <div className={`p-5 rounded-2xl border ${systemCardClass}`}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Active Academic Supervisors</p>
              <div className="flex items-end justify-between">
                <h4 className="text-2xl font-black">{stats.totalSupervisors || 2} Staff</h4>
                <Users className="w-4 h-4 text-emerald-555" />
              </div>
            </div>

            <div className={`p-5 rounded-2xl border ${systemCardClass}`}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Total Logsheets Submitted</p>
              <div className="flex items-end justify-between">
                <h4 className="text-2xl font-black">{stats.totalReportsSubmitted || 5} Files</h4>
                <FileText className="w-4 h-4 text-purple-500" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950 to-indigo-750 text-white shadow">
              <p className="text-[10px] font-semibold opacity-85 uppercase tracking-wider mb-2">SIWES Compliance Rate</p>
              <div className="flex items-end justify-between">
                <h4 className="text-xl font-black">{stats.attendancePercentage || 90}% Approved</h4>
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Splits view of Log progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 rounded-2xl border overflow-hidden ${systemCardClass}`}>
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Active University Logbooks</h3>
              <p className="text-[10px] text-slate-400 mt-1">Real-time status of trainees' weekly industrial log submissions</p>
            </div>
            <button
              onClick={() => setCurrentTab("weekly")}
              className="text-[11px] text-indigo-650 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
            >
              View all journals →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-normal">
              <thead className="bg-slate-50 dark:bg-slate-900/85 text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-4 font-bold uppercase tracking-wider">Term Week</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Description Summary</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Scoring Status</th>
                  <th className="p-4 font-bold uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-805">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400 font-medium">
                      No weekly report items discovered.
                    </td>
                  </tr>
                ) : (
                  reports
                    .filter(r => searchQuery ? r.content.toLowerCase().includes(searchQuery.toLowerCase()) : true)
                    .map((rep) => (
                      <tr key={rep.id} className="hover:bg-slate-50/45 dark:hover:bg-slate-900/10 transition">
                        <td className="p-4">
                          <p className="font-bold text-slate-900 dark:text-indigo-400">Week {rep.weekNumber}</p>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">{rep.startDate} to {rep.endDate}</span>
                        </td>
                        <td className="p-4 max-w-sm">
                          <p className="truncate text-slate-700 dark:text-slate-200 font-normal leading-relaxed">{rep.content}</p>
                          {rep.attachments && rep.attachments.length > 0 && (
                            <div className="flex gap-1.5 mt-1">
                              {rep.attachments.map((file, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1 text-[9px] bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded border border-indigo-100 dark:border-slate-700">
                                  <Paperclip className="w-2.5 h-2.5" />
                                  {file.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold ${
                            rep.status === "Approved"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-350"
                              : rep.status === "Pending"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-350"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-955 dark:text-rose-350"
                          }`}>
                            {rep.status}
                          </span>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedReport(rep);
                              setSupervisorFeedbackText(rep.supervisorFeedback || "");
                              setSupervisorGradeScore(rep.score || 85);
                              setCurrentTab("weekly");
                            }}
                            className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bulletins Feed on Right Panel */}
        <div className="space-y-4">
          {/* Interactive AI Abstract Guide */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/95 to-indigo-850/95 text-white shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs uppercase tracking-wider">AI Journal Assistant</h3>
                <p className="text-[9px] text-indigo-200">Gemini 3.5 Flash Integration</p>
              </div>
            </div>

            <p className="text-[11px] text-indigo-100 leading-relaxed font-light mb-4">
              Need support formatting your weekly technical journal? Paste your industrial experiences draft and invoke the AI assistant for instant feedback.
            </p>

            <button
              onClick={() => {
                setCurrentTab("weekly");
                setShowAddReport(true);
                setNewRepContent("Resolved network security vulnerabilities by configuring VPN subnets and mapping standard firewall access policies.");
                triggerToast("Preloaded technical text log. Open AI Report Assistant inside Add Weekly view.", "info");
              }}
              className="w-full bg-white hover:bg-slate-150 text-indigo-950 font-bold text-[10px] py-2.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer"
            >
              Try AI Abstract formulation
            </button>
          </div>

          {/* Small visual cadence metrics */}
          <div className={`p-5 rounded-2xl border ${systemCardClass}`}>
            <h4 className="font-extrabold text-xs uppercase tracking-wider mb-4 text-slate-800 dark:text-slate-350">Industrial Cadence Profile</h4>
            <div className="flex items-end justify-between h-16 gap-3 pt-2">
              {[75, 90, 50, 80].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-slate-105 dark:bg-slate-800 rounded-t h-12 relative flex items-end">
                    <div className="bg-indigo-600 dark:bg-indigo-500 w-full rounded-t" style={{ height: `${h}%` }}></div>
                  </div>
                  <span className="text-[9px] text-slate-400">Wk {i+1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
