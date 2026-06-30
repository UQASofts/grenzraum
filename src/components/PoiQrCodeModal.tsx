import { useState } from "react";
import { X, QrCode, Download, Copy, Check, AlertCircle } from "lucide-react";
import { POI } from "../types";
import {
  getStampCollectUrl,
  getStampQrImageUrl,
  slugifyPoiName,
} from "../utils/stampQr";

interface PoiQrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  poi: POI | null;
}

export default function PoiQrCodeModal({ isOpen, onClose, poi }: PoiQrCodeModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !poi) return null;

  const collectUrl = getStampCollectUrl(poi.id);
  const qrImageUrl = getStampQrImageUrl(poi.id, 400);
  const downloadFileName = `${slugifyPoiName(poi.name) || poi.id}-stamp-qr.png`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(collectUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = downloadFileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(qrImageUrl, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-emerald-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Stamp QR Code
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col items-center p-6">
          <div className="mb-4 text-center">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-emerald-600">
              Digital stamp check-in
            </span>
            <p className="text-lg font-extrabold text-slate-900">{poi.name}</p>
            <p className="mt-0.5 text-xs text-slate-500">{poi.stampName}</p>
          </div>

          <div className="relative flex h-56 w-56 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-inner">
            <div className="absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-emerald-500/60" />
            <div className="absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 border-emerald-500/60" />
            <div className="absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-emerald-500/60" />
            <div className="absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-emerald-500/60" />

            <div className="flex h-44 w-44 items-center justify-center rounded-lg bg-white p-2 shadow-md">
              <img
                src={qrImageUrl}
                alt={`QR code for ${poi.name}`}
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <p className="mt-4 max-w-sm text-center text-xs leading-relaxed text-slate-500">
            Hikers scan this code with their phone camera to open the app and collect the{" "}
            <span className="font-semibold text-slate-700">{poi.stampName}</span> digital stamp.
          </p>

          {/* <div className="mt-4 flex w-full max-w-sm items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5">
            <span className="min-w-0 flex-1 truncate font-mono text-[10px] text-slate-500">
              {collectUrl}
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="shrink-0 text-slate-400 transition-colors hover:text-emerald-600"
              title="Copy check-in link"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div> */}

          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="mt-4 flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-emerald-500 disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {downloading ? "Preparing download…" : "Download QR Code"}
          </button>
        </div>

        {/* <div className="flex items-center justify-center gap-2 border-t border-slate-200 bg-slate-50 p-3 text-center">
          <AlertCircle className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-mono text-[10px] text-slate-500">
            POI ID: {poi.id} — encodes destination for mobile stamp collection
          </span>
        </div> */}
      </div>
    </div>
  );
}
