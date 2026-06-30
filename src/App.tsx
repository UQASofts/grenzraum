import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  INITIAL_ACHIEVEMENTS,
} from "./data";
import { POI, UserStamp, Achievement } from "./types";
import { useData } from "./context/DataContext";
import MapComponent from "./components/MapComponent";
import QRScannerModal from "./components/QRScannerModal";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import NavigateView from "./components/NavigateView";
import StampCelebration from "./components/StampCelebration";
import { useAppRouter } from "./hooks/useAppRouter";
import { isKnownRoute, ROUTES } from "./routes";
import { stampCollectPath, parseCollectPoiIdFromScan } from "./utils/stampQr";
import {
  defaultUserStamps,
  loadUserStamps,
  saveUserStamps,
  unlockStampForPoi,
  persistPendingCollect,
  consumePendingCollect,
} from "./utils/stampStorage";
import { playStampCelebrationSound } from "./utils/stampCelebrationSound";
import {
  MapPin,
  Compass,
  Search,
  Filter,
  User,
  LogOut,
  Sliders,
  Calendar,
  Lock,
  CheckCircle,
  Menu,
  X,
  Trash2,
  Sparkles,
  TrendingUp,
  Globe,
  Award,
  ChevronRight,
  Database,
  ChevronDown,
  Info,
  Clock,
  Map as MapIcon,
  BookOpen,
  Navigation,
  ArrowUpRight,
  Locate,
  Footprints,
  CloudRain,
  Sun,
  Heart,
  Bookmark
} from "lucide-react";
import { MainLogo } from "./components/icons";

