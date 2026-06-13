/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Megaphone, Plus, X } from "lucide-react";
import { Announcement, UserRole } from "../types";

interface AnnouncementsPageProps {
  announcements: Announcement[];
  role: UserRole;
  showAddAnn: boolean;
  setShowAddAnn: (val: boolean) => void;
  annTarget: "all" | "students" | "supervisors";
  setAnnTarget: (val: "all" | "students" | "supervisors") => void;
  annPriority: "normal" | "urgent";
  setAnnPriority: (val: "normal" | "urgent") => void;
  annTitle: string;
  setAnnTitle: (val: string) => void;
  annContent: string;
  setAnnContent: (val: string) => void;
  handlePostAnnouncement: (e: React.FormEvent) => void;
  systemCardClass: string;
}

export function AnnouncementsPage({
  announcements,
  role,
  showAddAnn,
  setShowAddAnn,
  annTarget,
  setAnnTarget,
  annPriority,
  setAnnPriority,
  annTitle,
  setAnnTitle,
  annContent,
  setAnnContent,
  handlePostAnnouncement,
  systemCardClass
}: AnnouncementsPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white uppercase tracking-wider">SIWES Academic Bulletins</h2>
          <p className="text-xs text-slate-500 mt-1">Official state directorate memos and announcements dispatch logs</p>
        </div>

        {role === "admin" && !showAddAnn && (
          <button
            onClick={() => setShowAddAnn(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            BROADCAST NEW BULLETIN
          </button>
        )}
      </div>

      {/* Creator Form */}
      {showAddAnn && role === "admin" && (
        <form onSubmit={handlePostAnnouncement} className="p-6 rounded-2xl border bg-white dark:bg-slate-900 shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b pb-3 dark:border-slate-850">
            <h3 className="font-extrabold text-sm uppercase">Draft system notice</h3>
            <button type="button" onClick={() => setShowAddAnn(false)} className="text-rose-500 cursor-pointer">
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Target Audience</label>
              <select
                value={annTarget}
                onChange={(e) => setAnnTarget(e.target.value as any)}
                className="w-full p-2 border border-slate-205 dark:border-slate-800 rounded-lg dark:bg-slate-950 text-xs text-slate-800 dark:text-white"
              >
                <option value="all">Unrestricted Public (All)</option>
                <option value="students">Registered SIWES Students</option>
                <option value="supervisors">Industrial Academic Staff</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Priority Status</label>
              <select
                value={annPriority}
                onChange={(e) => setAnnPriority(e.target.value as any)}
                className="w-full p-2 border border-slate-205 dark:border-slate-800 rounded-lg dark:bg-slate-950 text-xs text-slate-850 dark:text-white"
              >
                <option value="normal">Standard Priority Bulletin</option>
                <option value="urgent">Urgent Warning Dispatch</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-450 mb-1">Theme Title</label>
            <input
              type="text"
              placeholder="e.g. Mandatory Mid-Term Logbook Defense Coordinates"
              value={annTitle}
              onChange={(e) => setAnnTitle(e.target.value)}
              className="w-full p-2.5 border border-slate-205 dark:border-slate-800 rounded-lg dark:bg-slate-950 text-xs text-slate-850 dark:text-white font-normal"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-455 mb-1">Bulletin memo text</label>
            <textarea
              placeholder="Type details in full details here..."
              rows={4}
              value={annContent}
              onChange={(e) => setAnnContent(e.target.value)}
              className="w-full p-3 border border-slate-205 dark:border-slate-800 rounded-lg dark:bg-slate-950 text-xs text-slate-855 dark:text-white leading-relaxed font-normal"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg active:scale-95 transition cursor-pointer shadow-md"
          >
            DISPATCH SYSTEM MEMO
          </button>
        </form>
      )}

      {/* Notice feeds list */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="p-12 text-center text-slate-400 border rounded-2xl bg-white dark:bg-slate-900">
            No system notifications or academic memos broadcasts logged yet.
          </div>
        ) : (
          announcements.map((ann) => (
            <div key={ann.id} className={`p-6 rounded-2xl border relative overflow-hidden ${systemCardClass}`}>
              {ann.priority === "urgent" && (
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-500"></div>
              )}

              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <Megaphone className={`w-5 h-5 shrink-0 ${ann.priority === "urgent" ? "text-rose-505" : "text-amber-500"}`} />
                  <div>
                    <span className="text-[9px] text-slate-400 block font-mono">Sender Authority: {ann.author}</span>
                    <h3 className="font-extrabold text-indigo-700 dark:text-indigo-400 mt-1 leading-tight">{ann.title}</h3>
                  </div>
                </div>

                <div className="flex gap-1.5 shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                    ann.priority === "urgent" ? "bg-rose-100 text-rose-800" : "bg-slate-100 text-slate-850 dark:bg-slate-800"
                  }`}>
                    {ann.priority}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] bg-indigo-100/50 text-indigo-850 uppercase tracking-widest font-bold">
                    Audience: {ann.target}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-light">
                {ann.content}
              </p>

              <div className="mt-4 pt-4 border-t dark:border-slate-800 text-[10px] text-slate-400 text-right font-mono">
                Dispatched: {ann.createdAt.split("T")[0]}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
