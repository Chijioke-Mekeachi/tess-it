/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = "student" | "supervisor" | "admin";

export interface SystemUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email: string;
  regNo?: string;
  phone?: string;
  details?: any;
}

export interface Student {
  id: string;
  name: string;
  regNo: string;
  department: string;
  institution: string;
  email: string;
  phone: string;
  supervisorId: string;
  companyName: string;
  avatarUrl: string;
  evaluationScore: number;
  evaluationFeedback: string;
}

export interface Supervisor {
  id: string;
  name: string;
  department: string;
  institution: string;
  email: string;
  avatarUrl: string;
  assignedStudentsCount: number;
}

export interface WeeklyReport {
  id: string;
  studentId: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  content: string;
  status: "Draft" | "Pending" | "Approved" | "Rejected";
  supervisorFeedback: string;
  attachments: Array<{ name: string; size: string }>;
  submittedAt?: string;
  score?: number | null;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: "present" | "absent" | "excused";
  time: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  target: "students" | "supervisors" | "all";
  priority: "normal" | "urgent";
  createdAt: string;
  author: string;
}

export interface SystemStats {
  totalStudents: number;
  totalSupervisors: number;
  totalReportsSubmitted: number;
  averageScore: number;
  pendingReviewCount: number;
  attendancePercentage: number;
}

export interface SystemNotification {
  id: string;
  message: string;
  role: string;
  targetUser: string;
  unread: boolean;
  timestamp: string;
}
