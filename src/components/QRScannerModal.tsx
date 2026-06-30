import { useCallback, useEffect, useRef, useState } from "react";
import { X, QrCode, Sparkles, CheckCircle, AlertCircle, Camera } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { parseCollectPoiIdFromScan } from "../utils/stampQr";
import { AppLanguage, tr } from "../i18n/language";
import { loadHikerSession } from "../utils/hikerSession";

const READER_ELEMENT_ID = "stamp-qr-reader";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  poiName: string;
  language: AppLanguage;
  isLoggedIn: boolean;
  preferredCameraId?: string;
  preflightPermissionDenied?: boolean;
  onStampScanned: (poiId: string) => void;
  onRequireLogin: (poiId: string) => void;
}

type ScannerPhase = "scanning" | "success" | "error";

export default function QRScannerModal({
  isOpen,
  onClose,
  poiName,
  language,
  isLoggedIn,
  preferredCameraId,
  preflightPermissionDenied = false,
  onStampScanned,
  onRequireLogin,
}: QRScannerModalProps) {
  const txt = (en: string, de: string, cs: string) => tr(language, en, de, cs);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannedRef = useRef(false);

  const [phase, setPhase] = useState<ScannerPhase>("scanning");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [scanAttempt, setScanAttempt] = useState(0);

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    if (!scanner) return;
    try {
      await scanner.stop();
    } catch {
      /* not running */
    }
    try {
      scanner.clear();
    } catch {
      /* already cleared */
    }
  }, []);

  const handleDecoded = useCallback(
    (text: string) => {
      if (scannedRef.current) return;

      const poiId = parseCollectPoiIdFromScan(text);
      if (!poiId) {
        setScanError(
          txt(
            "This QR code is not a valid stamp check-in code.",
            "Dieser QR-Code ist kein gültiger Stempel-Check-in-Code.",
            "Tento QR kód není platný kód pro získání razítka."
          )
        );
        setPhase("error");
        return;
      }

      scannedRef.current = true;
      void stopScanner();

      const hasSession = isLoggedIn || !!loadHikerSession();
      if (!hasSession) {
        onRequireLogin(poiId);
        onClose();
        return;
      }

      setPhase("success");
      setTimeout(() => {
        onStampScanned(poiId);
        onClose();
      }, 1400);
    },
    [isLoggedIn, onClose, onRequireLogin, onStampScanned, stopScanner, language]
  );

  useEffect(() => {
    if (!isOpen) {
      scannedRef.current = false;
      setPhase("scanning");
      setCameraError(null);
      setScanError(null);
      setIsStarting(false);
      void stopScanner();
      return;
    }

    if (preflightPermissionDenied) {
      setCameraError(
        txt(
          "Camera access was denied. In Settings → Safari → Camera, allow access for this site, then try again.",
          "Kamerazugriff verweigert. Erlauben Sie die Kamera unter Einstellungen → Safari → Kamera.",
          "Přístup ke kameře byl odepřen. Povolte kameru v Nastavení → Safari → Kamera."
        )
      );
      return;
    }

    scannedRef.current = false;
    setPhase("scanning");
    setCameraError(null);
    setScanError(null);

    let cancelled = false;

    const startScanner = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError(
          txt(
            "Camera access is not available in this browser. Scan the printed QR code with your iPhone Camera app instead — the link will open here and collect your stamp.",
            "Kamerazugriff nicht verfügbar. Scannen Sie den gedruckten QR-Code mit der iPhone-Kamera.",
            "Přístup ke kameře není k dispozici. Naskenujte vytištěný QR kód fotoaparátem iPhonu."
          )
        );
        return;
      }

      setIsStarting(true);

      try {
        await stopScanner();
        if (cancelled) return;

        const scanner = new Html5Qrcode(READER_ELEMENT_ID, false);
        scannerRef.current = scanner;

        const cameraConfig = preferredCameraId ?? { facingMode: "environment" };

        await scanner.start(
          cameraConfig,
          {
            fps: 10,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const edge = Math.min(viewfinderWidth, viewfinderHeight);
              const size = Math.floor(edge * 0.72);
              return { width: size, height: size };
            },
            disableFlip: false,
          },
          (decodedText) => {
            if (!cancelled && !scannedRef.current) {
              handleDecoded(decodedText);
            }
          },
          () => {
            /* per-frame decode miss — expected while scanning */
          }
        );
      } catch {
        if (!cancelled) {
          setCameraError(
            txt(
              "Could not start the camera. Allow camera access in Safari Settings, or scan the sign QR with your iPhone Camera app.",
              "Kamera konnte nicht gestartet werden. Erlauben Sie den Kamerazugriff in den Safari-Einstellungen oder nutzen Sie die iPhone-Kamera.",
              "Kameru se nepodařilo spustit. Povolte přístup ke kameře v nastavení Safari, nebo použijte fotoaparát iPhonu."
            )
          );
        }
      } finally {
        if (!cancelled) {
          setIsStarting(false);
        }
      }
    };

    const frame = requestAnimationFrame(() => {
      void startScanner();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      void stopScanner();
    };
  }, [
    isOpen,
    scanAttempt,
    handleDecoded,
    stopScanner,
    language,
    preferredCameraId,
    preflightPermissionDenied,
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 animate-pulse text-emerald-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              {txt("Scan Stamp QR Code", "Stempel-QR-Code scannen", "Skenovat QR razítko")}
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
              {txt("At the destination", "Am Zielort", "V místě cíle")}
            </span>
            <span className="text-lg font-extrabold text-slate-900">{poiName}</span>
          </div>

          <div className="relative flex h-64 w-full max-w-xs flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-inner">
            {phase === "success" ? (
              <div className="flex flex-col items-center gap-3 p-4 text-center animate-fade-in">
                <div className="rounded-full border border-emerald-500 bg-emerald-50 p-3 text-emerald-600">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-emerald-600">
                  <Sparkles className="h-3.5 w-3.5" />
                  {txt("Stamp collected!", "Stempel gesammelt!", "Razítko získáno!")}
                </div>
              </div>
            ) : phase === "error" ? (
              <div className="flex flex-col items-center gap-3 p-6 text-center">
                <AlertCircle className="h-10 w-10 text-rose-500" />
                <p className="text-xs text-slate-300">{scanError}</p>
                <button
                  type="button"
                  onClick={() => {
                    scannedRef.current = false;
                    setPhase("scanning");
                    setScanError(null);
                    setScanAttempt((n) => n + 1);
                  }}
                  className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-800"
                >
                  {txt("Try again", "Erneut versuchen", "Zkusit znovu")}
                </button>
              </div>
            ) : cameraError ? (
              <div className="flex flex-col items-center gap-3 p-6 text-center">
                <Camera className="h-10 w-10 text-slate-400" />
                <p className="text-xs leading-relaxed text-slate-300">{cameraError}</p>
              </div>
            ) : (
              <>
                <div
                  id={READER_ELEMENT_ID}
                  className="stamp-qr-reader h-full w-full min-h-[16rem]"
                />
                {isStarting && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-semibold text-white">
                    {txt("Starting camera…", "Kamera wird gestartet…", "Spouštím kameru…")}
                  </div>
                )}
              </>
            )}
          </div>

          <p className="mt-5 max-w-sm px-2 text-center text-xs font-light leading-relaxed text-slate-500">
            {txt(
              "Point your camera at the QR code on the information board. If you are already signed in, the stamp is saved automatically.",
              "Richten Sie die Kamera auf den QR-Code an der Tafel. Wenn Sie angemeldet sind, wird der Stempel automatisch gespeichert.",
              "Namiřte kameru na QR kód na tabuli. Pokud jste přihlášeni, razítko se uloží automaticky."
            )}
          </p>

          <p className="mt-3 max-w-sm rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-center text-[11px] text-amber-800">
            {txt(
              "Tip: You can also scan the printed QR with your iPhone Camera app — it opens this site in Safari and collects the stamp.",
              "Tipp: Sie können den QR-Code auch mit der iPhone-Kamera scannen — Safari öffnet sich und speichert den Stempel.",
              "Tip: QR kód můžete naskenovat i fotoaparátem iPhonu — otevře se Safari a razítko se uloží."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
