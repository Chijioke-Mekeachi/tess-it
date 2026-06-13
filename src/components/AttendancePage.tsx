/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { QrCode } from "lucide-react";
import { AttendanceRecord } from "../types";

interface AttendancePageProps {
  attendance: AttendanceRecord[];
  triggerSelfCheckIn: () => void;
  systemCardClass: string;
}

export function AttendancePage({
  attendance,
  triggerSelfCheckIn,
  systemCardClass
}: AttendancePageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white uppercase tracking-wider">Attendance stamp</h2>
        <p className="text-xs text-slate-500 mt-1">Authenticate physical location daily checkpoint coordinate stamping</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Check In Panel Card */}
        <div className={`p-6 rounded-2xl border text-center flex flex-col justify-between ${systemCardClass}`}>
          <div>
            <span className="inline-block bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-300/40">
              Active coordinate sensor
            </span>

            <div className="my-8 flex justify-center">
              {/* Stylized QR layout */}
              <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl border-4 border-indigo-505 shadow-xl inline-block group relative">
                <div className="w-32 h-32 bg-slate-900 rounded flex items-center justify-center border border-dashed border-slate-705">
                  <QrCode className="w-16 h-16 text-white" />
                </div>
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-indigo-650 text-white text-[9px] font-bold px-3 py-0.5 rounded-full whitespace-nowrap">
                  COORDINATES VERIFIED
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              Scan coordinates at your registered SIWES workspace to log timestamp logs to the directory endpoint.
            </p>
          </div>

          <button
            onClick={triggerSelfCheckIn}
            className="w-full mt-6 bg-indigo-600 hover:bg-slate-900 dark:hover:bg-indigo-700 text-white py-3.5 rounded-xl text-xs font-bold shadow-lg transition active:scale-95 cursor-pointer"
          >
            STAMP PRESENT STATUS TODAY
          </button>
        </div>

        {/* Timeline Grid list */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border ${systemCardClass}`}>
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-305 mb-4">Historical Stamping Timelines</h3>
          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {attendance.length === 0 ? (
              <div className="text-center py-12 text-slate-400 font-sans text-xs">
                No timestamps checked yet. Use the coordinate scanner to mark today as present.
              </div>
            ) : (
              attendance.map((rec) => (
                <div key={rec.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-between border dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-xs text-emerald-500 font-extrabold">
                      P
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{rec.date}</p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Stamped: {rec.time}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 text-[9px] font-bold uppercase rounded-md">
                    Present
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
