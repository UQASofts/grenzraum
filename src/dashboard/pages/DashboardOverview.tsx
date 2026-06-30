import { useData } from "../../context/DataContext";
import { MapPin, Users, Award, TrendingUp } from "lucide-react";

export default function DashboardOverview() {
  const { pois, users } = useData();
  const activeUsers = users.filter((u) => u.status === "active").length;

  const stats = [
    {
      label: "Total POIs",
      value: pois.length.toString(),
      change: "+4% this mo",
      icon: MapPin,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Total Users",
      value: users.length.toString(),
      change: `${activeUsers} active`,
      icon: Users,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Total Stamps",
      value: "14,290",
      change: "+8.2% this mo",
      icon: Award,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  const recentActivity = [
    { user: "Lukas M.", action: "unlocked Summiteer", time: "2 minutes ago" },
    { user: "Anna N.", action: "collected Black Lake stamp", time: "15 minutes ago" },
    { user: "Tomáš H.", action: "started Pancíř trail", time: "1 hour ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div>
              <p className="text-xs font-medium text-slate-500">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{stat.value}</p>
              <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                {stat.change}
              </span>
            </div>
            <div className={`rounded-xl p-3 ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">User Engagement</h2>
              <p className="text-xs text-slate-500">Daily active users over the last 30 days</p>
            </div>
            <div className="flex gap-1 rounded-lg bg-slate-100 p-1 text-xs">
              <span className="rounded px-2 py-1 text-slate-500">Daily</span>
              <span className="rounded bg-white px-2 py-1 font-semibold shadow-sm">Weekly</span>
            </div>
          </div>
          <div className="flex h-40 items-end justify-between gap-2 px-2">
            {[40, 65, 50, 80, 55, 90, 70, 85, 60, 75, 95, 80].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-slate-200 transition-colors hover:bg-emerald-400"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <h2 className="font-bold text-slate-900">Live Achievements</h2>
          </div>
          <ul className="space-y-3">
            {recentActivity.map((item) => (
              <li key={item.time} className="flex gap-3 text-sm">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                <div>
                  <p className="text-slate-800">
                    <span className="font-semibold">{item.user}</span> {item.action}
                  </p>
                  <p className="text-xs text-slate-400">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-bold text-slate-900">Recently Uploaded POIs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">Preview</th>
                <th className="px-6 py-3">POI Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pois.slice(0, 5).map((poi) => (
                <tr key={poi.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3">
                    <img src={poi.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                  </td>
                  <td className="px-6 py-3 font-medium text-slate-900">{poi.name}</td>
                  <td className="px-6 py-3">
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                      {poi.category}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="flex items-center gap-1 text-xs text-emerald-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Published
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
