/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Plus, 
  Trash2, 
  X, 
  Paperclip, 
  FileDown, 
  Sparkles 
} from "lucide-react";
import { SystemUser, UserRole, WeeklyReport } from "../types";

interface WeeklyLogbookPageProps {
  currentUser: SystemUser;
  role: UserRole;
  reports: WeeklyReport[];
  selectedReport: WeeklyReport | null;
  setSelectedReport: (rep: WeeklyReport | null) => void;
  showAddReport: boolean;
  setShowAddReport: (val: boolean) => void;
  newRepWeek: number;
  setNewRepWeek: (val: number) => void;
  newRepStart: string;
  setNewRepStart: (val: string) => void;
  newRepEnd: string;
  setNewRepEnd: (val: string) => void;
  newRepContent: string;
  setNewRepContent: (val: string) => void;
  uploadedFiles: Array<{ name: string; size: string }>;
  setUploadedFiles: React.Dispatch<React.SetStateAction<Array<{ name: string; size: string }>>>;
  uploadProgress: number | null;
  supervisorFeedbackText: string;
  setSupervisorFeedbackText: (val: string) => void;
  supervisorGradeScore: number;
  setSupervisorGradeScore: (val: number) => void;
  aiLoading: boolean;
  aiResult: {
    summary: string;
    highlights: string[];
    suggestions: string[];
    formatting: string;
    source: string;
  } | null;
  handleCreateReport: (e: React.FormEvent) => void;
  handleDeleteReport: (id: string) => void;
  handleDummyUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  submitSupervisorReview: (e: React.FormEvent) => void;
  rejectReportBySupervisor: () => void;
  queryAiAssistant: (contentStr: string) => void;
  triggerToast: (msg: string, type?: "success" | "error" | "info") => void;
  systemCardClass: string;
  searchQuery: string;
}

