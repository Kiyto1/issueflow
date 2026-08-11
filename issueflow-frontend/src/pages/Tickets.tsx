import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/axios";
import Layout from "../components/Layout";
import TicketCard from "../components/TicketCard";

import type { Ticket } from "../types";

export default function Tickets() {
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
        await api.get<Ticket[]>("/tickets/my");

      setTickets(response.data);
    } finally {
      setLoading(false);
    }
  }

  const openCount =
    tickets.filter(
      (ticket) => ticket.status === "OPEN"
    ).length;

  const inProgressCount =
    tickets.filter(
      (ticket) => ticket.status === "IN_PROGRESS"
    ).length;

  const resolvedCount =
    tickets.filter(
      (ticket) =>
        ticket.status === "RESOLVED" ||
        ticket.status === "CLOSED"
    ).length;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <span className="eyebrow">
            CUSTOMER PORTAL
          </span>

          <h1>My Support Tickets</h1>

          <p>
            Track and manage all your support requests.
          </p>
        </div>

        <Link
          to="/tickets/new"
          className="button button-primary"
        >
          + New Ticket
        </Link>
      </div>

      <div className="stats-grid stats-grid-3">
        <div className="stat-card">
          <span>Open</span>
          <strong>{openCount}</strong>
          <small>Waiting for support</small>
        </div>

        <div className="stat-card">
          <span>In Progress</span>
          <strong>{inProgressCount}</strong>
          <small>Currently being handled</small>
        </div>

        <div className="stat-card">
          <span>Resolved</span>
          <strong>{resolvedCount}</strong>
          <small>Completed requests</small>
        </div>
      </div>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Recent Tickets</h2>
            <p>
              Your latest support activity.
            </p>
          </div>

          <span className="count-pill">
            {tickets.length} total
          </span>
        </div>

        {loading ? (
          <div className="empty-state">
            Loading tickets...
          </div>
        ) : tickets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">?</div>
            <h3>No tickets yet</h3>
            <p>
              Create your first support request to get started.
            </p>

            <Link
              to="/tickets/new"
              className="button button-primary"
            >
              Create Ticket
            </Link>
          </div>
        ) : (
          <div className="ticket-grid">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
              />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
