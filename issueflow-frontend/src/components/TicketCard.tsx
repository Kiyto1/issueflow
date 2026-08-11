import { Link } from "react-router-dom";
import type { Ticket } from "../types";
import StatusBadge from "./StatusBadge";

interface Props {
  ticket: Ticket;
}

export default function TicketCard({ ticket }: Props) {
  return (
    <Link
      to={`/tickets/${ticket.id}`}
      className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-medium text-slate-400">
            #{ticket.id}
          </p>

          <h3 className="text-base font-semibold text-slate-900">
            {ticket.title}
          </h3>
        </div>

        <StatusBadge value={ticket.status} />
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
        {ticket.description}
      </p>

      <div className="mt-5 grid grid-cols-3 gap-4 border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs text-slate-400">
            Department
          </p>

          <p className="mt-1 truncate text-sm font-medium text-slate-700">
            {ticket.departmentName}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">
            Priority
          </p>

          <div className="mt-1">
            <StatusBadge value={ticket.priority} />
          </div>
        </div>

        <div>
          <p className="text-xs text-slate-400">
            Agent
          </p>

          <p className="mt-1 truncate text-sm font-medium text-slate-700">
            {ticket.assignedAgentName ?? "Unassigned"}
          </p>
        </div>
      </div>
    </Link>
  );
}