/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { SystemUser, UserRole } from "../types";

interface AuthScreenProps {
  loginUsername: string;
  setLoginUsername: (val: string) => void;
  loginPassword: string;
  setLoginPassword: (val: string) => void;
  forgotEmail: string;
  setForgotEmail: (val: string) => void;
  authView: "login" | "register" | "forgot";
  setAuthView: (view: "login" | "register" | "forgot") => void;
  handleLogin: (e: React.FormEvent) => void;
  handleRegister: (e: React.FormEvent) => void;
  handleForgotInput: (e: React.FormEvent) => void;
  triggerToast: (msg: string, type?: "success" | "error" | "info") => void;
  universityWorkspaceImg: string;
}

export function AuthScreen({
  loginUsername,
  setLoginUsername,
  loginPassword,
  setLoginPassword,
  forgotEmail,
  setForgotEmail,
  authView,
  setAuthView,
  handleLogin,
  handleRegister,
  handleForgotInput,
  triggerToast,
  universityWorkspaceImg
}: AuthScreenProps) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4 sm:p-6 relative" 
      style={{ backgroundImage: `url(${universityWorkspaceImg})` }}
    >
      {/* Tint overlay with glass blending */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[6px] z-0"></div>

      <div className="relative z-10 w-full max-w-5xl bg-white/95 dark:bg-slate-900/95 overflow-hidden rounded-3xl shadow-2xl border border-slate-200/25 dark:border-slate-800/50 flex flex-col md:flex-row transition-all duration-300">
        {/* Split Screen Branding */}
        <div className="md:w-5/12 bg-indigo-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden shrink-0">
          {/* Background gradient flares */}
          <div className="absolute -left-12 -top-12 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-cyan-600/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-950 font-extrabold text-xl shadow-lg">
                U
              </div>
              <div>
                <h1 className="font-extrabold text-lg tracking-wider">SITMS</h1>
                <p className="text-[10px] text-indigo-300 uppercase tracking-widest font-semibold">UNN SIWES Portal</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 my-10 sm:my-16 space-y-4">
            <span className="bg-indigo-400/25 text-indigo-200 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-indigo-400/20">
              Academic Session 2026/2027
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Student Industrial Training Portal.
            </h2>
            <p className="text-xs text-indigo-200/90 leading-relaxed font-light">
              A modern technical framework designed for the University of Nigeria, Nsukka (UNN). Record coordinates, synchronize system logbooks, generate AI summaries with Gemini, and interact seamlessly with academic coordinators.
            </p>
          </div>

          <div className="relative z-10 text-[10px] text-indigo-400 border-t border-indigo-900/80 pt-4 flex justify-between items-center">
            <span>© 2026 UNN Directorate</span>
            <span className="font-mono">v2.1</span>
          </div>
        </div>

        {/* Split Screen Auth Operations Form - Perfect High Contrast Visibility */}
        <div className="md:w-7/12 p-8 sm:p-10 flex flex-col justify-center bg-white dark:bg-[#0c101d]">
          {authView === "login" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">
                  Portal Sign In
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Enter credentials or select a quick shortcut account below to instantly pre-fill authentication:
                </p>
              </div>

              {/* High Contrast Shortcuts for fast review */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoginUsername("student");
                    setLoginPassword("student123");
                    triggerToast("Loaded Student Account: Chijioke", "success");
                  }}
                  className="p-2 text-left rounded-xl border border-slate-200 hover:border-indigo-500 dark:border-slate-800 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-indigo-50/20 transition"
                >
                  <p className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Trainee</p>
                  <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">Chijioke K.</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginUsername("supervisor");
                    setLoginPassword("student123");
                    triggerToast("Loaded Supervisor Staff: Dr. Okafor", "success");
                  }}
                  className="p-2 text-left rounded-xl border border-slate-200 hover:border-emerald-500 dark:border-slate-800 dark:hover:border-emerald-500 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-emerald-50/20 transition"
                >
                  <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Supervisor</p>
                  <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">Dr. Okafor</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginUsername("admin");
                    setLoginPassword("student123");
                    triggerToast("Loaded Administrator Session", "success");
                  }}
                  className="p-2 text-left rounded-xl border border-slate-200 hover:border-purple-500 dark:border-slate-800 dark:hover:border-purple-500 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-purple-50/20 transition"
                >
                  <p className="text-[9px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">SIWES Dir.</p>
                  <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">Dr. Aliyu</p>
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-705 dark:text-slate-300 font-bold mb-1">
                    USERNAME / CONFIGURATION EMAIL
                  </label>
                  <input
                    type="text"
                    placeholder="Configure manually or press role pills above"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-900/85 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] uppercase tracking-wider text-slate-705 dark:text-slate-300 font-bold">
                      PASSWORD SECRET
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthView("forgot")}
                      className="text-[10px] text-indigo-650 dark:text-indigo-400 font-bold hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-900/85 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.98] transition-all"
                >
                  Authenticate Active Session
                </button>
              </form>

              <div className="text-center text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/85">
                A new university student attaché?{" "}
                <button 
                  onClick={() => setAuthView("register")} 
                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline font-mono"
                >
                  Create Trainee Account
                </button>
              </div>
            </div>
          )}

          {authView === "register" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Trainee Registration
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Setup your academic SIWES logbook database record.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-600 dark:text-slate-300 mb-1">Full Student Name</label>
                  <input
                    type="text"
                    placeholder="Chijioke Kelachi"
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent rounded-xl dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-600 dark:text-slate-300 mb-1">Registration Matric Number</label>
                  <input
                    type="text"
                    placeholder="UNN/SIWES/2026/1023"
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent rounded-xl dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-600 dark:text-slate-300 mb-1">Academic Email</label>
                  <input
                    type="email"
                    placeholder="trainee@unn.edu.ng"
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent rounded-xl dark:text-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Confirm System Registry
                </button>
              </form>

              <div className="text-center text-[11px] text-slate-500 dark:text-slate-400">
                <button 
                  onClick={() => setAuthView("login")} 
                  className="text-indigo-650 dark:text-indigo-400 font-bold hover:underline"
                >
                  Return to Sign In
                </button>
              </div>
            </div>
          )}

          {authView === "forgot" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Recover Password
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Request security clearance link using registered email address.
                </p>
              </div>

              <form onSubmit={handleForgotInput} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-600 dark:text-slate-350 mb-1">Registered Student/Staff Email</label>
                  <input
                    type="email"
                    placeholder="f.yusuf@unn.edu.ng"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-xl dark:text-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
                >
                  Send Password Reset Blueprint
                </button>
              </form>

              <div className="text-center text-[11px] text-slate-500 dark:text-slate-400">
                <button 
                  onClick={() => setAuthView("login")} 
                  className="text-indigo-650 dark:text-indigo-400 font-semibold hover:underline"
                >
                  Back to Login page
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
