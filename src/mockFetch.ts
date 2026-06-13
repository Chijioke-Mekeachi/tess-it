/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Pure Client-side Mock API Fetch Interceptor
// Disconnects the frontend from the real backend entirely to make it a standalone React/Vite SPA.
// Uses localStorage to persist database changes so that all workflow features remain fully functional.

const MOCK_STORAGE_KEY = "sitms_mock_db";

interface MockDB {
  users: any[];
  students: any[];
  supervisors: any[];
  weeklyReports: any[];
  attendance: any[];
  announcements: any[];
  notifications: any[];
}

const INITIAL_DB: MockDB = {
  users: [
    {
      _id: "usr_admin",
      firstName: "Beatrice",
      lastName: "Aliyu",
      email: "director.siwes@unn.edu.ng",
      password: "student123",
      role: "admin",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "usr_sup01",
      firstName: "Anthony",
      lastName: "Okafor",
      email: "a.okafor@unn.edu.ng",
      password: "student123",
      role: "supervisor",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "usr_std01",
      firstName: "Chijioke",
      lastName: "Kelachi",
      email: "chijiokemekelachi@gmail.com",
      password: "student123",
      role: "student",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  students: [
    {
      id: "usr_std01",
      name: "Chijioke Kelachi",
      regNo: "UNN/SIWES/2026/1024",
      department: "Computer Science & Engineering",
      faculty: "Physical Sciences",
      institution: "University of Nigeria, Nsukka",
      companyName: "Google Tech Hub (AI & Embedded Systems), Lagos",
      companyAddress: "Alfred Rewane Road, Ikoyi, Lagos, Nigeria",
      supervisorId: "usr_sup01",
      email: "chijiokemekelachi@gmail.com",
      phone: "+234 812 345 6789",
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80",
      evaluationScore: 0,
      evaluationFeedback: ""
    }
  ],
  supervisors: [
    {
      id: "usr_sup01",
      name: "Anthony Okafor",
      department: "Computer Engineering",
      institution: "University of Nigeria, Nsukka",
      email: "a.okafor@unn.edu.ng",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
      assignedStudentsCount: 1
    }
  ],
  weeklyReports: [
    {
      id: "rep_01",
      studentId: "usr_std01",
      weekNumber: 1,
      startDate: "2026-06-01",
      endDate: "2026-06-05",
      content: "First week at Google Tech Hub! Configured Linux development environments, setup Node.js backend controllers, and completed baseline training for the University network schema.",
      status: "Approved",
      supervisorFeedback: "Excellent initial entry. Keep documenting hardware details and software flows.",
      attachments: [{ name: "onboarding-guide.pdf", size: "1.2 MB" }],
      submittedAt: new Date().toISOString(),
      score: 95
    },
    {
      id: "rep_02",
      studentId: "usr_std01",
      weekNumber: 2,
      startDate: "2026-06-08",
      endDate: "2026-06-12",
      content: "Week 2 tasks: Explored full-stack REST routes, debugged CORS headers on express middlewares, and built automated test suites using Mocha.",
      status: "Pending",
      supervisorFeedback: "",
      attachments: [{ name: "api_config_capture.png", size: "420 KB" }],
      submittedAt: new Date().toISOString(),
      score: null
    }
  ],
  attendance: [
    {
      id: "att_01",
      studentId: "usr_std01",
      date: new Date().toISOString().split("T")[0],
      status: "present",
      time: "08:15 AM"
    }
  ],
  announcements: [
    {
      id: "ann_01",
      title: "Mid-Term SIWES Logbook Defense",
      content: "All UNN engineering and computer science students are reminded that the mid-term defense holds online. Prepare your physical logbooks stamped by your workplace supervisor.",
      target: "students",
      priority: "urgent",
      createdAt: new Date().toISOString(),
      author: "Director of SIWES (UNN)"
    }
  ],
  notifications: [
    {
      id: "nt_01",
      message: "Dr. Anthony Okafor approved your Week 1 logbook entry.",
      role: "student",
      targetUser: "usr_std01",
      unread: true,
      timestamp: "2 hours ago"
    },
    {
      id: "nt_03",
      message: "New weekly report submitted by Chijioke Kelachi.",
      role: "supervisor",
      targetUser: "usr_sup01",
      unread: true,
      timestamp: "6 hours ago"
    },
    {
      id: "nt_04",
      message: "SIWES Directorate posted an urgent update: Mid-Term Defense.",
      role: "all",
      targetUser: "",
      unread: false,
      timestamp: "1 day ago"
    }
  ]
};

// Retrieve DB helper
function getDB(): MockDB {
  const stored = localStorage.getItem(MOCK_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(INITIAL_DB));
    return INITIAL_DB;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_DB;
  }
}

// Save DB helper
function saveDB(db: MockDB) {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(db));
}

