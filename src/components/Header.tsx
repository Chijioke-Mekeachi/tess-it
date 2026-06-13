/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Search, Sun, Moon, Bell } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { SystemUser, SystemNotification } from "../types";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  showNotifPanel: boolean;
  setShowNotifPanel: (val: boolean) => void;
  notifications: SystemNotification[];
  clearAllNotifications: () => void;
  currentUser: SystemUser;
}

export function Header({
  darkMode,
  setDarkMode,
  searchQuery,
  setSearchQuery,
  showNotifPanel,
  setShowNotifPanel,
  notifications,
  clearAllNotifications,
  currentUser
}: HeaderProps) {
  return (
    <header className={`h-16 shrink-0 flex items-center justify-between px-6 sm:px-8 border-b ${
      darkMode ? "bg-[#0b0f19] border-slate-800" : "bg-white border-slate-100"
    } z-20`}>
      
      {/* Search interface */}
      <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-xl w-64 sm:w-96 border border-transparent focus-within:border-indigo-500/30 transition-all">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Filter student lists, reports, weekly records..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent text-xs outline-none w-full text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
        />
      </div>

      {/* Utility operations */}
      <div className="flex items-center gap-4 sm:gap-6">
        
        {/* Light/Dark Toggle */}
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-905 rounded-full text-slate-400 transition cursor-pointer"
          title="Toggle display scheme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-650" />}
        </button>

        {/* Notifications drawer popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifPanel(!showNotifPanel)}
            className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-905 rounded-full text-slate-400 transition cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-[#0b0f19]"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifPanel && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-50 text-xs text-slate-900 dark:text-slate-100"
              >
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-150 dark:border-slate-800 flex items-center justify-between">
                  <p className="font-bold">SIWES System Notifications</p>
                  <button onClick={clearAllNotifications} className="text-[10px] text-indigo-650 dark:text-indigo-400 font-bold hover:underline">
                    Clear Unread
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/85">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400">
                      No log actions submitted yet.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif.id} className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-850/50 transition ${notif.unread ? "bg-indigo-50/40 dark:bg-indigo-950/10 font-bold" : ""}`}>
                        <p className="leading-snug">{notif.message}</p>
                        <span className="text-[9px] text-slate-400 block mt-1">{notif.timestamp}</span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User avatar display */}
        <div className="flex items-center gap-3 border-l pl-4 sm:pl-6 border-slate-200 dark:border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-800 dark:text-indigo-400">{currentUser.name}</p>
            <p className="text-[9px] text-slate-400 font-mono tracking-wider">{currentUser.regNo || "University Staff"}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-extrabold shadow shadow-indigo-600/20">
            {currentUser.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
          </div>
        </div>
      </div>
    </header>
  );
}