export default function App() {
  const { pois } = useData();
  
  // Persistent State Init: initially the stamp pass of the user will be reset (locked by default)
  const [userStamps, setUserStamps] = useState<UserStamp[]>(() => {
    try {
      const saved = localStorage.getItem("hikerSession");
      if (saved) {
        const user = JSON.parse(saved) as { email: string };
        return loadUserStamps(user.email);
      }
    } catch {
      /* ignore */
    }
    return defaultUserStamps();
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem("achievements");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading achievements from localStorage", e);
      }
    }
    // Initially reset (all locked)
    return INITIAL_ACHIEVEMENTS.map((ach) => ({
      ...ach,
      unlocked: false,
      unlockedAt: undefined,
    }));
  });

  const [language, setLanguage] = useState<"en" | "cs">("en");
  const {
    view: currentView,
    poiId: selectedPoiId,
    pathname,
    search,
    goHome,
    goMap,
    goLocation,
    goStamps,
    navigate,
  } = useAppRouter();
  
  // Auth state
  const [loggedInUser, setLoggedInUser] = useState<{
    name: string;
    email: string;
    role: "user";
  } | null>(() => {
    try {
      const saved = localStorage.getItem("hikerSession");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [pendingReturnPath, setPendingReturnPath] = useState<string | null>(null);

  // Filters and search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Modals state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const processedCollectRef = useRef<string | null>(null);
  const [activeGalleryImage, setActiveGalleryImage] = useState<string | null>(null);
  const [savedPoiIds, setSavedPoiIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("savedPoiIds");
    return saved ? JSON.parse(saved) : [];
  });

  // Geolocation and GPS simulator states
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>(() => {
    const saved = localStorage.getItem("userLocation");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return { lat: 49.3955, lng: 13.2952 }; // Default Klatovy
  });
  const [gpsSource, setGpsSource] = useState<"default" | "real" | "simulated">("default");
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsMsg, setGpsMsg] = useState("");

  // Walking simulation states for navigator
  const [walkProgress, setWalkProgress] = useState<number>(0);
  const [isWalking, setIsWalking] = useState<boolean>(false);
  const [walkLogs, setWalkLogs] = useState<string[]>([]);

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showStampCelebration, setShowStampCelebration] = useState(false);
  const [celebrationKey, setCelebrationKey] = useState(0);
  const [celebrationMeta, setCelebrationMeta] = useState<{
    message: string;
    subMessage: string;
  } | null>(null);
  const celebrationTimerRef = useRef<number | null>(null);

  // Active Selected POI details resolver
  const activePoi = useMemo(() => {
    return pois.find((p) => p.id === selectedPoiId) || null;
  }, [pois, selectedPoiId]);

  // Sync active gallery image when active POI changes
  useEffect(() => {
    if (activePoi) {
      setActiveGalleryImage(activePoi.image);
    } else {
      setActiveGalleryImage(null);
    }
  }, [selectedPoiId, activePoi]);

  useEffect(() => {
    return () => {
      if (celebrationTimerRef.current !== null) {
        window.clearTimeout(celebrationTimerRef.current);
      }
    };
  }, []);

  // Persist saved POIs in local storage
  useEffect(() => {
    localStorage.setItem("savedPoiIds", JSON.stringify(savedPoiIds));
  }, [savedPoiIds]);

  // Walking simulation timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isWalking && walkProgress < 100) {
      timer = setInterval(() => {
        setWalkProgress((prev) => {
          const next = Math.min(prev + 10, 100);
          
          if (activePoi) {
            const currentDist = getDistanceKm(userLocation.lat, userLocation.lng, activePoi.lat, activePoi.lng);
            const remDist = parseFloat((currentDist * (1 - next / 100)).toFixed(2));
            
            let logMsg = "";
            if (next === 10) {
              logMsg = language === "en"
                ? "🥾 Leaving trailhead. Double-checking hiking gear and map coordinates."
                : "🥾 Opouštíme výchozí bod. Kontrola výbavy a souřadnic v mapě.";
            } else if (next === 30) {
              logMsg = language === "en"
                ? `🌲 Steady ascent. Mossy old-growth pines rising on both sides. (${remDist} km remaining)`
                : `🌲 Stabilní stoupání. Mechem porostlé prastaré borovice po obou stranách. (zbývá ${remDist} km)`;
            } else if (next === 50) {
              logMsg = language === "en"
                ? `💧 Passed a fresh mountain stream. Pristine water is crisp and cold. (${remDist} km remaining)`
                : `💧 Míjíme průzračný horský potok. Voda je ledově čistá a osvvěžující. (zbývá ${remDist} km)`;
            } else if (next === 70) {
              logMsg = language === "en"
                ? `⛰️ Elevation rises! Splendid panoramic views of the Šumava mountains opening up. (${remDist} km remaining)`
                : `⛰️ Nadmořská výška stoupá! Otevírají se nádherné panoramatické výhledy na Šumavu. (zbývá ${remDist} km)`;
            } else if (next === 90) {
              logMsg = language === "en"
                ? `🔭 Destination structure is in sight! Final trail section lies ahead. (${remDist} km remaining)`
                : `🔭 Cíl je na dohled! Před námi je závěrečný úsek cesty. (zbývá ${remDist} km)`;
            } else if (next === 100) {
              logMsg = language === "en"
                ? "🎉 You have arrived at the coordinates! The area is fully synchronized. Click 'Collect Digital Stamp' to lock it in your pass!"
                : "🎉 Dorazili jste na souřadnice cíle! Poloha je plně ověřena. Klikněte na 'Získat digitální razítko' pro odemčení!";
            }
            
            if (logMsg) {
              setWalkLogs((prevLogs) => [logMsg, ...prevLogs]);
            }
          }
          
          if (next === 100) {
            setIsWalking(false);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isWalking, walkProgress, activePoi, language, userLocation]);

  // Categories helper
  const categories = ["All", "Hiking", "Lakes", "Waterfalls", "Museums", "Secret Tips"];

  // Dynamic Statistics
  const unlockedStampsCount = useMemo(() => {
    return userStamps.filter((s) => s.unlocked).length;
  }, [userStamps]);

  const totalStampsCount = userStamps.length;

  const secretTipPoisIds = useMemo(() => {
    return pois.filter((p) => p.secretTip).map((p) => p.id);
  }, [pois]);

  const unlockedSecretTipsCount = useMemo(() => {
    return userStamps.filter((s) => s.unlocked && secretTipPoisIds.includes(s.poiId)).length;
  }, [userStamps, secretTipPoisIds]);

  const totalSecretTipsCount = secretTipPoisIds.length;

  const adventurerLevel = useMemo(() => {
    // 1 stamp = 1 level, starting from Level 1
    return Math.max(1, unlockedStampsCount + 1);
  }, [unlockedStampsCount]);

  // Sync logged-in user's stamps to localStorage and trigger achievements check
  useEffect(() => {
    if (!loggedInUser) return;
    saveUserStamps(loggedInUser.email, userStamps);

    // Calculate achievements dynamically based on current userStamps
    const unlockedCount = userStamps.filter((s) => s.unlocked).length;
    
    setAchievements((prevAchs) => {
      let changed = false;
      const updated = prevAchs.map((ach) => {
        if (unlockedCount === 0) {
          // If reset to 0 stamps, all achievements should lock
          if (ach.unlocked) {
            changed = true;
            return { ...ach, unlocked: false, unlockedAt: undefined };
          }
          return ach;
        }

        if (ach.unlocked) return ach;

        let shouldUnlock = false;
        const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);

        if (ach.id === "ach-1") {
          // Scan 3 forest or lake digital stamps
          const targetPoiIds = ["black-lake", "devils-lake", "spicak-lookout", "white-gorge-waterfall", "pancir-summit"];
          const collectedTargetCount = userStamps.filter((s) => s.unlocked && targetPoiIds.includes(s.poiId)).length;
          if (collectedTargetCount >= 3) {
            shouldUnlock = true;
          }
        } else if (ach.id === "ach-2") {
          // Scan stamp before 08:00 AM (simulated based on current hours or any collected)
          const currentHour = new Date().getHours();
          if (currentHour < 8 && unlockedCount > 0) {
            shouldUnlock = true;
          }
        } else if (ach.id === "ach-3") {
          // Elevation gain above 300m
          const highElevationPoiIds = ["pancir-summit"];
          const hasHighElevation = userStamps.some((s) => s.unlocked && highElevationPoiIds.includes(s.poiId));
          if (hasHighElevation) {
            shouldUnlock = true;
          }
        } else if (ach.id === "ach-4") {
          // Cross-Border Explorer (scanned Czech and German zones)
          const hasCzech = userStamps.some((s) => s.unlocked && s.poiId !== "glass-ark");
          const hasGerman = userStamps.some((s) => s.unlocked && s.poiId === "glass-ark");
          if (hasCzech && hasGerman) {
            shouldUnlock = true;
          }
        }

        if (shouldUnlock) {
          changed = true;
          return {
            ...ach,
            unlocked: true,
            unlockedAt: nowStr,
          };
        }
        return ach;
      });

      return changed ? updated : prevAchs;
    });
  }, [userStamps, loggedInUser]);

  // Sync achievements to localStorage
  useEffect(() => {
    localStorage.setItem("achievements", JSON.stringify(achievements));
  }, [achievements]);

  // Sync userLocation to localStorage
  useEffect(() => {
    localStorage.setItem("userLocation", JSON.stringify(userLocation));
  }, [userLocation]);

  // Distance calculation helpers (Haversine formula)
  const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
  };

  const getBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const lat1Rad = (lat1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;
    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x =
      Math.cos(lat1Rad) * Math.sin(lat2Rad) -
      Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
    const brng = (Math.atan2(y, x) * 180) / Math.PI;
    return Math.round((brng + 360) % 360);
  };

  const getCompassDirection = (bearing: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(bearing / 45) % 8;
    return directions[index];
  };

  // Trigger browser real GPS lookup
  const handleTriggerRealGps = () => {
    if (!navigator.geolocation) {
      alert(
        language === "en"
          ? "Geolocation is not supported by your browser."
          : "Váš prohlížeč nepodporuje určování polohy."
      );
      return;
    }
    setGpsLoading(true);
    setGpsMsg(language === "en" ? "Requesting device GPS coordinates..." : "Vyžadování GPS souřadnic ze zařízení...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGpsSource("real");
        setGpsLoading(false);
        setGpsMsg(
          language === "en"
            ? `Successfully synchronized live GPS: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
            : `Poloha úspěšně načtena: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
        );
      },
      (error) => {
        setGpsLoading(false);
        let errorMsg = error.message;
        if (error.code === 1) {
          errorMsg = "Permission denied. Please ensure browser/iframe location permission is enabled.";
        }
        alert(
          language === "en"
            ? `Could not retrieve GPS coordinates: ${errorMsg}`
            : `Nepodařilo se získat GPS souřadnice: ${errorMsg}`
        );
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Redirect legacy /admin to dashboard
  useEffect(() => {
    if (pathname === "/admin") {
      navigate("/dashboard", { replace: true });
    }
  }, [pathname, navigate]);

  const openLoginModal = useCallback((options?: { returnPath?: string | null }) => {
    setIsRegisterModalOpen(false);
    setPendingReturnPath(options?.returnPath ?? null);
    setIsLoginModalOpen(true);
  }, []);

  const triggerStampCelebration = useCallback(
    (targetPoi: POI) => {
      if (celebrationTimerRef.current !== null) {
        window.clearTimeout(celebrationTimerRef.current);
      }

      setCelebrationMeta({
        message: language === "en" ? "Stamp Collected!" : "Razítko získáno!",
        subMessage:
          language === "en"
            ? `You unlocked "${targetPoi.stampName}" at ${targetPoi.name}.`
            : `Odemkli jste "${targetPoi.stampName}" u lokality ${targetPoi.czName}.`,
      });
      setCelebrationKey((key) => key + 1);
      setShowStampCelebration(true);
      playStampCelebrationSound(language);

      celebrationTimerRef.current = window.setTimeout(() => {
        setShowStampCelebration(false);
        celebrationTimerRef.current = null;
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      }, 3800);
    },
    [language]
  );

  const applyStampCollection = useCallback(
    (
      collectPoiId: string,
      userEmail?: string,
      baseStamps?: UserStamp[]
    ): { wasNew: boolean; targetPoi: POI | undefined } => {
      const targetPoi = pois.find((p) => p.id === collectPoiId);
      if (!targetPoi) {
        return { wasNew: false, targetPoi: undefined };
      }

      let wasNew = false;
      setUserStamps((prev) => {
        const source = baseStamps ?? prev;
        const result = unlockStampForPoi(source, collectPoiId);
        wasNew = result.wasNew;
        if (userEmail && result.wasNew) {
          saveUserStamps(userEmail, result.stamps);
        }
        return result.stamps;
      });

      return { wasNew, targetPoi };
    },
    [pois]
  );

  const collectStamp = useCallback(
    (collectPoiId: string, options?: { navigateToPass?: boolean }) => {
      if (!loggedInUser) return false;

      const { wasNew, targetPoi } = applyStampCollection(
        collectPoiId,
        loggedInUser.email
      );
      if (!targetPoi) return false;

      if (options?.navigateToPass !== false) {
        navigate(ROUTES.stamps, { replace: true });
      }

      if (wasNew) {
        triggerStampCelebration(targetPoi);
      }

      return wasNew;
    },
    [applyStampCollection, loggedInUser, navigate, triggerStampCelebration]
  );

  const handleRequireLoginForStamp = useCallback(
    (poiId: string) => {
      openLoginModal({ returnPath: stampCollectPath(poiId) });
    },
    [openLoginModal]
  );

  const handleStampScanned = useCallback(
    (poiId: string) => {
      if (!loggedInUser) {
        handleRequireLoginForStamp(poiId);
        setIsScannerOpen(false);
        return;
      }
      collectStamp(poiId);
      setIsScannerOpen(false);
    },
    [loggedInUser, collectStamp, handleRequireLoginForStamp]
  );

  const openRegisterModal = useCallback(() => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  }, []);

  const switchToLoginFromRegister = useCallback(() => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  }, []);

  const handleGoStamps = useCallback(() => {
    if (!loggedInUser) {
      openLoginModal({ returnPath: ROUTES.stamps });
      return;
    }
    goStamps();
  }, [loggedInUser, goStamps, openLoginModal]);

  // Stamp Pass requires sign-in — show login popup instead of navigating away
  useEffect(() => {
    if (currentView === "stamps" && !loggedInUser) {
      const params = new URLSearchParams(window.location.search);
      const returnPath = params.toString()
        ? `${ROUTES.stamps}?${params.toString()}`
        : ROUTES.stamps;
      openLoginModal({ returnPath });
      navigate(ROUTES.home, { replace: true });
    }
  }, [currentView, loggedInUser, navigate, openLoginModal]);

  // Legacy /login URL opens the modal on the current site
  useEffect(() => {
    if (currentView === "login") {
      const returnTo = new URLSearchParams(window.location.search).get("returnTo");
      openLoginModal({
        returnPath: returnTo?.startsWith("/") ? returnTo : null,
      });
      navigate(ROUTES.home, { replace: true });
    }
  }, [currentView, navigate, openLoginModal]);

  // Legacy /register URL opens the register modal on the current site
  useEffect(() => {
    if (currentView === "register") {
      openRegisterModal();
      navigate(ROUTES.home, { replace: true });
    }
  }, [currentView, navigate, openRegisterModal]);

  // Redirect unknown URLs to home and scroll to top on route change
  useEffect(() => {
    if (!isKnownRoute(pathname)) {
      navigate(ROUTES.home, { replace: true });
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, navigate]);

  // Handle URL from scanned QR codes (?collect=poi-id)
  useEffect(() => {
    const urlParams = new URLSearchParams(search);
    const collectPoiId = urlParams.get("collect");

    if (!collectPoiId) {
      processedCollectRef.current = null;
      return;
    }

    if (!loggedInUser) {
      persistPendingCollect(collectPoiId);
      openLoginModal({ returnPath: stampCollectPath(collectPoiId) });
      return;
    }

    if (!pois.some((p) => p.id === collectPoiId)) return;

    const dedupeKey = `${collectPoiId}:${loggedInUser.email}`;
    if (processedCollectRef.current === dedupeKey) return;

    processedCollectRef.current = dedupeKey;
    consumePendingCollect();

    const { wasNew, targetPoi } = applyStampCollection(
      collectPoiId,
      loggedInUser.email
    );

    navigate(ROUTES.stamps, { replace: true });

    if (wasNew && targetPoi) {
      triggerStampCelebration(targetPoi);
    }
  }, [
    search,
    loggedInUser,
    pois,
    openLoginModal,
    applyStampCollection,
    navigate,
    triggerStampCelebration,
  ]);

  // Handle reset of stamp pass
  const handleResetStampPass = () => {
    if (
      confirm(
        language === "en"
          ? "Are you sure you want to reset your stamp pass and achievements? This will lock all stamps so you can start collecting them again."
          : "Opravdu chcete resetovat svůj průkaz razítek a úspěchy? Tím se uzamknou všechna razítka, abyste je mohli začít sbírat znovu."
      )
    ) {
      // Lock all stamps
      const resetStamps = userStamps.map((stamp) => ({
        ...stamp,
        unlocked: false,
        collectedAt: "",
      }));
      setUserStamps(resetStamps);

      // Lock all achievements
      const resetAchs = achievements.map((ach) => ({
        ...ach,
        unlocked: false,
        unlockedAt: undefined,
      }));
      setAchievements(resetAchs);
    }
  };

  // Filtered destinations
  const filteredPois = useMemo(() => {
    return pois.filter((poi) => {
      const matchQuery =
        poi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poi.czName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poi.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poi.czDescription.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCategory =
        selectedCategory === "All" || poi.category === selectedCategory;

      return matchQuery && matchCategory;
    });
  }, [pois, searchQuery, selectedCategory]);

  // Handle manual mock stamp collection from stamp pass
  const handleCollectNearestStamp = () => {
    // Find locked stamps
    const lockedStamps = userStamps.filter((s) => !s.unlocked);
    
    if (lockedStamps.length === 0) {
      alert(
        language === "en"
          ? "You have already collected all available digital stamps! Incredible job!"
          : "Již jste získali všechna dostupná digitální razítka! Skvělá práce!"
      );
      return;
    }

    // Map each locked stamp to its POI and calculate geographic distance
    const POIsWithDistance = lockedStamps
      .map((stamp) => {
        const poi = pois.find((p) => p.id === stamp.poiId);
        if (!poi) return null;
        const dist = getDistanceKm(userLocation.lat, userLocation.lng, poi.lat, poi.lng);
        return { poi, dist };
      })
      .filter((item): item is { poi: POI; dist: number } => item !== null);

    if (POIsWithDistance.length === 0) return;

    // Sort by distance ascending to find the closest
    POIsWithDistance.sort((a, b) => a.dist - b.dist);
    const closest = POIsWithDistance[0];

    // Select the POI, switch to details view, and notify the user about proximity!
    goLocation(closest.poi.id);
    
    // Reset walking simulator state for the new destination
    setWalkProgress(0);
    setIsWalking(false);
    setWalkLogs([
      language === "en" 
        ? `📍 Set course for ${closest.poi.name}. Distance to go: ${closest.dist} km.`
        : `📍 Nastaven směr na ${closest.poi.czName}. Zbývající vzdálenost: ${closest.dist} km.`
    ]);

    alert(
      language === "en"
        ? `📍 Found closest locked destination: "${closest.poi.name}" (${closest.dist} km away). Opening trail navigator!`
        : `📍 Nalezen nejbližší uzamčený cíl: "${closest.poi.czName}" (vzdálenost ${closest.dist} km). Otevírám navigátor!`
    );
  };

  const handleLoginSuccess = (user: { name: string; email: string; role: "user" }) => {
    const stamps = loadUserStamps(user.email);
    const returnPath = pendingReturnPath;
    const collectFromReturn = returnPath ? parseCollectPoiIdFromScan(returnPath) : null;
    const collectPoiId = collectFromReturn ?? consumePendingCollect();

    setLoggedInUser(user);
    setIsLoginModalOpen(false);
    setPendingReturnPath(null);

    if (collectPoiId && pois.some((p) => p.id === collectPoiId)) {
      processedCollectRef.current = `${collectPoiId}:${user.email}`;
      const { wasNew, targetPoi } = applyStampCollection(collectPoiId, user.email, stamps);

      navigate(ROUTES.stamps, { replace: true });

      if (wasNew && targetPoi) {
        triggerStampCelebration(targetPoi);
      }
      return;
    }

    setUserStamps(stamps);

    if (returnPath?.startsWith("/")) {
      navigate(returnPath);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("hikerSession");
    setLoggedInUser(null);
    goHome();
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
          {/* Logo & Region Brand */}
          <div
            onClick={goHome}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className=" group-hover:bg-emerald-500 text-white p-2 rounded-xl transition-all">
              <MainLogo className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="font-display font-extrabold text-sm sm:text-base tracking-tight text-slate-900 uppercase block truncate">
              grenzraum
              </span>
              <span className="text-[9px] font-mono font-semibold tracking-wider text-emerald-600 uppercase">
                Cross-Border Guide
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={goHome}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                currentView === "home"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {language === "en" ? "Home" : "Domů"}
            </button>
            <button
              onClick={() => goMap()}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                currentView === "map"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {language === "en" ? "Explorer Map" : "Mapa výletů"}
            </button>
            <button
              onClick={handleGoStamps}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                currentView === "stamps"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {language === "en" ? "Stamp Pass" : "Pas razítek"}
            </button>

          </nav>

          {/* Action buttons (Language, Auth Profile) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Bilingual toggle */}
            <button
              onClick={() => setLanguage((prev) => (prev === "en" ? "cs" : "en"))}
              className="bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold font-mono px-3 py-1.5 rounded-xl cursor-pointer text-slate-600 hover:text-slate-900 transition-colors"
            >
              {language === "en" ? "CZ" : "EN"}
            </button>

            {loggedInUser ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-slate-900">{loggedInUser.name}</span>
                  <span className="text-[9px] font-mono text-emerald-600 uppercase tracking-widest font-semibold">
                    {loggedInUser.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openLoginModal()}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl shadow transition-all cursor-pointer"
              >
                {language === "en" ? "Sign In" : "Přihlásit se"}
              </button>
            )}
          </div>

          {/* Mobile Menu trigger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setLanguage((prev) => (prev === "en" ? "cs" : "en"))}
              className="bg-white border border-slate-200 text-xs font-mono px-2 py-1.5 rounded-lg text-slate-600"
            >
              {language === "en" ? "CZ" : "EN"}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-3 z-40 relative animate-fade-in">
          <button
            onClick={() => {
              goHome();
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 hover:bg-slate-100 rounded-lg text-sm font-semibold"
          >
            {language === "en" ? "Home" : "Domů"}
          </button>
          <button
            onClick={() => {
              goMap();
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 hover:bg-slate-100 rounded-lg text-sm font-semibold"
          >
            {language === "en" ? "Explorer Map" : "Mapa výletů"}
          </button>
          <button
            onClick={() => {
              handleGoStamps();
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 hover:bg-slate-100 rounded-lg text-sm font-semibold"
          >
            {language === "en" ? "Stamp Pass" : "Pas razítek"}
          </button>
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            {loggedInUser ? (
              <div className="flex items-center gap-3 justify-between w-full">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900">{loggedInUser.name}</span>
                  <span className="text-[10px] text-slate-400">{loggedInUser.email}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-slate-50 text-rose-400 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold"
                >
                  {language === "en" ? "Log Out" : "Odhlásit"}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  openLoginModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl text-sm font-bold text-center"
              >
                {language === "en" ? "Sign In" : "Přihlásit se"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* CORE APPLICATION CONTAINER */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        {/* 1. HOME SCREEN */}
        {currentView === "home" && (
          <div className="space-y-12 animate-fade-in">
            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[min(420px,55vh)] sm:h-[420px] flex flex-col justify-end p-6 md:p-12">
              {/* Background cover image with custom cross-border landscape */}
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdoDLdlFg5QJ46VbsW_JopJe9OzH5J47bNMfWMhAaO5Gfc5CJb5nCqkXFWFP40M6IN-LHz2_ZVbFRPUwQcK5hmUrztPyY7-qup3gAKKtpwGVqqSDB2SVurxWJkpgfCYeF6VTimwi0qVQSa4vBQY_D5-ww2t-lqy_GbZyALCfdbENogioMMf9ZjWHt6zGJQtmNnDIxg8TS_S9dgvhpD2HgJvlvcBb3hcXDzsRToYOsJI1R285TxOMi5qT8PAeSm2G_s2OhjSpZhI-Eg"
                alt="Bohemian Forest / Šumava Landscape"
                className="absolute inset-0 w-full h-full object-cover brightness-40"
              />
              <div className="relative z-10 space-y-4 max-w-2xl">
                <span className="bg-emerald-600/30 border border-emerald-400/50 text-emerald-100 text-[10px] font-mono tracking-widest uppercase font-bold px-3 py-1 rounded-full inline-block">
                  {language === "en" ? "Bavarian Forest & Šumava Adventure" : "Dobrodružství na Šumavě a v Bavorském Lese"}
                </span>
                <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
                  {language === "en"
                    ? "Discover Magical Cross-Border Trails"
                    : "Objevujte kouzelné přeshraniční stezky"}
                </h1>
                <p className="text-sm md:text-base text-slate-200 leading-relaxed font-light">
                  {language === "en"
                    ? "Embark on hikes through glacial lakes, primeval forests, and ancient tower lookouts. Check in locally to unlock beautiful digital stamps!"
                    : "Vydejte se k ledovcovým jezerům, pralesům a historickým rozhlednám. Osobním check-inem získáte jedinečná digitální razítka!"}
                </p>

                {/* Search / Filter Box */}
                <div className="bg-slate-50/80 backdrop-blur border border-slate-200 p-2 rounded-2xl flex flex-col sm:flex-row gap-2 max-w-xl">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={
                        language === "en" ? "Search Black Lake, White Tower..." : "Hledat Černé jezero, Bílou věž..."
                      }
                      className="w-full bg-transparent outline-none pl-11 pr-4 py-2.5 text-sm text-slate-700"
                    />
                  </div>
                  <button
                    onClick={() => goMap()}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Compass className="w-4 h-4" />
                    <span>{language === "en" ? "Search Map" : "Hledat na mapě"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Popular Categories */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <h2 className="text-xl font-display font-bold tracking-tight text-slate-900 uppercase">
                  {language === "en" ? "Popular Categories" : "Oblíbené Kategorie"}
                </h2>
                {selectedCategory !== "All" && (
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/15"
                        : "bg-white border-slate-200 hover:border-emerald-300 text-slate-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Destinations (Pois list) */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-display font-bold tracking-tight text-slate-900 uppercase">
                  {language === "en" ? "Featured Destinations" : "Doporučené Cíle"}
                </h2>
                <span className="text-xs text-slate-400">
                  {language === "en"
                    ? `Showing ${filteredPois.length} locations`
                    : `Zobrazeno ${filteredPois.length} lokalit`}
                </span>
              </div>

              {filteredPois.length === 0 ? (
                <div className="bg-white border border-slate-200 p-12 text-center rounded-2xl shadow-sm">
                  <p className="text-slate-400 text-sm">
                    {language === "en"
                      ? "No matching locations found. Try clearing your search filters."
                      : "Nebyly nalezeny žádné cíle. Zkuste změnit vyhledávací kritéria."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPois.map((poi) => (
                    <div
                      key={poi.id}
                      onClick={() => goLocation(poi.id)}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden group hover:border-emerald-300 transition-all cursor-pointer flex flex-col shadow-sm"
                    >
                      <div className="relative h-48 overflow-hidden bg-slate-50">
                        <img
                          src={poi.image}
                          alt={poi.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Tags on card overlay */}
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <span className="bg-slate-50/85 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded text-emerald-600">
                            {poi.category}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded bg-slate-50/85 border ${
                              poi.difficulty === "Easy"
                                ? "border-emerald-500/30 text-emerald-600"
                                : poi.difficulty === "Moderate"
                                ? "border-amber-500/30 text-amber-400"
                                : "border-rose-500/30 text-rose-400"
                            }`}
                          >
                            {poi.difficulty}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {language === "en" ? poi.name : poi.czName}
                          </h3>
                          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                            {language === "en" ? poi.description : poi.czDescription}
                          </p>
                        </div>

                        {/* Specs strip */}
                        <div className="grid grid-cols-3 gap-2 pt-4 mt-4 border-t border-slate-200/80 text-[11px] font-mono text-slate-400">
                          <div>
                            <span className="block text-[9px] text-slate-500 uppercase tracking-wider">
                              Elev. Gain
                            </span>
                            <span className="text-slate-600 font-semibold">{poi.elevationGain}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] text-slate-500 uppercase tracking-wider">
                              Est. Hike
                            </span>
                            <span className="text-slate-600 font-semibold">{poi.estTime}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] text-slate-500 uppercase tracking-wider">
                              Distance
                            </span>
                            <span className="text-slate-600 font-semibold">{poi.distance}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CTA Pocket Banner */}
            <div className="bg-gradient-to-r from-emerald-50 to-white border border-emerald-200 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-sm">
              <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="space-y-4 max-w-xl">
                <h3 className="text-xl md:text-2xl font-display font-extrabold tracking-tight text-emerald-600">
                  {language === "en" ? "ADVENTURE IN YOUR POCKET" : "DOBRODRUŽSTVÍ VE VAŠÍ KAPSE"}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {language === "en"
                    ? "Get coordinates, sync with BayernCloud servers, and fill your digital stamp book offline while exploring. Perfect for multi-day hiking expeditions!"
                    : "Získejte souřadnice, synchronizujte se servery BayernCloud a sbírejte digitální razítka offline. Ideální pro vícedenní výpravy!"}
                </p>
                <div className="flex gap-4 pt-2">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-slate-900">100%</span>
                    <span className="text-[10px] text-slate-400">Offline Enabled</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200 self-center" />
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-slate-900">8+</span>
                    <span className="text-[10px] text-slate-400">Unique Stamps</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleGoStamps}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer whitespace-nowrap self-start md:self-center"
              >
                {language === "en" ? "My Stamp Collection" : "Moje sbírka razítek"}
              </button>
            </div>
          </div>
        )}

        {/* 2. MAP SCREEN */}
        {currentView === "map" && (
          <div className="space-y-6 animate-fade-in">
            {/* Header Title */}
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 tracking-tight uppercase">
                {language === "en" ? "Cross-Border Explorer Map" : "Přeshraniční interaktivní mapa"}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {language === "en"
                  ? "Explore geolocated hiking trails and click pins on the map to access cross-border guidebooks."
                  : "Objevujte přeshraniční stezky a klikněte na špendlíky na mapě pro přístup k průvodci."}
              </p>
            </div>

            {/* Split panel Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Sidebar POIs (4 Cols) */}
              <div className="order-2 lg:order-1 lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 max-h-[min(400px,50vh)] lg:max-h-[600px] overflow-y-auto">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === "en" ? "Search locations..." : "Hledat lokalitu..."}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 text-xs rounded-xl pl-9 pr-4 py-2.5 outline-none text-slate-700"
                  />
                </div>

                {/* Categories Scroll strip */}
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all border cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-emerald-600 border-emerald-500 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-400"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Locations list */}
                <div className="space-y-2 pt-2 border-t border-slate-200/60">
                  {filteredPois.map((poi) => {
                    const isSelected = selectedPoiId === poi.id;
                    return (
                      <div
                        key={poi.id}
                        onClick={() => goMap(poi.id)}
                        className={`p-3 rounded-xl border cursor-pointer flex gap-3 transition-all ${
                          isSelected
                            ? "bg-emerald-50/60 border-emerald-500"
                            : "bg-slate-50/50 border-slate-200 hover:border-slate-200"
                        }`}
                      >
                        <img
                          src={poi.image}
                          alt={poi.name}
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {language === "en" ? poi.name : poi.czName}
                          </h4>
                          <span className="text-[9px] text-slate-400 block mt-0.5">
                            {poi.category} • {poi.difficulty}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-mono mt-1 block">
                            {poi.distance} ({poi.estTime})
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Map Canvas (8 Cols) */}
              <div className="order-1 lg:order-2 lg:col-span-8">
                <MapComponent
                  pois={filteredPois}
                  selectedPoi={activePoi}
                  onSelectPoi={(poi) => goMap(poi.id)}
                  onExplorePoi={(poi) => goLocation(poi.id)}
                  onClosePoi={() => goMap()}
                  language={language}
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. DETAILS SCREEN */}
        {currentView === "details" && !activePoi && (
          <div className="bg-white border border-slate-200 p-8 sm:p-12 text-center rounded-2xl shadow-sm space-y-4">
            <p className="text-slate-400 text-sm">
              {language === "en"
                ? "This location could not be found."
                : "Tato lokalita nebyla nalezena."}
            </p>
            <button
              onClick={goHome}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl"
            >
              {language === "en" ? "Back to Home" : "Zpět na úvod"}
            </button>
          </div>
        )}

        {currentView === "details" && activePoi && (() => {
          // Dynamic image gallery selector
          const galleryImages = [
            activePoi.image,
            activePoi.category === "Lakes"
              ? "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80"
              : activePoi.category === "Waterfalls"
              ? "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80"
              : activePoi.category === "Hiking"
              ? "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
              : activePoi.category === "Museums"
              ? "https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=1200&q=80"
              : "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
            activePoi.category === "Lakes"
              ? "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
              : activePoi.category === "Waterfalls"
              ? "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80"
              : activePoi.category === "Hiking"
              ? "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1200&q=80"
              : activePoi.category === "Museums"
              ? "https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?auto=format&fit=crop&w=1200&q=80"
              : "https://images.unsplash.com/photo-1472214222541-d510753a4907?auto=format&fit=crop&w=1200&q=80"
          ];

          const categoryLabel = {
            Lakes: "Natural Wonder",
            Waterfalls: "Scenic Cascade",
            Hiking: "Alpine Trail",
            Museums: "Cultural Heritage",
            "Secret Tips": "Hidden Gem",
          }[activePoi.category] || "Destination";

          const categoryCzLabel = {
            Lakes: "Přírodní Div",
            Waterfalls: "Scénická kaskáda",
            Hiking: "Alpská stezka",
            Museums: "Kulturní dědictví",
            "Secret Tips": "Skrytý klenot",
          }[activePoi.category] || "Cíl cesty";

          const isSaved = savedPoiIds.includes(activePoi.id);

          const handleToggleSave = () => {
            if (isSaved) {
              setSavedPoiIds((prev) => prev.filter((id) => id !== activePoi.id));
            } else {
              setSavedPoiIds((prev) => [...prev, activePoi.id]);
            }
          };

          return (
            <div className="space-y-10 animate-fade-in">
              {/* Hero — full-bleed like home page */}
              <div className="relative h-[min(320px,45vh)] sm:h-[380px] md:h-[460px] overflow-hidden rounded-3xl shadow-lg">
                <img
                  src={activeGalleryImage || activePoi.image}
                  alt={activePoi.name}
                  className="absolute inset-0 h-full w-full object-cover brightness-75 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-black/20 to-transparent" />

                {/* Weather */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-2.5 backdrop-blur-md">
                  {activePoi.category === "Lakes" || activePoi.category === "Waterfalls" ? (
                    <CloudRain className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Sun className="h-5 w-5 text-amber-400" />
                  )}
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {language === "en" ? "Weather" : "Počasí"}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {activePoi.category === "Lakes" || activePoi.category === "Waterfalls"
                        ? "14°C, Rainy"
                        : "18°C, Clear"}
                    </span>
                  </div>
                </div>

                {/* Gallery thumbnails */}
                <div className="absolute bottom-6 left-6 flex gap-2 rounded-2xl border border-slate-200/60 bg-slate-50/70 p-2 backdrop-blur-md">
                  {galleryImages.map((imgUrl, i) => {
                    const isActive = (activeGalleryImage || activePoi.image) === imgUrl;
                    return (
                      <button
                        key={i}
                        onClick={() => setActiveGalleryImage(imgUrl)}
                        className={`h-14 w-14 overflow-hidden rounded-xl border-2 transition-all sm:h-16 sm:w-16 ${
                          isActive
                            ? "border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                            : "border-slate-700 hover:border-slate-500"
                        }`}
                      >
                        <img src={imgUrl} className="h-full w-full object-cover" alt="" referrerPolicy="no-referrer" />
                      </button>
                    );
                  })}
                </div>

                {/* Title overlay on hero */}
                <div className="absolute bottom-6 right-6 left-44 sm:left-52 md:left-auto md:max-w-lg md:text-right">
                  <div className="mb-2 flex flex-wrap gap-2 md:justify-end">
                    <span className="rounded-full border border-indigo-800/40 bg-indigo-950/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                      {language === "en" ? categoryLabel : categoryCzLabel}
                    </span>
                    <span className="rounded-full border border-emerald-800/40 bg-emerald-50/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      {activePoi.category === "Museums" || activePoi.id.includes("klatovy")
                        ? "#Bohemian"
                        : "#Šumava"}
                    </span>
                  </div>
                  <h1 className="text-2xl font-display font-extrabold tracking-tight text-white md:text-4xl">
                    {activePoi.name} / {activePoi.czName}
                  </h1>
                </div>
              </div>

              {/* Main content */}
              <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                <div className="space-y-8 lg:col-span-8">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-emerald-500" />
                      {activePoi.category === "Museums" || activePoi.id.includes("klatovy")
                        ? "Klatovy Region, Czech Republic"
                        : "Šumava National Park, Czech Republic"}
                    </span>
                    <span className="font-mono text-xs text-indigo-400">
                      {activePoi.lat.toFixed(4)}° N, {activePoi.lng.toFixed(4)}° E
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      {language === "en" ? "About the Destination" : "O této destinaci"}
                    </h2>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {language === "en" ? activePoi.description : activePoi.czDescription}
                    </p>
                  </div>

                    {/* Quick info cards */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-emerald-50/50 p-2 rounded-xl">
                            <Clock className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                            {language === "en" ? "Opening Hours" : "Otevírací doba"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-normal">
                          {language === "en"
                            ? "Accessible year-round. Best visited at sunrise."
                            : "Přístupné celoročně. Nejlepší návštěva při východu slunce."}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-emerald-50/50 p-2 rounded-xl">
                            <Footprints className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                            {language === "en" ? "Difficulty" : "Náročnost cesty"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-normal">
                          {activePoi.difficulty === "Easy" ? (
                            language === "en" ? "Easy Trail. Paved & forest paths." : "Lehká trasa. Zpevněné a lesní cesty."
                          ) : activePoi.difficulty === "Moderate" ? (
                            language === "en" ? "Moderate Trail. Some steep slopes." : "Střední trasa. Místy strmější stoupání."
                          ) : (
                            language === "en" ? "Challenging Climb. Rugged wilderness." : "Náročný výstup. Drsný terén divočiny."
                          )}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-emerald-50/50 p-2 rounded-xl">
                            <MapPin className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                            {language === "en" ? "Facilities" : "Vybavení okolí"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-normal">
                          {activePoi.category === "Museums" ? (
                            language === "en" ? "In-town amenities. Restrooms inside." : "Městské zázemí. Toalety uvnitř."
                          ) : (
                            language === "en" ? "Parking nearby. Restrooms at trailhead." : "Parkování poblíž. Toalety na začátku stezky."
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Digital stamp */}
                    <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-emerald-200 bg-emerald-50/20 p-5 sm:flex-row">
                      <div className="space-y-1.5 flex-1 text-center sm:text-left">
                        <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest">
                          {language === "en" ? "Digital Explorer Stamp" : "Digitální razítko objevitele"}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {language === "en"
                            ? `Earn your '${activePoi.stampName}' by scanning the QR code at the physical information board near the site.`
                            : `Získejte své razítko '${activePoi.stampName}' naskenováním QR kódu na informační tabuli přímo u cíle.`}
                        </p>
                        <button
                          onClick={() => setIsScannerOpen(true)}
                          className="mt-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 shadow-sm"
                        >
                          <Compass className="w-4 h-4 text-white" />
                          <span>{language === "en" ? "Open Scanner" : "Otevřít Skener"}</span>
                        </button>
                      </div>

                      <div className="relative w-28 h-28 bg-slate-50 border border-emerald-200 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center shadow-inner shrink-0 overflow-hidden">
                        <img
                          src={activePoi.stampImage}
                          alt={activePoi.stampName}
                          className="w-16 h-16 object-contain opacity-80"
                        />
                        <span className="block text-[8px] font-mono font-black text-emerald-500 uppercase tracking-widest mt-2 leading-none">
                          SCAN AT LOCATION
                        </span>
                      </div>
                    </div>
                  </div>

                {/* Sidebar */}
                <div className="space-y-6 lg:col-span-4">
                  <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
                    <button
                      type="button"
                      onClick={() => goMap(activePoi.id)}
                      className="relative h-36 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                    >
                        {/* Styled topographic concentric loops & grids */}
                        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-75" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-slate-200/50" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-slate-200/50" />

                        {/* Centered blinking destination marker pin */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                          <div className="w-4 h-4 bg-emerald-500 rounded-full animate-ping absolute" />
                          <MapPin className="w-7 h-7 text-emerald-600 drop-shadow-md relative z-10" />
                        </div>

                        <div className="absolute bottom-2 right-2 rounded bg-white/90 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-slate-700">
                          {language === "en" ? "View Full Map" : "Zobrazit mapu"}
                        </div>
                      </button>

                      {/* Main action buttons */}
                      <div className="space-y-2.5">
                        <button
                          onClick={() => setIsScannerOpen(true)}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Award className="w-4 h-4 text-white" />
                          <span>{language === "en" ? "Collect Digital Stamp" : "Získat digitální razítko"}</span>
                        </button>

                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={() => {
                              window.open(
                                ROUTES.navigate(activePoi.id),
                                "_blank",
                                "noopener,noreferrer"
                              );
                            }}
                            className="bg-white hover:bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-wider py-3 px-3 rounded-xl border border-slate-200 hover:text-slate-900 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Compass className="w-3.5 h-3.5 text-slate-500" />
                            <span>{language === "en" ? "Navigate" : "Navigovat"}</span>
                          </button>

                          <button
                            onClick={handleToggleSave}
                            className={`font-bold text-xs uppercase tracking-wider py-3 px-3 rounded-xl border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              isSaved
                                ? "bg-emerald-50/30 border-emerald-500/50 text-emerald-600"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-emerald-600 text-emerald-600" : "text-slate-500"}`} />
                            <span>{isSaved ? (language === "en" ? "Saved" : "Uloženo") : (language === "en" ? "Save" : "Uložit")}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Trek details */}
                    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
                      <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest border-b border-slate-200 pb-2">
                        {language === "en" ? "Trek Details" : "Podrobnosti výstupu"}
                      </h3>
                      <div className="space-y-2.5 text-xs text-slate-600">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                          <span className="font-medium text-slate-400">{language === "en" ? "Elevation Gain" : "Převýšení"}</span>
                          <span className="font-mono font-bold text-slate-900">{activePoi.elevationGain}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                          <span className="font-medium text-slate-400">{language === "en" ? "Est. Time" : "Odhadovaný čas"}</span>
                          <span className="font-mono font-bold text-slate-900">{activePoi.estTime}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-slate-400">{language === "en" ? "Distance" : "Délka trasy"}</span>
                          <span className="font-mono font-bold text-slate-900">{activePoi.distance}</span>
                        </div>
                      </div>
                    </div>
                </div>
              </div>

              {/* Nearby destinations */}
              <div className="space-y-4 border-t border-slate-200/60 pt-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">
                      {language === "en" ? "Discover More Nearby" : "Objevte další cíle v okolí"}
                    </h3>
                    <button
                      onClick={() => goMap()}
                      className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>{language === "en" ? "See all attractions" : "Zobrazit všechny cíle"}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pois
                      .filter((p) => p.id !== activePoi.id)
                      .slice(0, 3)
                      .map((poi) => {
                        const relDist = getDistanceKm(activePoi.lat, activePoi.lng, poi.lat, poi.lng).toFixed(1);
                        return (
                          <div
                            key={poi.id}
                            onClick={() => {
                              goLocation(poi.id);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="flex cursor-pointer gap-3.5 rounded-2xl border border-slate-200 bg-white p-3 transition-all hover:border-emerald-500/40 group"
                          >
                            <img
                              src={poi.image}
                              alt={poi.name}
                              className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0 flex flex-col justify-between py-0.5">
                              <div>
                                <h4 className="text-xs font-black text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
                                  {language === "en" ? poi.name : poi.czName}
                                </h4>
                                <span className="text-[10px] text-slate-500 font-extrabold block mt-0.5 uppercase tracking-wider leading-none">
                                  {poi.category}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50/30 px-2 py-0.5 rounded border border-emerald-200 inline-block w-fit mt-1 leading-none">
                                {relDist} km away
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
              </div>
            </div>
          );
        })()}

        {/* 3b. NAVIGATION SCREEN */}
        {currentView === "navigate" && !activePoi && (
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-sm">
            <p className="text-sm text-slate-400">
              {language === "en"
                ? "This navigation destination could not be found."
                : "Tento navigační cíl nebyl nalezen."}
            </p>
            <button
              onClick={goHome}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500"
            >
              {language === "en" ? "Back to Home" : "Zpět na úvod"}
            </button>
          </div>
        )}

        {currentView === "navigate" && activePoi && (
          <NavigateView
            poi={activePoi}
            language={language}
            onBackToDetails={() => goLocation(activePoi.id)}
          />
        )}

        {/* 4. STAMP PASS / COLLECTION SCREEN */}
        {currentView === "stamps" && loggedInUser && (
          <div className="space-y-8 animate-fade-in">
            {/* Profile Header Block */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm relative overflow-hidden">
              <div className="absolute -left-12 -top-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              {/* Profile Avatar */}
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbIiRKQ-fxXE6EVLDwIZFoaIvznTk4oagg6KQAVxRb24xZipzkaMAHwKm8n2K_EzfJZ8Uz5bNmUeJGsek5iIeVGC9yNRvJNzxdecptiRpoFnxGfQuSYxMpyokjGFwXewx_M_2sVu_qtmyBnMAxksX1Ij3Ac1YfEp_OhYnRw6lo5igPs4Nbk12-bYOsJUB98n-GsGNsZ3oQo5y0s4YLCKe0o_BgJMsjqoD0wY-ZAv_oNvMeUiN6jMZO_UCTP8PE8WgrzKIdNNnEWyWy"
                alt="Adventurer Lukas Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500 shadow-lg"
              />
              <div className="flex-1 space-y-4">
                <div className="text-center md:text-left">
                  <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono tracking-widest uppercase font-bold px-3 py-1 rounded-full inline-block mb-1">
                    Level {adventurerLevel} Adventurer
                  </span>
                  <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 tracking-tight">
                    Lukas Müller
                  </h2>
                  <span className="text-xs text-slate-400 font-mono">
                    Member since: June 2026 • Klatovy, CZ
                  </span>
                </div>

                {/* Progress bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Total Stamps */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>{language === "en" ? "Stamps Collected" : "Získaná razítka"}</span>
                      <span className="text-emerald-600 font-bold">{unlockedStampsCount}/{totalStampsCount}</span>
                    </div>
                    <div className="w-full bg-slate-50 rounded-full h-2 overflow-hidden border border-slate-200">
                      <div
                        className="bg-emerald-500 h-full shadow-[0_0_8px_#10b981] transition-all duration-500"
                        style={{ width: `${totalStampsCount > 0 ? (unlockedStampsCount / totalStampsCount) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Secret Tips */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>{language === "en" ? "Secret Tips" : "Tajné tipy"}</span>
                      <span className="text-emerald-600 font-bold">{unlockedSecretTipsCount}/{totalSecretTipsCount}</span>
                    </div>
                    <div className="w-full bg-slate-50 rounded-full h-2 overflow-hidden border border-slate-200">
                      <div
                        className="bg-emerald-500 h-full shadow-[0_0_8px_#10b981] transition-all duration-500"
                        style={{ width: `${totalSecretTipsCount > 0 ? (unlockedSecretTipsCount / totalSecretTipsCount) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2.5 w-full md:w-auto self-stretch md:self-center">
                <button
                  onClick={handleCollectNearestStamp}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer text-center whitespace-nowrap"
                >
                  {language === "en" ? "Collect Nearest Stamp" : "Získat nejbližší razítko"}
                </button>

                <button
                  onClick={handleResetStampPass}
                  className="flex-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 hover:border-rose-300 text-rose-700 font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl shadow-sm transition-all cursor-pointer text-center whitespace-nowrap flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === "en" ? "Reset Stamp Pass" : "Resetovat razítka"}</span>
                </button>
              </div>
            </div>

            {/* Achievements list */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                Explorer Achievements
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className={`p-4 rounded-2xl border flex flex-col justify-between h-36 relative overflow-hidden ${
                      ach.unlocked
                        ? "bg-emerald-50/30 border-emerald-500/30 text-slate-700"
                        : "bg-white border-slate-200 text-slate-500 shadow-sm"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <Award
                          className={`w-6 h-6 ${ach.unlocked ? "text-emerald-600" : "text-slate-600"}`}
                        />
                        {ach.unlocked ? (
                          <span className="text-[9px] font-mono text-emerald-600 font-bold uppercase">
                            UNLOCKED
                          </span>
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-slate-600" />
                        )}
                      </div>
                      <h4 className={`text-xs font-bold mt-3 ${ach.unlocked ? "text-slate-900" : "text-slate-500"}`}>
                        {ach.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {ach.description}
                      </p>
                    </div>
                    {ach.unlocked && (
                      <span className="text-[9px] font-mono text-slate-500 block mt-2">
                        Earned: {ach.unlockedAt}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* My Stamp Collection Grid */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                My Stamp Pass Collection
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {userStamps.map((stamp) => (
                  <div
                    key={stamp.id}
                    onClick={() => {
                      const targetPoi = pois.find((p) => p.id === stamp.poiId);
                      if (targetPoi) {
                        goLocation(targetPoi.id);
                      }
                    }}
                    className={`p-4 sm:p-5 rounded-2xl border flex flex-col items-center text-center transition-all cursor-pointer shadow-sm min-h-[200px] sm:h-56 ${
                      stamp.unlocked
                        ? "bg-white border-slate-200 hover:border-emerald-500"
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:border-emerald-300"
                    }`}
                  >
                    {/* Stamp Circular Emblem */}
                    <div className="relative mb-4">
                      <img
                        src={stamp.stampImage}
                        alt={stamp.stampName}
                        className={`w-24 h-24 object-contain p-2 rounded-full border bg-slate-50 transition-all ${
                          stamp.unlocked
                            ? "border-emerald-500 shadow-md shadow-emerald-600/15 grayscale-0"
                            : "border-slate-200/80 grayscale opacity-30"
                        }`}
                      />
                      {!stamp.unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 rounded-full">
                          <Lock className="w-5 h-5 text-slate-600" />
                        </div>
                      )}
                    </div>

                    <h4 className={`text-xs font-bold leading-tight ${stamp.unlocked ? "text-slate-900" : "text-slate-500"}`}>
                      {stamp.stampName}
                    </h4>
                    <span className="text-[10px] text-slate-500 block mt-1.5 truncate max-w-full">
                      {stamp.poiName}
                    </span>
                    {stamp.unlocked && stamp.collectedAt && (
                      <span className="text-[9px] font-mono text-emerald-600 mt-2 block">
                        {stamp.collectedAt}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* REGIONAL FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-10 sm:py-12 mt-12 sm:mt-16 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand column */}
          <div className="space-y-2">
            <span className="text-sm font-black text-slate-900 uppercase tracking-widest block">
              LR & Klatovy Discovery
            </span>
            <p className="leading-relaxed font-light text-[11px] text-slate-400 max-w-sm">
              Your premium concierge for exploring the hidden gems of the German-Czech border landscapes.
            </p>
            <div className="flex gap-2.5 pt-1.5">
              <span className="w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center font-bold text-[10px] text-slate-400 hover:bg-slate-100 cursor-pointer transition-colors">f</span>
              <span className="w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center font-bold text-[10px] text-slate-400 hover:bg-slate-100 cursor-pointer transition-colors">in</span>
              <span className="w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center font-bold text-[10px] text-slate-400 hover:bg-slate-100 cursor-pointer transition-colors">yt</span>
            </div>
          </div>

          {/* Quick links column */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-700 tracking-wider block">
              Quick Links
            </span>
            <ul className="space-y-1.5 text-[11px] font-medium text-slate-400">
              <li><span className="hover:text-emerald-600 cursor-pointer transition-colors">About Us</span></li>
              <li><span className="hover:text-emerald-600 cursor-pointer transition-colors">Terms of Service</span></li>
              <li><span className="hover:text-emerald-600 cursor-pointer transition-colors">Privacy Policy</span></li>
              <li><span className="hover:text-emerald-600 cursor-pointer transition-colors">Contact</span></li>
            </ul>
          </div>

          {/* Subscription column */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-700 tracking-wider block">
              Join the Adventure
            </span>
            <p className="leading-relaxed font-light text-[11px] text-slate-400 max-w-sm">
              Sign up for our newsletter to receive the latest trail updates and seasonal highlights.
            </p>
            <div className="flex gap-2 pt-1 max-w-md">
              <input
                type="email"
                placeholder="Your email..."
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-[11px] flex-1 outline-none focus:border-emerald-500 text-slate-800"
              />
              <button
                onClick={() => alert(language === "en" ? "Thank you for subscribing!" : "Děkujeme za přihlášení!")}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer shadow-sm"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-slate-500">
          <span>&copy; 2026 grenzraum. All rights reserved.</span>
          <span className="mt-2 sm:mt-0 text-emerald-600 font-semibold uppercase tracking-widest">
            ● All systems synchronized with BayernCloud
          </span>
        </div>
      </footer>

      {/* ALL MODALS PRELOADED AND WIRED TO CORRESPONDING ACTIONS */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        poiName={activePoi ? (language === "en" ? activePoi.name : activePoi.czName) : ""}
        language={language}
        isLoggedIn={!!loggedInUser}
        onStampScanned={handleStampScanned}
        onRequireLogin={handleRequireLoginForStamp}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          setPendingReturnPath(null);
        }}
        language={language}
        onLoginSuccess={handleLoginSuccess}
        onGoRegister={openRegisterModal}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        language={language}
        onOpenLogin={switchToLoginFromRegister}
      />

      <StampCelebration
        active={showStampCelebration}
        celebrationKey={celebrationKey}
        message={celebrationMeta?.message ?? (language === "en" ? "Stamp Collected!" : "Razítko získáno!")}
        subMessage={
          celebrationMeta?.subMessage ??
          (language === "en"
            ? "Another adventure logged on your explorer pass."
            : "Další dobrodružství zapsáno do vašeho pasu.")
        }
      />

    </div>
  );
}
