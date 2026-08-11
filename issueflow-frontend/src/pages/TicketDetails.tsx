import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../api/axios";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";

import type {
  Comment,
  Ticket,
  TicketStatus,
} from "../types";

export default function TicketDetails() {
  const { id } = useParams();

  const role =
    localStorage.getItem("role");

  const currentUserId =
    Number(localStorage.getItem("userId"));

  const [ticket, setTicket] =
    useState<Ticket | null>(null);

  const [comments, setComments] =
    useState<Comment[]>([]);

  const [comment, setComment] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      const ticketResponse =
        await api.get<Ticket>(
          `/tickets/${id}`
        );

      const commentsResponse =
        await api.get<Comment[]>(
          `/tickets/${id}/comments`
        );

      setTicket(ticketResponse.data);
      setComments(commentsResponse.data);
    } finally {
      setLoading(false);
    }
  }

  async function addComment(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!comment.trim()) {
      return;
    }

    await api.post(
      `/tickets/${id}/comments`,
      {
        content: comment,
      }
    );

    setComment("");
    loadData();
  }

  async function takeTicket() {
    await api.patch(
      `/tickets/${id}/take`
    );

    loadData();
  }

  async function updateStatus(
    status: TicketStatus
  ) {
    await api.patch(
      `/tickets/${id}/status`,
      {
        status,
      }
    );

    loadData();
  }

  if (loading || !ticket) {
    return (
      <Layout>
        <div className="empty-state">
          Loading ticket...
        </div>
      </Layout>
    );
  }

  const canAgentComment =
    role === "AGENT" &&
    ticket.assignedAgentId === currentUserId;

  const canCustomerComment =
    role === "CUSTOMER";

  const canAdminComment =
    role === "ADMIN";

  const canComment =
    canAgentComment ||
    canCustomerComment ||
    canAdminComment;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <span className="eyebrow">
            TICKET #{ticket.id}
          </span>

          <h1>{ticket.title}</h1>

          <p>
            Created by {ticket.customerName}
          </p>
        </div>

        <StatusBadge value={ticket.status} />
      </div>

      <div className="ticket-details-layout">
        <div className="ticket-details-main">
          <section className="section-card">
            <div className="details-grid">
              <div>
                <span>Department</span>
                <strong>
                  {ticket.departmentName}
                </strong>
              </div>

              <div>
                <span>Priority</span>
                <StatusBadge value={ticket.priority} />
              </div>

              <div>
                <span>Assigned Agent</span>
                <strong>
                  {ticket.assignedAgentName ??
                    "Unassigned"}
                </strong>
              </div>

              <div>
                <span>Created</span>
                <strong>
                  {new Date(
                    ticket.createdAt
                  ).toLocaleDateString()}
                </strong>
              </div>
            </div>

            <div className="ticket-body">
              <h3>Description</h3>

              <p>
                {ticket.description}
              </p>
            </div>

            {role === "AGENT" &&
              !ticket.assignedAgentId && (
                <button
                  onClick={takeTicket}
                  className="button button-primary"
                >
                  Take This Ticket
                </button>
              )}

            {role === "AGENT" &&
              ticket.assignedAgentId ===
                currentUserId && (
                <div className="action-row">
                  <button
                    onClick={() =>
                      updateStatus("IN_PROGRESS")
                    }
                    className="button button-secondary"
                  >
                    Mark In Progress
                  </button>

                  <button
                    onClick={() =>
                      updateStatus("RESOLVED")
                    }
                    className="button button-primary"
                  >
                    Resolve Ticket
                  </button>
                </div>
              )}

            {role === "CUSTOMER" &&
              ticket.status === "RESOLVED" && (
                <button
                  onClick={() =>
                    updateStatus("CLOSED")
                  }
                  className="button button-primary"
                >
                  Close Ticket
                </button>
              )}
          </section>

          <section className="section-card">
            <div className="section-header">
              <div>
                <h2>Conversation</h2>
                <p>
                  Messages between the customer and support.
                </p>
              </div>

              <span className="count-pill">
                {comments.length}
              </span>
            </div>

            <div className="conversation">
              {comments.length === 0 ? (
                <div className="empty-comments">
                  No replies yet.
                </div>
              ) : (
                comments.map((item) => (
                  <div
                    key={item.id}
                    className={
                      item.authorId === currentUserId
                        ? "message message-own"
                        : "message"
                    }
                  >
                    <div className="message-header">
                      <div>
                        <strong>
                          {item.authorName}
                        </strong>

                        <span>
                          {item.authorRole}
                        </span>
                      </div>

                      <small>
                        {new Date(
                          item.createdAt
                        ).toLocaleString()}
                      </small>
                    </div>

                    <p>{item.content}</p>
                  </div>
                ))
              )}
            </div>

            {canComment && (
              <form
                className="comment-form"
                onSubmit={addComment}
              >
                <textarea
                  value={comment}
                  onChange={(e) =>
                    setComment(e.target.value)
                  }
                  placeholder="Write a reply..."
                  rows={4}
                />

                <div className="comment-actions">
                  <button
                    className="button button-primary"
                  >
                    Send Reply
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>

        <aside className="ticket-side-panel">
          <div className="side-panel-card">
            <span className="eyebrow">
              TICKET STATUS
            </span>

            <h3>
              {ticket.status.replace("_", " ")}
            </h3>

            <p>
              Last updated{" "}
              {new Date(
                ticket.updatedAt
              ).toLocaleString()}
            </p>
          </div>
        </aside>
      </div>
    </Layout>
  );
}
