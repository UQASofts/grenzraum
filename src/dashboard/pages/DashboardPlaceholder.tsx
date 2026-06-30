interface DashboardPlaceholderProps {
  title: string;
  description?: string;
}

export default function DashboardPlaceholder({
  title,
  description = "This section is coming soon.",
}: DashboardPlaceholderProps) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
    </div>
  );
}
