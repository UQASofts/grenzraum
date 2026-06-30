import { useCallback, useEffect, useRef, useState } from "react";
import { X, QrCode, Sparkles, CheckCircle, AlertCircle, Camera } from "lucide-react";
import { parseCollectPoiIdFromScan } from "../utils/stampQr";
import { AppLanguage, tr } from "../i18n/language";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  poiName: string;
  language: AppLanguage;
  isLoggedIn: boolean;
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
  onStampScanned,
  onRequireLogin,
}: QRScannerModalProps) {
  const txt = (en: string, de: string, cs: string) => tr(language, en, de, cs);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const scannedRef = useRef(false);

  const [phase, setPhase] = useState<ScannerPhase>("scanning");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [supportsCamera, setSupportsCamera] = useState(true);

  const stopCamera = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
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
      stopCamera();

      if (!isLoggedIn) {
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
    [isLoggedIn, language, onClose, onRequireLogin, onStampScanned, stopCamera]
  );

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      scannedRef.current = false;
      setPhase("scanning");
      setCameraError(null);
      setScanError(null);
      return;
    }

    scannedRef.current = false;
    setPhase("scanning");
    setCameraError(null);
    setScanError(null);

    let cancelled = false;

    const startScanner = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setSupportsCamera(false);
        setCameraError(
          txt(
            "Camera access is not available in this browser. Use your phone camera to scan the sign QR code — it will open this website automatically.",
            "Kamerazugriff ist in diesem Browser nicht verfügbar. Scannen Sie den QR-Code mit der Handy-Kamera.",
            "Přístup ke kameře není v tomto prohlížeči k dispozici. Naskenujte QR kód fotoaparátem telefonu — otevře se tato webová stránka."
          )
        );
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        await video.play();

        const BarcodeDetectorCtor = (
          window as Window & {
            BarcodeDetector?: new (options?: { formats: string[] }) => {
              detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue: string }>>;
            };
          }
        ).BarcodeDetector;

        if (!BarcodeDetectorCtor) {
          setSupportsCamera(false);
          setCameraError(
            txt(
              "Built-in scanning needs a newer mobile browser. Point your phone camera at the sign QR code instead — the link will open here and collect your stamp after sign-in.",
              "Integriertes Scannen benötigt einen neueren mobilen Browser. Nutzen Sie stattdessen die Handy-Kamera.",
              "Vestavěné skenování vyžaduje novější mobilní prohlížeč. Namiřte fotoaparát telefonu na QR kód na tabuli — odkaz se otevře zde a razítko se přidá po přihlášení."
            )
          );
          stopCamera();
          return;
        }

        const detector = new BarcodeDetectorCtor({ formats: ["qr_code"] });

        const tick = async () => {
          if (cancelled || scannedRef.current || !videoRef.current || video.readyState < 2) {
            if (!cancelled && !scannedRef.current) {
              rafRef.current = requestAnimationFrame(tick);
            }
            return;
          }

          try {
            const codes = await detector.detect(video);
            if (codes.length > 0 && codes[0].rawValue) {
              handleDecoded(codes[0].rawValue);
              return;
            }
          } catch {
            /* keep scanning */
          }

          if (!cancelled && !scannedRef.current) {
            rafRef.current = requestAnimationFrame(tick);
          }
        };

        rafRef.current = requestAnimationFrame(tick);
      } catch {
        setSupportsCamera(false);
        setCameraError(
          txt(
            "Could not access the camera. Allow camera permission, or scan the sign with your phone camera app instead.",
            "Kamera konnte nicht gestartet werden. Erlauben Sie den Kamerazugriff oder scannen Sie mit der Handy-Kamera.",
            "Kameru se nepodařilo spustit. Povolte přístup ke kameře, nebo naskenujte QR kód fotoaparátem telefonu."
          )
        );
      }
    };

    startScanner();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [isOpen, language, handleDecoded, stopCamera]);

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
                <video
                  ref={videoRef}
                  className="absolute inset-0 h-full w-full object-cover"
                  playsInline
                  muted
                />
                <div className="pointer-events-none absolute inset-0 bg-black/20" />
                <div className="absolute left-6 top-6 h-8 w-8 border-l-2 border-t-2 border-emerald-400" />
                <div className="absolute right-6 top-6 h-8 w-8 border-r-2 border-t-2 border-emerald-400" />
                <div className="absolute bottom-6 left-6 h-8 w-8 border-b-2 border-l-2 border-emerald-400" />
                <div className="absolute bottom-6 right-6 h-8 w-8 border-b-2 border-r-2 border-emerald-400" />
                <div className="absolute left-6 right-6 top-1/2 h-0.5 -translate-y-1/2 bg-emerald-400/50 animate-pulse" />
              </>
            )}
          </div>

          <p className="mt-5 max-w-sm px-2 text-center text-xs font-light leading-relaxed text-slate-500">
            {txt(
              "Point your camera at the QR code on the information board. After scanning, you will be asked to sign in if needed, then the stamp is saved to your pass.",
              "Richten Sie die Kamera auf den QR-Code an der Informationstafel. Nach dem Scan ggf. anmelden – dann wird der Stempel gespeichert.",
              "Namiřte kameru na QR kód na informační tabuli. Po naskenování se v případě potřeby přihlásíte a razítko se uloží do vašeho pasu."
            )}
          </p>

          {!supportsCamera && (
            <p className="mt-3 max-w-sm rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-center text-[11px] text-amber-800">
              {txt(
                "Tip: iPhone/Android camera apps open the stamp link directly from the printed QR code.",
                "Tipp: iPhone/Android-Kamera öffnet den Stempel-Link direkt vom gedruckten QR-Code.",
                "Tip: Fotoaparát v iPhonu nebo Androidu otevře odkaz na razítko přímo z vytištěného QR kódu."
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
