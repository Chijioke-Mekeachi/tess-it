/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Plus, X } from "lucide-react";
import { Student, Supervisor } from "../types";

interface DirectoryDatabasePageProps {
  students: Student[];
  supervisors: Supervisor[];
  showAddUser: boolean;
  setShowAddUser: (val: boolean) => void;
  newUserTab: "student" | "supervisor";
  setNewUserTab: (val: "student" | "supervisor") => void;
  newUserName: string;
  setNewUserName: (val: string) => void;
  newUserEmail: string;
  setNewUserEmail: (val: string) => void;
  newUserReg: string;
  setNewUserReg: (val: string) => void;
  newUserCompany: string;
  setNewUserCompany: (val: string) => void;
  newUserDept: string;
  setNewUserDept: (val: string) => void;
  handleAdminCreateUser: (e: React.FormEvent) => void;
  systemCardClass: string;
}

export function DirectoryDatabasePage({
  students,
  supervisors,
  showAddUser,
  setShowAddUser,
  newUserTab,
  setNewUserTab,
  newUserName,
  setNewUserName,
  newUserEmail,
  setNewUserEmail,
  newUserReg,
  setNewUserReg,
  newUserCompany,
  setNewUserCompany,
  newUserDept,
  setNewUserDept,
  handleAdminCreateUser,
  systemCardClass
}: DirectoryDatabasePageProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-transparent gap-4 flex-wrap">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white uppercase tracking-wider">Directories</h2>
          <p className="text-xs text-slate-500 mt-1">Add, update, and inspect student and academic coordinators database directory files</p>
        </div>

        <button
          onClick={() => setShowAddUser(true)}
          className="bg-indigo-650 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          CREATE PROFILE
        </button>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <form onSubmit={handleAdminCreateUser} className="p-6 bg-white dark:bg-slate-900 border rounded-2xl shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800">
            <h4 className="font-extrabold text-sm uppercase">Generate manual account</h4>
            <button type="button" onClick={() => setShowAddUser(false)} className="text-slate-400 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-4 border-b pb-2.5 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setNewUserTab("student")}
              className={`font-bold text-xs pb-1 transition-all border-b-2 ${newUserTab === "student" ? "border-indigo-505 text-indigo-600 dark:text-indigo-400" : "border-transparent text-slate-400"}`}
            >
              STUDENT PROFILE
            </button>
            <button
              type="button"
              onClick={() => setNewUserTab("supervisor")}
              className={`font-bold text-xs pb-1 transition-all border-b-2 ${newUserTab === "supervisor" ? "border-indigo-550 text-indigo-600 dark:text-indigo-400" : "border-transparent text-slate-400"}`}
            >
              INSTRUCTOR STAFF
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Fatima Yusuf"
                value={newUserName}
                aria-label="Full Name"
                onChange={(e) => setNewUserName(e.target.value)}
                className="w-full p-2.5 border border-slate-205 dark:border-slate-800 rounded-lg text-xs dark:bg-slate-950 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Registration Email</label>
              <input
                type="email"
                placeholder="f.yusuf@unn.edu.ng"
                value={newUserEmail}
                aria-label="Registration Email"
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="w-full p-2.5 border border-slate-205 dark:border-slate-800 rounded-lg text-xs dark:bg-slate-950 dark:text-white"
                required
              />
            </div>

            {newUserTab === "student" && (
              <>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">University Registational Matric</label>
                  <input
                    type="text"
                    placeholder="UNN/SIWES/2026/1045"
                    value={newUserReg}
                    aria-label="University Registration Matric Number"
                    onChange={(e) => setNewUserReg(e.target.value)}
                    className="w-full p-2.5 border border-slate-205 dark:border-slate-800 rounded-lg text-xs dark:bg-slate-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">SIWES Industry workplace</label>
                  <input
                    type="text"
                    placeholder="Chevron Office, Lagos"
                    value={newUserCompany}
                    aria-label="SIWES Industry Workplace"
                    onChange={(e) => setNewUserCompany(e.target.value)}
                    className="w-full p-2.5 border border-slate-205 dark:border-slate-800 rounded-lg text-xs dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Department designation</label>
              <input
                type="text"
                value={newUserDept}
                aria-label="Department Designation"
                onChange={(e) => setNewUserDept(e.target.value)}
                className="w-full p-2.5 border border-slate-205 dark:border-slate-800 rounded-lg text-xs dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition cursor-pointer"
          >
            PUBLISH USER RECORD
          </button>
        </form>
      )}

      {/* Listings grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students */}
        <div className={`p-6 rounded-2xl border ${systemCardClass}`}>
          <h3 className="font-extrabold text-xs uppercase mb-4 text-indigo-650 dark:text-indigo-400 tracking-wider">SIWES Student Attachés</h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {students.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">No trainee student records in directory schema.</div>
            ) : (
              students.map(s => (
                <div key={s.id} className="p-4 bg-slate-50 dark:bg-slate-900 border dark:border-slate-850 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <p className="font-extrabold text-slate-900 dark:text-white">{s.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{s.regNo}</p>
                    <span className="text-[10px] mt-1.5 bg-indigo-50 dark:bg-slate-850 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded inline-block font-bold">
                      {s.companyName}
                    </span>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 px-3 py-1 rounded-md text-[9px] font-bold">
                    Active placement
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Supervisors */}
        <div className={`p-6 rounded-2xl border ${systemCardClass}`}>
          <h3 className="font-extrabold text-xs uppercase mb-4 text-emerald-600 dark:text-emerald-400 tracking-wider">Academic Staff Directory</h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {supervisors.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">No academic supervisors registered in staff systems.</div>
            ) : (
              supervisors.map(sup => (
                <div key={sup.id} className="p-4 bg-slate-50 dark:bg-slate-900 border dark:border-slate-850 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <p className="font-extrabold text-slate-900 dark:text-white">{sup.name}</p>
                    <p className="text-[10px] text-slate-405 mt-0.5">{sup.email}</p>
                    <p className="text-[10px] text-slate-405 mt-0.5">{sup.department}</p>
                  </div>
                  <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md text-[9px] font-bold border border-transparent dark:border-emerald-800">
                    {sup.assignedStudentsCount} Trainees linked
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
