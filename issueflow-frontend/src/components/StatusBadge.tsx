import type {
  TicketPriority,
  TicketStatus,
} from "../types";

interface Props {
  value: TicketStatus | TicketPriority;
}

export default function StatusBadge({ value }: Props) {
  const styles: Record<string, string> = {
    OPEN: "bg-blue-50 text-blue-700",
    IN_PROGRESS: "bg-amber-50 text-amber-700",
    RESOLVED: "bg-emerald-50 text-emerald-700",
    CLOSED: "bg-slate-100 text-slate-600",

    LOW: "bg-slate-100 text-slate-600",
    MEDIUM: "bg-blue-50 text-blue-700",
    HIGH: "bg-orange-50 text-orange-700",
    URGENT: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[value]}`}
    >
      {value.replace("_", " ")}
    </span>
  );
}