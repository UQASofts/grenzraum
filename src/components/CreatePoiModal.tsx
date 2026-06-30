import React, { useState, useEffect } from "react";
import { X, Plus, AlertCircle, Save } from "lucide-react";
import { POI } from "../types";
import { DashboardLanguage, dtr } from "../i18n/language";

interface CreatePoiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (poi: POI) => void;
  editingPoi: POI | null;
  language: DashboardLanguage;
}

export default function CreatePoiModal({
  isOpen,
  onClose,
  onSave,
  editingPoi,
  language,
}: CreatePoiModalProps) {
  const [name, setName] = useState("");
  const [deName, setDeName] = useState("");
  const [czName, setCzName] = useState("");
  const [category, setCategory] = useState<POI["category"]>("Hiking");
  const [difficulty, setDifficulty] = useState<POI["difficulty"]>("Moderate");
  const [elevationGain, setElevationGain] = useState("");
  const [estTime, setEstTime] = useState("");
  const [distance, setDistance] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [deDescription, setDeDescription] = useState("");
  const [czDescription, setCzDescription] = useState("");
  const [image, setImage] = useState("");
  const [stampName, setStampName] = useState("");

  useEffect(() => {
    if (editingPoi) {
      setName(editingPoi.name);
      setDeName(editingPoi.deName || "");
      setCzName(editingPoi.czName);
      setCategory(editingPoi.category);
      setDifficulty(editingPoi.difficulty);
      setElevationGain(editingPoi.elevationGain);
      setEstTime(editingPoi.estTime);
      setDistance(editingPoi.distance);
      setLat(editingPoi.lat.toString());
      setLng(editingPoi.lng.toString());
      setDescription(editingPoi.description);
      setDeDescription(editingPoi.deDescription || "");
      setCzDescription(editingPoi.czDescription);
      setImage(editingPoi.image);
      setStampName(editingPoi.stampName);
    } else {
      // Clear fields for new POI
      setName("");
      setDeName("");
      setCzName("");
      setCategory("Hiking");
      setDifficulty("Moderate");
      setElevationGain("");
      setEstTime("");
      setDistance("");
      setLat("49.15");
      setLng("13.20");
      setDescription("");
      setDeDescription("");
      setCzDescription("");
      setImage("https://lh3.googleusercontent.com/aida-public/AB6AXuCA1sNBaAQujbgJwZoFtMZ2CEShQxh0DLfGpCYqfRySYXRcq6owzqIoYJ6kLW0F0k_EBsBK26_i11fWP2c1KQGbxgmgYaLuNO-NUX2x08B2uYaTaE7mOWNpf5zw3oAekGT9G04yOkaBfSsQk9GB4LZ9ad8oKJjn2BXyzu990BU8Lo7GpZz-6p1KtD2A999ugsSqx5VN3f-qUfhiTufJqe89LeihUJd81de76VlKWl7AAKzymcSGC8HrywXEBZyZ6azL8mbSBEfv1-M0"); // Forest Trail pic
      setStampName("");
    }
  }, [editingPoi, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !czName || !lat || !lng) {
      alert("Please fill in all mandatory fields.");
      return;
    }

    const newPoi: POI = {
      id: editingPoi?.id || `poi-${Date.now()}`,
      name,
      czName,
      deName: deName || undefined,
      category,
      difficulty,
      elevationGain: elevationGain || "0 m",
      estTime: estTime || "1h 00m",
      distance: distance || "1.0 km",
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      description: description || "No English description provided.",
      deDescription: deDescription || undefined,
      czDescription: czDescription || "Popis nebyl zadán.",
      image: image || "https://lh3.googleusercontent.com/aida-public/AB6AXuCA1sNBaAQujbgJwZoFtMZ2CEShQxh0DLfGpCYqfRySYXRcq6owzqIoYJ6kLW0F0k_EBsBK26_i11fWP2c1KQGbxgmgYaLuNO-NUX2x08B2uYaTaE7mOWNpf5zw3oAekGT9G04yOkaBfSsQk9GB4LZ9ad8oKJjn2BXyzu990BU8Lo7GpZz-6p1KtD2A999ugsSqx5VN3f-qUfhiTufJqe89LeihUJd81de76VlKWl7AAKzymcSGC8HrywXEBZyZ6azL8mbSBEfv1-M0",
      stampName: stampName || `${name} Stamp`,
      stampImage: editingPoi?.stampImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuArGvsjOhpYPv5fw2kq8DGRliU-6BabAUK_Bp9GQIp32q_o5q_hPmYHWUeBA11ewfXSAy7G_HiOnyMh68HfmGdHYhBmtY-GSREV9hOLB6YKcs6Lr-EJh3Fy5veuLR0sSPowDo7m4Mman3rTbFBX4pAI7vDHQxTTHAKETi5W0YQhbrGyW_uoESxGs-XMTT_ZG9EvZLTLNfgHwgA-yYrotfOUN5Js3O6qBXsxqy9qBwMkYIgnnYpPr-DgrtE8V1QoG4ol0EvG9dHnsYUc",
      status: "Pending",
      languages: editingPoi?.languages || ["en", "de", "cs"],
      secretTip: category === "Secret Tips",
    };

    onSave(newPoi);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">
            {editingPoi
              ? dtr(language, "Edit Point of Interest", "POI bearbeiten")
              : dtr(language, "Create New Destination", "Neues Ziel erstellen")}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Section 1: Bilingual Names */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Name (English) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. White Gorge Waterfall"
                required
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Name (Deutsch)
              </label>
              <input
                type="text"
                value={deName}
                onChange={(e) => setDeName(e.target.value)}
                placeholder="z. B. Wasserfall Weiße Schlucht"
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Název (Česky) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={czName}
                onChange={(e) => setCzName(e.target.value)}
                placeholder="např. Bílá strž"
                required
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none"
              />
            </div>
          </div>

          {/* Section 2: Category and difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as POI["category"])}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none"
              >
                <option value="Hiking">Hiking</option>
                <option value="Lakes">Lakes</option>
                <option value="Waterfalls">Waterfalls</option>
                <option value="Museums">Museums</option>
                <option value="Secret Tips">Secret Tips</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as POI["difficulty"])}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Challenging">Challenging</option>
              </select>
            </div>
          </div>

          {/* Section 3: Specs: Elevation, Time, Distance */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Elevation Gain
              </label>
              <input
                type="text"
                value={elevationGain}
                onChange={(e) => setElevationGain(e.target.value)}
                placeholder="e.g. 250 m"
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Est. Time
              </label>
              <input
                type="text"
                value={estTime}
                onChange={(e) => setEstTime(e.target.value)}
                placeholder="e.g. 2h 15m"
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Distance
              </label>
              <input
                type="text"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="e.g. 5.2 km"
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none"
              />
            </div>
          </div>

          {/* Section 4: Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Latitude (GPS) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="e.g. 49.1786"
                required
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Longitude (GPS) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="e.g. 13.2561"
                required
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none font-mono"
              />
            </div>
          </div>

          {/* Section 5: Image & Stamp Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Stamp Name
              </label>
              <input
                type="text"
                value={stampName}
                onChange={(e) => setStampName(e.target.value)}
                placeholder="e.g. Summit Pass Stamp"
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none"
              />
            </div>
          </div>

          {/* Section 6: Bilingual Descriptions */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Description (English)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Write a captivating hiking description in English..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-4 text-sm text-slate-800 outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Beschreibung (Deutsch)
            </label>
            <textarea
              value={deDescription}
              onChange={(e) => setDeDescription(e.target.value)}
              rows={3}
              placeholder="Beschreibung auf Deutsch..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-4 text-sm text-slate-800 outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Popis (Česky)
            </label>
            <textarea
              value={czDescription}
              onChange={(e) => setCzDescription(e.target.value)}
              rows={3}
              placeholder="Napište poutavý popis v češtině pro turisty..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-4 text-sm text-slate-800 outline-none resize-none"
            />
          </div>

          {/* Footer Controls */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{editingPoi ? "Save Changes" : "Create Destination"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
