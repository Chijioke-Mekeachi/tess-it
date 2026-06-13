/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { UserPlus } from "lucide-react";
import { Student, Supervisor } from "../types";

interface ReassignmentsPageProps {
  students: Student[];
  supervisors: Supervisor[];
  selectedBulkStudents: string[];
  toggleBulkStudentSelect: (id: string) => void;
  bulkSupervisorTarget: string;
  setBulkSupervisorTarget: (id: string) => void;
  executeBulkAssignment: () => void;
}

export function ReassignmentsPage({
  students,
  supervisors,
  selectedBulkStudents,
  toggleBulkStudentSelect,
  bulkSupervisorTarget,
  setBulkSupervisorTarget,
  executeBulkAssignment
}: ReassignmentsPageProps) {
  return (
    <div className="space-y-6 bg-slate-50/50 dark:bg-slate-900/10 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white uppercase tracking-wider">Supervisor Assignments block</h2>
        <p className="text-xs text-slate-500 mt-1">Select students and assign them synchronously to academic coordinators</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Multiselect checkboxes */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-extrabold uppercase text-indigo-650 dark:text-indigo-400 tracking-wider">Step 1: Check Trainees</h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {students.length === 0 ? (
              <p className="text-slate-400 text-center py-10">No students are currently catalogued in databases.</p>
            ) : (
              students.map((student) => {
                const isChecked = selectedBulkStudents.includes(student.id);
                return (
                  <label
                    key={student.id}
                    style={{ userSelect: "none" }}
                    className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition ${
                      isChecked 
                        ? "border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20" 
                        : "border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                  >
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white">{student.name}</p>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">{student.regNo}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      aria-label={`Select student ${student.name}`}
                      onChange={() => toggleBulkStudentSelect(student.id)}
                      className="w-4.5 h-4.5 text-indigo-600 focus:ring-indigo-500 rounded cursor-pointer"
                    />
                  </label>
                );
              })
            )}
          </div>
        </div>

        {/* Choose Supervisor Target Radio buttons */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h3 className="font-extrabold uppercase text-emerald-600 dark:text-emerald-450 tracking-wider">Step 2: Assign Supervisor destination</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-light">
              Pick the primary academic coordinator staff member to accept these student entries.
            </p>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {supervisors.length === 0 ? (
                <p className="text-slate-400 text-center py-10">No supervisors are registered yet.</p>
              ) : (
                supervisors.map((sup) => (
                  <label
                    key={sup.id}
                    style={{ userSelect: "none" }}
                    className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition ${
                      bulkSupervisorTarget === sup.id 
                        ? "border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20" 
                        : "border-slate-205 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                  >
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white">{sup.name}</p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{sup.department}</span>
                    </div>
                    <input
                      type="radio"
                      name="target_bulk_supervisor"
                      checked={bulkSupervisorTarget === sup.id}
                      aria-label={`Select supervisor ${sup.name}`}
                      onChange={() => setBulkSupervisorTarget(sup.id)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                  </label>
                ))
              )}
            </div>
          </div>

          <button
            onClick={executeBulkAssignment}
            disabled={selectedBulkStudents.length === 0 || !bulkSupervisorTarget}
            className={`w-full py-3 mt-6 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 text-white cursor-pointer ${
              selectedBulkStudents.length > 0 && bulkSupervisorTarget
                ? "bg-emerald-600 hover:bg-emerald-700 shadow shadow-emerald-500/20"
                : "bg-slate-300 dark:bg-slate-805 cursor-not-allowed text-slate-450 dark:text-slate-500"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            SUBMIT BULK REASSIGNMENT
          </button>
        </div>
      </div>
    </div>
  );
}
