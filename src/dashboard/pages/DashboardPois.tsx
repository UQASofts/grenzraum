import { useState } from "react";
import { useDashboardLanguage } from "../../context/DashboardLanguageContext";
import { dashboardUi } from "../../i18n/dashboard";
import { Plus, Edit2, Trash2, MapPin, Users, Award, Wifi, QrCode } from "lucide-react";
import { useData } from "../../context/DataContext";
import { POI } from "../../types";
import CreatePoiModal from "../../components/CreatePoiModal";
import PoiQrCodeModal from "../../components/PoiQrCodeModal";

export default function DashboardPois() {
  const { language } = useDashboardLanguage();
  const { pois, savePoi, deletePoi } = useData();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPoi, setEditingPoi] = useState<POI | null>(null);
  const [qrPoi, setQrPoi] = useState<POI | null>(null);

  const handleDelete = (id: string) => {
    if (confirm(dashboardUi.deletePoiConfirm(language))) {
      deletePoi(id);
    }
  };

  const stats = [
    {
      label: dashboardUi.totalPois(language),
      value: pois.length.toString(),
      icon: MapPin,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: dashboardUi.passHolders(language),
      value: "3,812",
      icon: Users,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: dashboardUi.stampsIssued(language),
      value: "14,290",
      icon: Award,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: dashboardUi.syncNodes(language),
      value: dashboardUi.online(language),
      icon: Wifi,
      color: "text-emerald-600 bg-emerald-50",
      highlight: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((card) => (
          <div
            key={card.label}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div>
              <p className="text-xs font-medium text-slate-500">{card.label}</p>
              <p
                className={`mt-1 text-2xl font-bold ${
                  card.highlight ? "text-emerald-600" : "text-slate-900"
                }`}
              >
                {card.value}
              </p>
            </div>
            <div className={`rounded-xl p-3 ${card.color}`}>
              <card.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-slate-900">{dashboardUi.poiDirectory(language)}</h2>
            <p className="text-xs text-slate-500">{dashboardUi.poiDirectoryDesc(language)}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingPoi(null);
              setIsCreateOpen(true);
            }}
            className="flex items-center justify-center gap-1.5 self-start rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-500 sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            {dashboardUi.addPoi(language)}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Languages</th>
                <th className="px-6 py-3">Difficulty</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pois.map((poi) => (
                <tr key={poi.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={poi.image}
                        alt={poi.name}
                        className="h-10 w-10 rounded-lg border border-slate-200 object-cover"
                      />
                      <div>
                        <span className="block font-medium text-slate-900">{poi.name}</span>
                        <span className="font-mono text-[10px] text-slate-400">
                          Lat: {poi.lat} Lng: {poi.lng}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                      {poi.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {(poi.languages || ["en", "de", "cs"]).map((l) => (
                        <span
                          key={l}
                          className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] uppercase text-slate-500"
                        >
                          {l}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-semibold ${
                        poi.difficulty === "Easy"
                          ? "text-emerald-600"
                          : poi.difficulty === "Moderate"
                            ? "text-amber-600"
                            : "text-rose-600"
                      }`}
                    >
                      {poi.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Synced
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setQrPoi(poi)}
                        className="rounded-lg border border-slate-200 p-2 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                        title="Generate stamp QR code"
                      >
                        <QrCode className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPoi(poi);
                          setIsCreateOpen(true);
                        }}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(poi.id)}
                        className="rounded-lg border border-rose-200 p-2 text-rose-500 hover:bg-rose-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PoiQrCodeModal
        isOpen={qrPoi !== null}
        onClose={() => setQrPoi(null)}
        poi={qrPoi}
      />

      <CreatePoiModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingPoi(null);
        }}
        onSave={(poi) => {
          savePoi(poi);
          setIsCreateOpen(false);
          setEditingPoi(null);
        }}
        editingPoi={editingPoi}
        language={language}
      />
    </div>
  );
}
