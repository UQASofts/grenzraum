import React, { useState } from "react";
import { RefreshCw, CheckCircle, Database, HardDrive, Wifi } from "lucide-react";
import { ApiLog } from "../types";
import { AppLanguage } from "../i18n/language";

interface BayernCloudDashboardProps {
  apiLogs: ApiLog[];
  onTriggerSync: () => void;
  language: AppLanguage;
}

export default function BayernCloudDashboard({
  apiLogs,
  onTriggerSync,
  language,
}: BayernCloudDashboardProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [localLogs, setLocalLogs] = useState<ApiLog[]>(apiLogs);

  const handleSyncClick = () => {
    setIsSyncing(true);
    setSyncProgress(0);

    const interval = setInterval(() => {
      setSyncProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          const newLog: ApiLog = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
            endpoint: "bayerncloud.api/sync/region/cross-border-ledger",
            method: "POST",
            status: 200,
            latency: Math.floor(Math.random() * 150) + 80,
            message:
              "Triggered global push/pull sync. Czech state registry synchronized with BayernCloud JSON models (8 assets synchronized).",
          };
          setLocalLogs((prevLogs) => [newLog, ...prevLogs]);
          onTriggerSync();
          return 100;
        }
        return prev + 10;
      });
    }, 250);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <span className="mb-1 block text-xs font-medium text-slate-500">
              BayernCloud API Status
            </span>
            <span className="flex items-center gap-2 text-xl font-bold text-emerald-600">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
              CONNECTED
            </span>
          </div>
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
            <Wifi className="h-6 w-6" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <span className="mb-1 block text-xs font-medium text-slate-500">
              Active Sync Zone
            </span>
            <span className="text-xl font-bold text-slate-900">ŠUMAVA / BAYERN</span>
          </div>
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <Database className="h-6 w-6" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <span className="mb-1 block text-xs font-medium text-slate-500">
              Database Sync Status
            </span>
            <span className="text-xl font-bold text-slate-900">
              {isSyncing ? `SYNCING (${syncProgress}%)` : "SYNCHRONIZED"}
            </span>
          </div>
          <div className="rounded-xl bg-slate-100 p-3">
            <HardDrive
              className={`h-6 w-6 ${isSyncing ? "animate-spin text-emerald-600" : "text-slate-500"}`}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="font-bold text-slate-900">
              {language === "en" ? "Ledger Synchronization" : "Synchronizace Databáze"}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {language === "en"
                ? "Reconcile local hiking trail check-ins with the regional BayernCloud tourism registry."
                : "Porovnejte místní turistická data s bavorskou regionální databází BayernCloud."}
            </p>
          </div>

          <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-4">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7omGRgIAlKLk1xtNcS81mWyieeTnYuILemfzE_Va9bO9qAzxKZhrHhoToL4BDxov63O1CxBaduv8eecc-V6gZ5zd5dlRe1y-m0tcTv1YMvOXuPrM34kKcdsqsmcT6pgTSM1ntBQhcfAw7CO6v75cLHnmUHQo3sUtgxBhiNThoSGlhi5VctxhX0d0iyvDcYIZvmfAmq7hrpL8X-FifmVbQBusRu7IkF_M1ZhKlfsBkVNAeGW7UvYgj2qJtOACR7iOTvSdohKI_Fgwp"
              alt="BayernCloud Map Coverage"
              className="absolute inset-0 h-full w-full object-cover opacity-50"
            />
            <div className="absolute left-1/2 top-1/3 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
              <span className="absolute h-5 w-5 animate-ping rounded-full border border-emerald-400 bg-emerald-500/20" />
              <span className="relative h-3 w-3 rounded-full border-2 border-white bg-emerald-500 shadow" />
              <span className="mt-2 rounded border border-slate-200 bg-white/95 px-2 py-0.5 text-[9px] font-bold text-emerald-700 shadow-sm">
                ACTIVE ZONE: ŠUMAVA-REGEN
              </span>
            </div>

            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-white/95 px-3 py-1.5 shadow-sm">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span className="text-[10px] font-semibold text-slate-700">
                {language === "en"
                  ? "Geofencing Nodes: Active (8/8)"
                  : "Geofence Uzly: Aktivní (8/8)"}
              </span>
            </div>
          </div>

          {isSyncing && (
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-xs text-emerald-700">
                <span>Pulling BayernCloud endpoint datasets...</span>
                <span>{syncProgress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${syncProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-slate-200 pt-4">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-slate-400" />
              <span className="text-[11px] text-slate-500">Last connection check: 3m ago</span>
            </div>
            <button
              onClick={handleSyncClick}
              disabled={isSyncing}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                isSyncing
                  ? "cursor-not-allowed bg-slate-100 text-slate-400"
                  : "cursor-pointer bg-emerald-600 text-white shadow-sm hover:bg-emerald-500"
              }`}
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Syncing..." : "Trigger Sync Zone Manual"}</span>
            </button>
          </div>
        </div>

        <div className="flex h-[480px] flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5">
          <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="font-bold text-slate-900">
                {language === "en" ? "Connection logs" : "Záznamy připojení"}
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                {language === "en"
                  ? "Real-time BayernCloud API queries"
                  : "Dotazy na BayernCloud API v reálném čase"}
              </p>
            </div>
            <div className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[9px] text-slate-500">
              REST v2
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-[10px]">
            {localLogs.map((log) => (
              <div key={log.id} className="border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-slate-400">{log.timestamp}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                        log.method === "GET"
                          ? "bg-blue-50 text-blue-700"
                          : log.method === "POST"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {log.method}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-semibold ${
                      log.status === 200 ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {log.status} OK ({log.latency}ms)
                  </span>
                </div>
                <div className="break-all font-semibold text-slate-800">{log.endpoint}</div>
                <div className="mt-1 border-l-2 border-slate-200 pl-2 leading-normal text-slate-500">
                  {log.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
