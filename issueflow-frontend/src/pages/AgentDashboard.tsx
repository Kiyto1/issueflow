import { useEffect, useState } from "react";

import api from "../api/axios";
import Layout from "../components/Layout";
import TicketCard from "../components/TicketCard";

import type { Ticket } from "../types";

export default function AgentDashboard() {
  const [tickets, setTickets] =
    useState<Ticket[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  async function loadTickets() {
    try {
      const response =
        await api.get<Ticket[]>(
          "/tickets/department"
        );

      setTickets(response.data);
    } finally {
      setLoading(false);
    }
  }

  async function takeTicket(
    id: number
  ) {
    await api.patch(
      `/tickets/${id}/take`
    );

    loadTickets();
  }

  const unassigned =
    tickets.filter(
      (ticket) =>
        !ticket.assignedAgentId &&
        ticket.status === "OPEN"
    );

  const active =
    tickets.filter(
      (ticket) =>
        ticket.status === "IN_PROGRESS"
    );

  const resolved =
    tickets.filter(
      (ticket) =>
        ticket.status === "RESOLVED"
    );

  return (
    <Layout>
      <div className="page-header">
        <div>
          <span className="eyebrow">
            AGENT WORKSPACE
          </span>

          <h1>Department Queue</h1>

          <p>
            Review incoming support requests and take ownership of tickets.
          </p>
        </div>
      </div>

      <div className="stats-grid stats-grid-3">
        <div className="stat-card">
          <span>Waiting</span>
          <strong>{unassigned.length}</strong>
          <small>Unassigned tickets</small>
        </div>

        <div className="stat-card">
          <span>In Progress</span>
          <strong>{active.length}</strong>
          <small>Currently being handled</small>
        </div>

        <div className="stat-card">
          <span>Resolved</span>
          <strong>{resolved.length}</strong>
          <small>Completed by department</small>
        </div>
      </div>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Incoming Queue</h2>

            <p>
              Tickets submitted to your department.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            Loading department tickets...
          </div>
        ) : tickets.length === 0 ? (
          <div className="empty-state">
            No tickets in this department.
          </div>
        ) : (
          <div className="ticket-grid">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="agent-ticket-wrapper"
              >
                <TicketCard ticket={ticket} />

                {!ticket.assignedAgentId &&
                  ticket.status === "OPEN" && (
                    <button
                      className="button button-primary button-full"
                      onClick={() =>
                        takeTicket(ticket.id)
                      }
                    >
                      Take Ticket
                    </button>
                  )}
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