export function WeeklyLogbookPage({
  currentUser,
  role,
  reports,
  selectedReport,
  setSelectedReport,
  showAddReport,
  setShowAddReport,
  newRepWeek,
  setNewRepWeek,
  newRepStart,
  setNewRepStart,
  newRepEnd,
  setNewRepEnd,
  newRepContent,
  setNewRepContent,
  uploadedFiles,
  setUploadedFiles,
  uploadProgress,
  supervisorFeedbackText,
  setSupervisorFeedbackText,
  supervisorGradeScore,
  setSupervisorGradeScore,
  aiLoading,
  aiResult,
  handleCreateReport,
  handleDeleteReport,
  handleDummyUpload,
  submitSupervisorReview,
  rejectReportBySupervisor,
  queryAiAssistant,
  triggerToast,
  systemCardClass,
  searchQuery
}: WeeklyLogbookPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white uppercase tracking-wider">SIWES Log diaries</h2>
          <p className="text-xs text-slate-500 mt-1">Review coordinates, submit training sheets and evaluate drafts</p>
        </div>

        {role === "student" && !showAddReport && (
          <button
            onClick={() => setShowAddReport(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            SUBMIT NEW LOG
          </button>
        )}
      </div>

      {/* Logbook Evaluation Header Panel */}
      {selectedReport && (
        <div className="p-6 rounded-2xl border-2 border-indigo-500/25 bg-indigo-50/20 dark:bg-slate-900/60 backdrop-blur-md relative space-y-4">
          <button
            onClick={() => setSelectedReport(null)}
            className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition cursor-pointer"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>

          <span className="inline-block bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-indigo-200/50">
            EVALUATOR INSPECTOR — Week {selectedReport.weekNumber}
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Selected Report's Content description */}
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">Trainee Original Log</p>
              <div className="p-4 bg-white dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-slate-150 leading-relaxed border dark:border-slate-800 shadow-inner">
                {selectedReport.content}
              </div>

              {selectedReport.attachments && selectedReport.attachments.length > 0 && (
                <div className="mt-4">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">Associated Verification Attachments</p>
                  <div className="flex flex-col gap-1.5">
                    {selectedReport.attachments.map((file, idx) => (
                      <a
                        key={idx}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          triggerToast(`Staged direct file download: ${file.name}`, "info");
                        }}
                        className="p-2.5 bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-2 hover:bg-slate-50 text-xs text-indigo-650 dark:text-indigo-400 font-bold max-w-sm"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span className="truncate">{file.name} ({file.size})</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Supervisor Evaluation Inputs */}
            <div>
              {role === "supervisor" ? (
                <form onSubmit={submitSupervisorReview} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Grade score (1-100)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={supervisorGradeScore}
                      onChange={(e) => setSupervisorGradeScore(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Industrial Advisory Feedback Comments</label>
                    <textarea
                      placeholder="Provide professional guidance, suggestions, or specify formatting alignments required..."
                      rows={4}
                      value={supervisorFeedbackText}
                      onChange={(e) => setSupervisorFeedbackText(e.target.value)}
                      className="w-full p-3 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none"
                      required
                    ></textarea>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow border border-transparent cursor-pointer"
                    >
                      APPROVE WEEK LOG
                    </button>
                    <button
                      type="button"
                      onClick={rejectReportBySupervisor}
                      className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow border border-transparent cursor-pointer"
                    >
                      FLAG REJECTION
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border dark:border-slate-800 text-xs space-y-3 shadow-md">
                  <p className="font-extrabold text-[10px] tracking-wider uppercase text-indigo-650 dark:text-indigo-400">EVALUATION FEEDBACK RECORD</p>
                  <div>
                    <p className="font-bold text-slate-400">Awarded Score:</p>
                    <p className="text-sm font-black mt-1 text-slate-800 dark:text-white">
                      {selectedReport.score !== null ? `${selectedReport.score} / 100` : "Trainee report awaiting review by Supervisor"}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-400">Academic / Technical Feedback Comments:</p>
                    <p className="italic text-slate-600 mt-1 dark:text-slate-300">
                      {selectedReport.supervisorFeedback || "No comments returned yet."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Submission builder panel */}
      {showAddReport && role === "student" && (
        <div className="p-6 rounded-2xl border bg-white dark:bg-[#111827] border-slate-205 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b pb-3 border-slate-100 dark:border-slate-800">
            <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">Configure new week entry</h3>
            <button onClick={() => setShowAddReport(false)} className="p-1.5 text-slate-400 hover:text-rose-500 rounded-full transition cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* Draft Area Form */}
            <form onSubmit={handleCreateReport} className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">SIWES Term Week</label>
                  <input
                    type="number"
                    value={newRepWeek}
                    onChange={(e) => setNewRepWeek(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-800 rounded-lg dark:text-white bg-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newRepStart}
                    onChange={(e) => setNewRepStart(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-800 rounded-lg dark:text-white bg-transparent font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-405 uppercase mb-1">End Date</label>
                  <input
                    type="date"
                    value={newRepEnd}
                    onChange={(e) => setNewRepEnd(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-800 rounded-lg dark:text-white bg-transparent font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Technical Logbook Details</label>
                <textarea
                  placeholder="Describe the processes implemented, servers deployed, networking setups resolved..."
                  rows={5}
                  value={newRepContent}
                  onChange={(e) => setNewRepContent(e.target.value)}
                  className="w-full p-3 text-xs border border-slate-200 dark:border-slate-800 rounded-xl dark:text-white bg-transparent font-normal leading-relaxed text-slate-850 dark:text-slate-100"
                  required
                ></textarea>
              </div>

              {/* Reusable FileUploader drag drop & click */}
              <div className="border border-dashed border-slate-300 dark:border-slate-700 p-4 rounded-xl text-center bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition relative">
                <input
                  type="file"
                  onChange={handleDummyUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Paperclip className="w-5 h-5 text-slate-400 mx-auto mb-1.5" />
                <p className="text-[11px] font-bold text-indigo-650 dark:text-indigo-400">Click or Drag verification files to upload</p>
                <p className="text-[9px] text-slate-400 mt-1">PDF, JPG, PNG up to 10MB accepted</p>

                {uploadProgress !== null && (
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1 mt-2 overflow-hidden">
                    <div className="bg-indigo-600 h-1 transition-all duration-150" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                )}
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Uploaded Files</p>
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-xs">
                      <span>{f.name} ({f.size})</span>
                      <button
                        type="button"
                        onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}
                        className="text-rose-500 hover:scale-110 px-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => queryAiAssistant(newRepContent)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer animate-none"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  AI Report Constructor
                </button>
                <button
                  type="submit"
                  className="bg-slate-900 dark:bg-indigo-950 text-white hover:bg-slate-800 dark:hover:bg-slate-900 px-5 py-2 rounded-lg text-xs font-bold shadow-md cursor-pointer"
                >
                  Publish to Supervisor
                </button>
              </div>
            </form>

            {/* AI Summary feedback companion screen */}
            <div className="p-5 rounded-xl border bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-505 shrink-0" />
                  <h4 className="font-extrabold text-[10px] text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">
                    SIWES AI Assistant Insights
                  </h4>
                </div>

                {aiLoading ? (
                  <div className="space-y-2 py-4">
                    <div className="h-3 bg-slate-200 dark:bg-slate-804 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-804 rounded animate-pulse"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-804 rounded w-5/6 animate-pulse"></div>
                  </div>
                ) : aiResult ? (
                  <div className="space-y-3 text-xs leading-relaxed">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-250">Formal Abstract Formulation:</p>
                      <p className="italic text-slate-650 dark:text-slate-300 bg-white dark:bg-slate-950 p-3 rounded-lg border dark:border-slate-800 leading-relaxed mt-1">
                        {aiResult.summary}
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-slate-400 uppercase text-[9px] block">Highlights Suggestion:</span>
                      <ul className="list-disc pl-4 mt-1 space-y-1 text-slate-600 dark:text-slate-350 font-light">
                        {aiResult.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="font-bold text-slate-400 uppercase text-[9px] block">SIWES Manual Check:</span>
                      <ul className="list-disc pl-4 mt-1 space-y-1 text-slate-600 dark:text-slate-350 font-light">
                        {aiResult.suggestions.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t dark:border-slate-800 text-[9px] text-slate-400 text-right">
                      Powered by {aiResult.source}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 font-medium text-xs leading-relaxed">
                    Paste training tasks and press <strong className="text-indigo-500 font-bold">"AI Report Constructor"</strong> to invoke Google Gemini summaries.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historic logs list - pristine layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports
          .filter(r => searchQuery ? r.content.toLowerCase().includes(searchQuery.toLowerCase()) : true)
          .map((rep) => (
            <div key={rep.id} className={`p-6 rounded-2xl border flex flex-col justify-between transition-all hover:shadow-md ${systemCardClass}`}>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">SIWES Activity Sheet</span>
                    <h4 className="font-extrabold text-slate-800 dark:text-white mt-1">Week {rep.weekNumber}</h4>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold ${
                    rep.status === "Approved"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-350"
                      : rep.status === "Pending"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-350"
                      : "bg-rose-100 text-rose-800 dark:bg-rose-955 dark:text-rose-350"
                  }`}>
                    {rep.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-slate-650 dark:text-slate-305 leading-relaxed font-light mt-2 line-clamp-4">
                  {rep.content}
                </p>

                {rep.attachments && rep.attachments.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1">
                    {rep.attachments.map((f, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-[9px] bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 rounded border dark:border-slate-800">
                        <Paperclip className="w-2.5 h-2.5" />
                        {f.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-850 flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-mono">
                  Logged: {rep.submittedAt ? rep.submittedAt.split("T")[0] : "Draft"}
                </span>

                <div className="flex gap-2">
                  {role === "student" && rep.status !== "Approved" && (
                    <button
                      onClick={() => handleDeleteReport(rep.id)}
                      className="p-1 px-2 hover:bg-rose-50 dark:hover:bg-rose-950 rounded text-rose-600 max-sm:text-[10px] text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Discard
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedReport(rep);
                      setSupervisorFeedbackText(rep.supervisorFeedback || "");
                      setSupervisorGradeScore(rep.score || 85);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-1 px-3 bg-indigo-50 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-slate-750 text-indigo-705 dark:text-indigo-305 max-sm:text-[10px] text-xs font-bold rounded-lg transition cursor-pointer"
                  >
                    Inspect Details
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