// Native fetch backup
const originalFetch = window.fetch;

// Intercept window.fetch entirely
window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const urlStr = typeof input === "string" ? input : (input as any).url || input.toString();
  
  if (!urlStr.includes("/api/")) {
    return originalFetch(input, init);
  }

  // Artificial latency for realism (200ms)
  await new Promise((resolve) => setTimeout(resolve, 200));

  const db = getDB();
  const options = init || {};
  const method = (options.method || "GET").toUpperCase();
  const parsedUrl = new URL(urlStr, window.location.origin);
  const path = parsedUrl.pathname;

  let responseBody: any = null;
  let status = 200;

  try {
    // 1. LOGIN API
    if (path === "/api/auth/login" && method === "POST") {
      const { email, password } = JSON.parse(options.body as string);
      const matchedUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!matchedUser) {
        status = 404;
        responseBody = { error: "User credentials not recognized in administrative system." };
      } else {
        responseBody = {
          accessToken: `mock-jwt-${matchedUser._id}`,
          user: {
            id: matchedUser._id,
            username: matchedUser.email.split("@")[0],
            name: `${matchedUser.firstName} ${matchedUser.lastName}`,
            email: matchedUser.email,
            role: matchedUser.role
          }
        };
      }
    }

    // 2. STATS API
    else if (path === "/api/stats" && method === "GET") {
      const reportsList = db.weeklyReports;
      const approvedWithScore = reportsList.filter(r => r.status === "Approved" && r.score !== null);
      const avgScore = approvedWithScore.length > 0 
        ? Math.round(approvedWithScore.reduce((sum, r) => sum + (r.score || 0), 0) / approvedWithScore.length)
        : 0;

      const totalAttendance = db.attendance.length;
      const presentAttendance = db.attendance.filter(a => a.status === "present").length;
      const attPct = totalAttendance > 0 ? Math.round((presentAttendance / totalAttendance) * 100) : 100;

      responseBody = {
        totalStudents: db.students.length,
        totalSupervisors: db.supervisors.length,
        totalReportsSubmitted: reportsList.length,
        averageScore: avgScore || 85,
        pendingReviewCount: reportsList.filter(r => r.status === "Pending").length,
        attendancePercentage: attPct || 100
      };
    }

    // 3. ANNOUNCEMENTS API
    else if (path === "/api/announcements") {
      if (method === "GET") {
        responseBody = db.announcements;
      } else if (method === "POST") {
        const bodyObj = JSON.parse(options.body as string);
        const newAnn = {
          id: `ann_${Date.now()}`,
          title: bodyObj.title,
          content: bodyObj.content,
          target: bodyObj.target || "all",
          priority: bodyObj.priority || "normal",
          createdAt: new Date().toISOString(),
          author: "Director of SIWES (UNN)"
        };
        db.announcements.unshift(newAnn);
        saveDB(db);
        responseBody = newAnn;
        status = 201;
      }
    }

    // 4. NOTIFICATIONS API
    else if (path === "/api/notifications") {
      if (method === "GET") {
        const roleQuery = parsedUrl.searchParams.get("role");
        const userIdQuery = parsedUrl.searchParams.get("userId");
        let filtered = db.notifications;
        if (roleQuery || userIdQuery) {
          filtered = db.notifications.filter(n => {
            const matchRole = n.role === "all" || n.role === roleQuery;
            const matchUser = !n.targetUser || n.targetUser === userIdQuery;
            return matchRole && matchUser;
          });
        }
        responseBody = filtered;
      }
    }

    else if (path === "/api/notifications/clear" && method === "POST") {
      db.notifications = db.notifications.map(n => ({ ...n, unread: false }));
      saveDB(db);
      responseBody = { success: true };
    }

    // 5. REPORTS API
    else if (path === "/api/reports") {
      if (method === "GET") {
        const studentId = parsedUrl.searchParams.get("studentId");
        if (studentId) {
          responseBody = db.weeklyReports.filter(r => r.studentId === studentId);
        } else {
          responseBody = db.weeklyReports;
        }
      } else if (method === "POST") {
        const bodyObj = JSON.parse(options.body as string);
        const newReport = {
          id: `rep_${Date.now()}`,
          studentId: bodyObj.studentId,
          weekNumber: Number(bodyObj.weekNumber),
          startDate: bodyObj.startDate,
          endDate: bodyObj.endDate,
          content: bodyObj.content,
          status: "Pending",
          supervisorFeedback: "",
          attachments: bodyObj.attachments || [],
          submittedAt: new Date().toISOString(),
          score: null
        };
        db.weeklyReports.unshift(newReport);

        // Add a notification to supervisor
        const supervisor = db.supervisors[0];
        const student = db.students.find(s => s.id === bodyObj.studentId);
        if (supervisor && student) {
          db.notifications.unshift({
            id: `nt_${Date.now()}`,
            message: `New logbook report (Week ${bodyObj.weekNumber}) submitted by ${student.name}.`,
            role: "supervisor",
            targetUser: supervisor.id,
            unread: true,
            timestamp: "Just now"
          });
        }

        saveDB(db);
        responseBody = newReport;
        status = 201;
      }
    }

    // 5b. SINGLE REPORT ACTIONS
    else if (path.startsWith("/api/reports/")) {
      const id = path.split("/").pop();
      const reportIndex = db.weeklyReports.findIndex(r => r.id === id);

      if (reportIndex === -1) {
        status = 404;
        responseBody = { error: "Logbook report draft not found." };
      } else {
        if (method === "DELETE") {
          db.weeklyReports.splice(reportIndex, 1);
          saveDB(db);
          responseBody = { success: true };
        } else if (method === "PUT") {
          const bodyObj = JSON.parse(options.body as string);
          const report = db.weeklyReports[reportIndex];
          
          if (bodyObj.status) report.status = bodyObj.status;
          if (bodyObj.supervisorFeedback !== undefined) report.supervisorFeedback = bodyObj.supervisorFeedback;
          if (bodyObj.score !== undefined) report.score = bodyObj.score;
          
          // Custom check for notification
          if (bodyObj.status === "Approved") {
            db.notifications.unshift({
              id: `nt_${Date.now()}`,
              message: `Dr. Anthony Okafor approved your Week ${report.weekNumber} logbook entry.`,
              role: "student",
              targetUser: report.studentId,
              unread: true,
              timestamp: "Just now"
            });
          }

          saveDB(db);
          responseBody = report;
        }
      }
    }

    // 6. ATTENDANCE API
    else if (path === "/api/attendance") {
      if (method === "GET") {
        const studentId = parsedUrl.searchParams.get("studentId");
        if (studentId) {
          responseBody = db.attendance.filter(a => a.studentId === studentId);
        } else {
          responseBody = db.attendance;
        }
      } else if (method === "POST") {
        const bodyObj = JSON.parse(options.body as string);
        const newAtt = {
          id: `att_${Date.now()}`,
          studentId: bodyObj.studentId,
          date: bodyObj.date || new Date().toISOString().split("T")[0],
          status: bodyObj.status || "present",
          time: bodyObj.time || "08:30 AM"
        };
        
        // Remove prior duplicate attendance for the same day
        db.attendance = db.attendance.filter(a => !(a.studentId === bodyObj.studentId && a.date === newAtt.date));
        
        db.attendance.unshift(newAtt);
        saveDB(db);
        responseBody = newAtt;
        status = 201;
      }
    }

    // 7. STUDENTS API
    else if (path === "/api/students") {
      if (method === "GET") {
        const supervisorId = parsedUrl.searchParams.get("supervisorId");
        if (supervisorId) {
          responseBody = db.students.filter(s => s.supervisorId === supervisorId);
        } else {
          responseBody = db.students;
        }
      } else if (method === "POST") {
        const bodyObj = JSON.parse(options.body as string);
        const mockStudentId = `usr_std_${Date.now()}`;
        
        // Create user
        const newUser = {
          _id: mockStudentId,
          firstName: bodyObj.name.split(" ")[0] || "Student",
          lastName: bodyObj.name.split(" ").slice(1).join(" ") || "Trainee",
          email: bodyObj.email,
          password: "student123",
          role: "student",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        db.users.push(newUser);

        // Create student record
        const newStudent = {
          id: mockStudentId,
          name: bodyObj.name,
          regNo: bodyObj.regNo,
          department: bodyObj.department,
          faculty: "Physical Sciences",
          institution: "University of Nigeria, Nsukka",
          companyName: bodyObj.companyName || "Staging Workspace",
          companyAddress: "Lagos, Nigeria",
          supervisorId: bodyObj.supervisorId || "usr_sup01",
          email: bodyObj.email,
          phone: bodyObj.phone || "+234 800 000 0000",
          avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80",
          evaluationScore: 0,
          evaluationFeedback: ""
        };
        db.students.push(newStudent);

        // Increment supervisor counter
        const sup = db.supervisors.find(sp => sp.id === newStudent.supervisorId);
        if (sup) {
          sup.assignedStudentsCount = (sup.assignedStudentsCount || 0) + 1;
        }

        saveDB(db);
        responseBody = newStudent;
        status = 201;
      }
    }

    // 8. SUPERVISORS API
    else if (path === "/api/supervisors") {
      if (method === "GET") {
        responseBody = db.supervisors;
      } else if (method === "POST") {
        const bodyObj = JSON.parse(options.body as string);
        const mockSupId = `usr_sup_${Date.now()}`;

        // Create user
        const newUser = {
          _id: mockSupId,
          firstName: bodyObj.name.split(" ")[0] || "Supervisor",
          lastName: bodyObj.name.split(" ").slice(1).join(" ") || "Assoc.",
          email: bodyObj.email,
          password: "student123",
          role: "supervisor",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        db.users.push(newUser);

        const newSup = {
          id: mockSupId,
          name: bodyObj.name,
          department: bodyObj.department || "Computer Science",
          institution: "University of Nigeria, Nsukka",
          email: bodyObj.email,
          avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
          assignedStudentsCount: 0
        };
        db.supervisors.push(newSup);

        saveDB(db);
        responseBody = newSup;
        status = 201;
      }
    }

    // 9. REASSIGNMENTS (BULK)
    else if (path === "/api/assignments/bulk" && method === "POST") {
      const { studentIds, supervisorId } = JSON.parse(options.body as string);
      
      db.students = db.students.map(s => {
        if (studentIds.includes(s.id)) {
          return { ...s, supervisorId };
        }
        return s;
      });

      // Recalculate assigned counts
      db.supervisors = db.supervisors.map(sup => {
        const assigned = db.students.filter(stud => stud.supervisorId === sup.id).length;
        return { ...sup, assignedStudentsCount: assigned };
      });

      saveDB(db);
      responseBody = { success: true };
    }

    // 10. AI GENERATOR (GEMINI SIMULATION)
    else if (path === "/api/gemini/assist-report" && method === "POST") {
      const { reportContent } = JSON.parse(options.body as string);
      
      const summary = `This technical weekly logbook outlines critical workplace tasks involving computer hardware architectures, structured cabling, or server deployment. The reporter successfully carried out systems planning, addressed unexpected network loop failures, and implemented diagnostic tests. These metrics align with standard university directives for technical hands-on industrial exposure.`;
      
      const highlights = [
        "Identified hardware/software incompatibilities and isolated fault vectors.",
        "Demonstrated technical documentation workflow to increase future serviceability.",
        "Collaborated with on-site IT operations specialists on complex subnet allocations."
      ];

      const suggestions = [
        "Include schematic diagrams or configuration files as supplementary uploads.",
        "Document step-by-step diagnostic measures, including ping logs or routing tables.",
        "Seek a formal industry stamp on your printed weekly sheets before final evaluation."
      ];

      responseBody = {
        summary,
        highlights,
        suggestions,
        formatting: "The weekly report meets all industrial and presentation standards.",
        source: "Gemini 3.5 Flash (Academic Simulation Mode)"
      };
    }

    // FALLBACK
    else {
      status = 404;
      responseBody = { error: `Server route ${method} ${path} was not recovered in client-side pretend database.` };
    }

  } catch (err: any) {
    status = 500;
    responseBody = { error: err.message || "Failed processing request." };
  }

  // Create Response object simulation
  return new Response(JSON.stringify(responseBody), {
    status,
    headers: { "Content-Type": "application/json" }
  });
};

console.log("[SITMS WEB INTERCEPTOR] Fully decoupled mock API listening on /api/*");
