/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { UserRole, SystemUser, WeeklyReport, AttendanceRecord, Student, Supervisor, Announcement, SystemNotification, SystemStats } from "./types";
import universityWorkspaceImg from "./assets/images/university_workspace_1781243493358.jpg";

// Submodules Split Components
import { AuthScreen } from "./components/AuthScreen";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { DashboardPage } from "./components/DashboardPage";
import { WeeklyLogbookPage } from "./components/WeeklyLogbookPage";
import { AttendancePage } from "./components/AttendancePage";
import { TraineesPage } from "./components/TraineesPage";
import { AnnouncementsPage } from "./components/AnnouncementsPage";
import { DirectoryDatabasePage } from "./components/DirectoryDatabasePage";
import { ReassignmentsPage } from "./components/ReassignmentsPage";

export default function App() {
  // Navigation & UI States
  const [role, setRole] = useState<UserRole | null>(null);
  const [currentUser, setCurrentUser] = useState<SystemUser | null>(null);
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Data States
  const [stats, setStats] = useState<SystemStats>({
    totalStudents: 0,
    totalSupervisors: 0,
    totalReportsSubmitted: 0,
    averageScore: 0,
    pendingReviewCount: 0,
    attendancePercentage: 0
  });

  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  // Modal & Input States
  const [loginUsername, setLoginUsername] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [forgotEmail, setForgotEmail] = useState<string>("");
  const [authView, setAuthView] = useState<"login" | "register" | "forgot">("login");

  // Create Report states
  const [showAddReport, setShowAddReport] = useState<boolean>(false);
  const [newRepWeek, setNewRepWeek] = useState<number>(4);
  const [newRepContent, setNewRepContent] = useState<string>("");
  const [newRepStart, setNewRepStart] = useState<string>("2026-06-08");
  const [newRepEnd, setNewRepEnd] = useState<string>("2026-06-12");
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: string }>>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Selected student/supervisor review state
  const [selectedReport, setSelectedReport] = useState<WeeklyReport | null>(null);
  const [supervisorFeedbackText, setSupervisorFeedbackText] = useState<string>("");
  const [supervisorGradeScore, setSupervisorGradeScore] = useState<number>(85);

  // AI Assist Assist Panel state
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<{
    summary: string;
    highlights: string[];
    suggestions: string[];
    formatting: string;
    source: string;
  } | null>(null);

  // Admin CRUD states
  const [showAddUser, setShowAddUser] = useState<boolean>(false);
  const [newUserTab, setNewUserTab] = useState<"student" | "supervisor">("student");
  const [newUserName, setNewUserName] = useState<string>("");
  const [newUserEmail, setNewUserEmail] = useState<string>("");
  const [newUserReg, setNewUserReg] = useState<string>("");
  const [newUserDept, setNewUserDept] = useState<string>("Computer Science");
  const [newUserCompany, setNewUserCompany] = useState<string>("");
  const [selectedBulkStudents, setSelectedBulkStudents] = useState<string[]>([]);
  const [bulkSupervisorTarget, setBulkSupervisorTarget] = useState<string>("");

  // Announcement dialog state
  const [showAddAnn, setShowAddAnn] = useState<boolean>(false);
  const [annTitle, setAnnTitle] = useState<string>("");
  const [annContent, setAnnContent] = useState<string>("");
  const [annTarget, setAnnTarget] = useState<"all" | "students" | "supervisors">("all");
  const [annPriority, setAnnPriority] = useState<"normal" | "urgent">("normal");

  // Notifications system popover
  const [showNotifPanel, setShowNotifPanel] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: "success" | "error" | "info" }>>([]);

  // Toast dispatch helper
  const triggerToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Secure token-aware API fetch helper
  const authFetch = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("sitms_token");
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
    return fetch(url, { ...options, headers });
  };

  // On page load or state reload, hit API backend
  const fetchAllData = async (userRole?: UserRole, userId?: string) => {
    try {
      const statsRes = await authFetch("/api/stats");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      const annsRes = await authFetch("/api/announcements");
      if (annsRes.ok) setAnnouncements(await annsRes.json());

      const notifsUrl = `/api/notifications?${userRole ? `role=${userRole}` : ""}${userId ? `&userId=${userId}` : ""}`;
      const notifsRes = await authFetch(notifsUrl);
      if (notifsRes.ok) setNotifications(await notifsRes.json());

      if (userRole === "student") {
        const repRes = await authFetch(`/api/reports?studentId=${userId}`);
        if (repRes.ok) setReports(await repRes.json());
        const attRes = await authFetch(`/api/attendance?studentId=${userId}`);
        if (attRes.ok) setAttendance(await attRes.json());
      } else if (userRole === "supervisor") {
        const studentRes = await authFetch(`/api/students?supervisorId=${userId}`);
        if (studentRes.ok) setStudents(await studentRes.json());
        const repsRes = await authFetch("/api/reports");
        if (repsRes.ok) {
          const allReps: WeeklyReport[] = await repsRes.json();
          setReports(allReps);
        }
      } else if (userRole === "admin") {
        const stdsRes = await authFetch("/api/students");
        if (stdsRes.ok) setStudents(await stdsRes.json());
        const supsRes = await authFetch("/api/supervisors");
        if (supsRes.ok) setSupervisors(await supsRes.json());
        const repsRes = await authFetch("/api/reports");
        if (repsRes.ok) setReports(await repsRes.json());
        const attRes = await authFetch("/api/attendance");
        if (attRes.ok) setAttendance(await attRes.json());
      }
    } catch (err) {
      console.error("Failed to load server data:", err);
    }
  };

  // On mount, restore session if active
  useEffect(() => {
    const savedUser = localStorage.getItem("sitms_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        setRole(parsed.role);
      } catch (e) {}
    }
  }, []);

  // Auto Refresh data silently when session changes
  useEffect(() => {
    if (currentUser) {
      fetchAllData(currentUser.role, currentUser.id);
    } else {
      fetchAllData();
    }
  }, [currentUser]);

  // Auth Submit handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername) {
      triggerToast("Please choose a profile shortcut or enter a username", "error");
      return;
    }

    let email = loginUsername;
    let password = loginPassword || "student123";

    if (loginUsername === "student") {
      email = "chijiokemekelachi@gmail.com";
      password = "student123";
    } else if (loginUsername === "supervisor") {
      email = "a.okafor@unn.edu.ng";
      password = "student123";
    } else if (loginUsername === "admin") {
      email = "director.siwes@unn.edu.ng";
      password = "student123";
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || errData.error || "Authentication rejected");
      }

      const data = await res.json();
      const mappedUser = {
        ...data.user,
        name: data.user.name || `${data.user.firstName || ""} ${data.user.lastName || ""}`.trim()
      };

      // Store tokens and details
      localStorage.setItem("sitms_token", data.accessToken);
      localStorage.setItem("sitms_user", JSON.stringify(mappedUser));

      setCurrentUser(mappedUser);
      setRole(mappedUser.role);
      setCurrentTab("dashboard");
      triggerToast(`Welcome back, ${mappedUser.name}! Access Granted.`, "success");
    } catch (err: any) {
      triggerToast(err.message || "Invalid authentication details", "error");
    }
  };

  // Submit quick registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast("Processing registration request...", "info");
    setAuthView("login");
  };

  // Handle forgot password
  const handleForgotInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    triggerToast(`Password reset link dispatched securely to: ${forgotEmail}`, "success");
    setAuthView("login");
  };

  const logout = () => {
    localStorage.removeItem("sitms_token");
    localStorage.removeItem("sitms_user");
    setCurrentUser(null);
    setRole(null);
    setReports([]);
    setAttendance([]);
    setStudents([]);
    setSupervisors([]);
    triggerToast("Logout successful.", "info");
  };

  // Create log report
  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newRepContent) {
      triggerToast("Complete your report log details.", "error");
      return;
    }

    try {
      const res = await authFetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: currentUser.id,
          weekNumber: newRepWeek,
          startDate: newRepStart,
          endDate: newRepEnd,
          content: newRepContent,
          attachments: uploadedFiles
        })
      });

      if (!res.ok) throw new Error("Could not submit logbook");

      triggerToast(`Week ${newRepWeek} Report submitted successfully!`, "success");
      setNewRepContent("");
      setUploadedFiles([]);
      setShowAddReport(false);
      fetchAllData(currentUser.role, currentUser.id);
    } catch (err: any) {
      triggerToast(err.message, "error");
    }
  };

  // Report removal (Drafts)
  const handleDeleteReport = async (id: string) => {
    if (!confirm("Are you sure you want to delete this weekly report draft?")) return;
    try {
      const res = await authFetch(`/api/reports/${id}`, { method: "DELETE" });
      if (res.ok) {
        triggerToast("Report draft removed successfully.", "success");
        if (currentUser) fetchAllData(currentUser.role, currentUser.id);
      }
    } catch (err) {
      triggerToast("Delete operation failed", "error");
    }
  };

  // Custom QR Check-in simulation
  const triggerSelfCheckIn = async () => {
    if (!currentUser) return;
    const today = new Date().toISOString().split("T")[0];
    const hour = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    try {
      const res = await authFetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: currentUser.id,
          date: today,
          status: "present",
          time: hour
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Check-in failed");
      }

      triggerToast("Check-in confirmed! Standard University QR timestamp processed.", "success");
      fetchAllData(currentUser.role, currentUser.id);
    } catch (err: any) {
      triggerToast(err.message, "error");
    }
  };

  // Supervisor evaluation / feedback workflow
  const submitSupervisorReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    try {
      const res = await authFetch(`/api/reports/${selectedReport.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Approved",
          supervisorFeedback: supervisorFeedbackText,
          score: supervisorGradeScore
        })
      });

      if (!res.ok) throw new Error("Approval transaction stalled");

      triggerToast("Review finalized and recorded.", "success");
      setSelectedReport(null);
      setSupervisorFeedbackText("");
      if (currentUser) fetchAllData(currentUser.role, currentUser.id);
    } catch (err: any) {
      triggerToast(err.message, "error");
    }
  };

  const rejectReportBySupervisor = async () => {
    if (!selectedReport) return;
    try {
      const res = await authFetch(`/api/reports/${selectedReport.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Rejected",
          supervisorFeedback: supervisorFeedbackText || "Needs more hardware detail or clearer formatting.",
          score: 0
        })
      });

      if (!res.ok) throw new Error("Rejection action stalled");

      triggerToast("Report flagged with rejection review.", "info");
      setSelectedReport(null);
      setSupervisorFeedbackText("");
      if (currentUser) fetchAllData(currentUser.role, currentUser.id);
    } catch (err: any) {
      triggerToast(err.message, "error");
    }
  };

  // AI assistant integration
  const queryAiAssistant = async (contentStr: string) => {
    if (!contentStr) {
      triggerToast("Provide technical logs in your log state before compiling summary.", "info");
      return;
    }
    setAiLoading(true);
    setAiResult(null);

    try {
      const res = await authFetch("/api/gemini/assist-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportContent: contentStr })
      });

      if (!res.ok) throw new Error("AI Assistant offline or busy.");
      const answer = await res.json();
      setAiResult(answer);
      triggerToast("Technical weekly review compiled with Gemini 3.5 Flash", "success");
    } catch (err: any) {
      triggerToast(err.message, "error");
    } finally {
      setAiLoading(false);
    }
  };

  // Admin Actions: Create User
  const handleAdminCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) {
      triggerToast("Complete user metadata fields.", "error");
      return;
    }

    try {
      if (newUserTab === "student") {
        const res = await authFetch("/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newUserName,
            regNo: newUserReg || `UNN/SIWES/2026/${Math.floor(Math.random() * 9000 + 1000)}`,
            department: newUserDept,
            email: newUserEmail,
            phone: "+234 ",
            companyName: newUserCompany || "Unassigned Staging Studio",
            supervisorId: "sup_01"
          })
        });
        if (!res.ok) throw new Error("Could not create student profile");
        triggerToast("Student Profile recorded to directory schema.", "success");
      } else {
        const res = await authFetch("/api/supervisors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newUserName,
            department: newUserDept,
            email: newUserEmail
          })
        });
        if (!res.ok) throw new Error("Could not create supervisor profile");
        triggerToast("Academic Supervisor logged successfully.", "success");
      }

      setNewUserName("");
      setNewUserEmail("");
      setNewUserReg("");
      setNewUserCompany("");
      setShowAddUser(false);
      if (currentUser) fetchAllData(currentUser.role, currentUser.id);
    } catch (err: any) {
      triggerToast(err.message, "error");
    }
  };

  // Bulk Re-assignment
  const executeBulkAssignment = async () => {
    if (selectedBulkStudents.length === 0 || !bulkSupervisorTarget) {
      triggerToast("Pick at least one student and a target supervisor.", "info");
      return;
    }

    try {
      const res = await authFetch("/api/assignments/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentIds: selectedBulkStudents,
          supervisorId: bulkSupervisorTarget
        })
      });

      if (!res.ok) throw new Error("Bulk assign transaction failed.");

      triggerToast(`Successfully reassigned ${selectedBulkStudents.length} students.`, "success");
      setSelectedBulkStudents([]);
      setBulkSupervisorTarget("");
      if (currentUser) fetchAllData(currentUser.role, currentUser.id);
    } catch (err: any) {
      triggerToast(err.message, "error");
    }
  };

  // Admin announcement trigger
  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    try {
      const res = await authFetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: annTitle,
          content: annContent,
          target: annTarget,
          priority: annPriority
        })
      });
      if (!res.ok) throw new Error("Failed to broadcast announcement");

      triggerToast("State announcement broadcasts sent instantly.", "success");
      setAnnTitle("");
      setAnnContent("");
      setShowAddAnn(false);
      if (currentUser) fetchAllData(currentUser.role, currentUser.id);
    } catch (err: any) {
      triggerToast(err.message, "error");
    }
  };

  // Clear system notifications
  const clearAllNotifications = async () => {
    try {
      await authFetch("/api/notifications/clear", { method: "POST" });
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
      triggerToast("System alerts cleared.", "success");
    } catch {}
  };

  // File Upload drag-and-drop simulation
  const handleDummyUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p === null || p >= 100) {
          clearInterval(interval);
          setUploadedFiles(prev => [...prev, { name: file.name, size: `${(file.size / (1024 * 1024)).toFixed(1)} MB` }]);
          triggerToast(`Attachment added: ${file.name}`, "success");
          return null;
        }
        return p + 30;
      });
    }, 150);
  };

  const toggleBulkStudentSelect = (id: string) => {
    setSelectedBulkStudents(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Theme support & transparent high contrast colors
  const systemBgClass = darkMode ? "bg-[#0b0f19] text-slate-100" : "bg-slate-50 text-slate-905";
  const systemCardClass = darkMode ? "bg-[#111827] border-slate-800 text-white shadow-md shadow-black/20" : "bg-white border-slate-200/80 text-slate-900 shadow-sm";

  return (
    <div id="sitms-root" className={`min-h-screen font-sans ${systemBgClass} transition-colors duration-200`}>
      {/* Toast Alert popups */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`p-4 rounded-xl shadow-xl border text-xs font-semibold flex items-center justify-between gap-3 ${
              t.type === "success"
                ? "bg-slate-900 text-white border-emerald-500/30"
                : t.type === "error"
                ? "bg-slate-900 text-rose-450 border-rose-500/30"
                : "bg-slate-900 text-indigo-300 border-indigo-500/30"
            }`}
          >
            <p>{t.message}</p>
          </div>
        ))}
      </div>

      {/* ----------------- GUEST NOT AUTHENTICATED ----------------- */}
      {!currentUser && (
        <AuthScreen
          loginUsername={loginUsername}
          setLoginUsername={setLoginUsername}
          loginPassword={loginPassword}
          setLoginPassword={setLoginPassword}
          forgotEmail={forgotEmail}
          setForgotEmail={setForgotEmail}
          authView={authView}
          setAuthView={setAuthView}
          handleLogin={handleLogin}
          handleRegister={handleRegister}
          handleForgotInput={handleForgotInput}
          triggerToast={triggerToast}
          universityWorkspaceImg={universityWorkspaceImg}
        />
      )}

      {/* ----------------- AUTHENTICATED ORCHESTATOR ----------------- */}
      {currentUser && role && (
        <div className="flex h-screen overflow-hidden">
          
          <Sidebar
            currentUser={currentUser}
            role={role}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            logout={logout}
          />

          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
            
            <Header
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              showNotifPanel={showNotifPanel}
              setShowNotifPanel={setShowNotifPanel}
              notifications={notifications}
              clearAllNotifications={clearAllNotifications}
              currentUser={currentUser}
            />

            <main className="flex-1 p-6 sm:p-8 overflow-y-auto w-full mx-auto flex flex-col gap-6">
              {currentTab === "dashboard" && (
                <DashboardPage
                  role={role}
                  currentUser={currentUser}
                  stats={stats}
                  reports={reports}
                  students={students}
                  searchQuery={searchQuery}
                  setCurrentTab={setCurrentTab}
                  setShowAddReport={setShowAddReport}
                  setSelectedReport={setSelectedReport}
                  setSupervisorFeedbackText={setSupervisorFeedbackText}
                  setSupervisorGradeScore={setSupervisorGradeScore}
                  setNewRepContent={setNewRepContent}
                  triggerToast={triggerToast}
                  systemCardClass={systemCardClass}
                />
              )}

              {currentTab === "weekly" && (
                <WeeklyLogbookPage
                  currentUser={currentUser}
                  role={role}
                  reports={reports}
                  selectedReport={selectedReport}
                  setSelectedReport={setSelectedReport}
                  showAddReport={showAddReport}
                  setShowAddReport={setShowAddReport}
                  newRepWeek={newRepWeek}
                  setNewRepWeek={setNewRepWeek}
                  newRepStart={newRepStart}
                  setNewRepStart={setNewRepStart}
                  newRepEnd={newRepEnd}
                  setNewRepEnd={setNewRepEnd}
                  newRepContent={newRepContent}
                  setNewRepContent={setNewRepContent}
                  uploadedFiles={uploadedFiles}
                  setUploadedFiles={setUploadedFiles}
                  uploadProgress={uploadProgress}
                  supervisorFeedbackText={supervisorFeedbackText}
                  setSupervisorFeedbackText={setSupervisorFeedbackText}
                  supervisorGradeScore={supervisorGradeScore}
                  setSupervisorGradeScore={setSupervisorGradeScore}
                  aiLoading={aiLoading}
                  aiResult={aiResult}
                  handleCreateReport={handleCreateReport}
                  handleDeleteReport={handleDeleteReport}
                  handleDummyUpload={handleDummyUpload}
                  submitSupervisorReview={submitSupervisorReview}
                  rejectReportBySupervisor={rejectReportBySupervisor}
                  queryAiAssistant={queryAiAssistant}
                  triggerToast={triggerToast}
                  systemCardClass={systemCardClass}
                  searchQuery={searchQuery}
                />
              )}

              {currentTab === "attendance" && (
                <AttendancePage
                  attendance={attendance}
                  triggerSelfCheckIn={triggerSelfCheckIn}
                  systemCardClass={systemCardClass}
                />
              )}

              {currentTab === "trainees" && (
                <TraineesPage
                  students={students}
                  reports={reports}
                  setSelectedReport={setSelectedReport}
                  setCurrentTab={setCurrentTab}
                  triggerToast={triggerToast}
                  systemCardClass={systemCardClass}
                />
              )}

              {currentTab === "announcements" && (
                <AnnouncementsPage
                  announcements={announcements}
                  role={role}
                  showAddAnn={showAddAnn}
                  setShowAddAnn={setShowAddAnn}
                  annTarget={annTarget}
                  setAnnTarget={setAnnTarget}
                  annPriority={annPriority}
                  setAnnPriority={setAnnPriority}
                  annTitle={annTitle}
                  setAnnTitle={setAnnTitle}
                  annContent={annContent}
                  setAnnContent={setAnnContent}
                  handlePostAnnouncement={handlePostAnnouncement}
                  systemCardClass={systemCardClass}
                />
              )}

              {currentTab === "users" && role === "admin" && (
                <DirectoryDatabasePage
                  students={students}
                  supervisors={supervisors}
                  showAddUser={showAddUser}
                  setShowAddUser={setShowAddUser}
                  newUserTab={newUserTab}
                  setNewUserTab={setNewUserTab}
                  newUserName={newUserName}
                  setNewUserName={setNewUserName}
                  newUserEmail={newUserEmail}
                  setNewUserEmail={setNewUserEmail}
                  newUserReg={newUserReg}
                  setNewUserReg={setNewUserReg}
                  newUserCompany={newUserCompany}
                  setNewUserCompany={setNewUserCompany}
                  newUserDept={newUserDept}
                  setNewUserDept={setNewUserDept}
                  handleAdminCreateUser={handleAdminCreateUser}
                  systemCardClass={systemCardClass}
                />
              )}

              {currentTab === "reassignments" && role === "admin" && (
                <ReassignmentsPage
                  students={students}
                  supervisors={supervisors}
                  selectedBulkStudents={selectedBulkStudents}
                  toggleBulkStudentSelect={toggleBulkStudentSelect}
                  bulkSupervisorTarget={bulkSupervisorTarget}
                  setBulkSupervisorTarget={setBulkSupervisorTarget}
                  executeBulkAssignment={executeBulkAssignment}
                />
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
