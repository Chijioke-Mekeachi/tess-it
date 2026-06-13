/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Student, WeeklyReport } from "../types";

interface TraineesPageProps {
  students: Student[];
  reports: WeeklyReport[];
  setSelectedReport: (rep: WeeklyReport | null) => void;
  setCurrentTab: (tab: string) => void;
  triggerToast: (msg: string, type?: "success" | "error" | "info") => void;
  systemCardClass: string;
}

export function TraineesPage({
  students,
  reports,
  setSelectedReport,
  setCurrentTab,
  triggerToast,
  systemCardClass
}: TraineesPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white uppercase tracking-wider">Assigned student directories</h2>
        <p className="text-xs text-slate-500 mt-1">Review industry placements and evaluation statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-405 border rounded-2xl bg-white dark:bg-slate-900 border-dashed">
            No student trainee accounts linked with your academic staff profile coordinates.
          </div>
        ) : (
          students.map((student) => {
            const sReps = reports.filter(r => r.studentId === student.id);
            const sApproveCount = sReps.filter(r => r.status === "Approved").length;

            return (
              <div key={student.id} className={`p-6 rounded-2xl border flex flex-col justify-between hover:shadow-md transition ${systemCardClass}`}>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
                      {student.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 dark:text-white leading-tight">{student.name}</h4>
                      <span className="text-[9px] text-slate-400 font-mono block mt-0.5">{student.regNo}</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl space-y-1.5 text-xs">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">SIWES PLACEMENT</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100">{student.companyName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">DEPARTMENT</span>
                      <span className="text-slate-650 dark:text-slate-300">{student.department}</span>
                    </div>
                  </div>

                  {/* Scoring profile progress */}
                  <div className="text-xs space-y-2">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-405">Approved Logbooks:</span>
                      <span className="text-indigo-600 dark:text-indigo-400">{sApproveCount} APPROVED</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-808 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-full transition-all" style={{ width: `${sReps.length ? (sApproveCount / sReps.length) * 100 : 0}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-850 flex justify-between items-center bg-transparent">
                  <div>
                    <span className="text-[9px] text-slate-400 block">Current score</span>
                    <span className="text-xs font-black text-indigo-650 dark:text-indigo-400">{student.evaluationScore || "Pending"}/100</span>
                  </div>

                  <button
                    onClick={() => {
                      const foundRep = reports.find(r => r.studentId === student.id);
                      setSelectedReport(foundRep || null);
                      triggerToast(`Loading files of ${student.name}`, "info");
                      setCurrentTab("weekly");
                    }}
                    className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-205 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold px-3.5 py-2 rounded-xl transition cursor-pointer"
                  >
                    Inspect logs
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
