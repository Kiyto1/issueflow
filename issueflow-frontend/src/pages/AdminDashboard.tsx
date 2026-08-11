import { useEffect, useState } from "react";

import api from "../api/axios";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";

import type {
  Dashboard,
  Department,
  Ticket,
  User,
} from "../types";

export default function AdminDashboard() {
  const [dashboard, setDashboard] =
    useState<Dashboard | null>(null);

  const [users, setUsers] =
    useState<User[]>([]);

  const [tickets, setTickets] =
    useState<Ticket[]>([]);

  const [departments, setDepartments] =
    useState<Department[]>([]);

  const [agentName, setAgentName] =
    useState("");

  const [agentEmail, setAgentEmail] =
    useState("");

  const [agentPassword, setAgentPassword] =
    useState("");

  const [agentDepartment, setAgentDepartment] =
    useState("");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    const [
      dashboardResponse,
      usersResponse,
      ticketsResponse,
      departmentsResponse,
    ] = await Promise.all([
      api.get<Dashboard>("/admin/dashboard"),
      api.get<User[]>("/admin/users"),
      api.get<Ticket[]>("/admin/tickets"),
      api.get<Department[]>("/departments"),
    ]);

    setDashboard(dashboardResponse.data);
    setUsers(usersResponse.data);
    setTickets(ticketsResponse.data);
    setDepartments(departmentsResponse.data);
  }

  async function createAgent(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    await api.post("/admin/agents", {
      name: agentName,
      email: agentEmail,
      password: agentPassword,
      departmentId: Number(agentDepartment),
    });

    setAgentName("");
    setAgentEmail("");
    setAgentPassword("");
    setAgentDepartment("");

    setMessage("Agent created successfully.");

    loadAll();
  }

  if (!dashboard) {
    return (
      <Layout>
        <div className="empty-state">
          Loading dashboard...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <span className="eyebrow">
            ADMINISTRATION
          </span>

          <h1>Support Overview</h1>

          <p>
            Monitor tickets, users, agents, and overall support activity.
          </p>
        </div>
      </div>

      <div className="stats-grid stats-grid-5">
        <div className="stat-card">
          <span>Total</span>
          <strong>{dashboard.totalTickets}</strong>
          <small>All tickets</small>
        </div>

        <div className="stat-card">
          <span>Open</span>
          <strong>{dashboard.openTickets}</strong>
          <small>Waiting</small>
        </div>

        <div className="stat-card">
          <span>In Progress</span>
          <strong>{dashboard.inProgressTickets}</strong>
          <small>Active</small>
        </div>

        <div className="stat-card">
          <span>Resolved</span>
          <strong>{dashboard.resolvedTickets}</strong>
          <small>Resolved</small>
        </div>

        <div className="stat-card">
          <span>Closed</span>
          <strong>{dashboard.closedTickets}</strong>
          <small>Completed</small>
        </div>
      </div>

      <div className="admin-grid">
        <section className="section-card">
          <div className="section-header">
            <div>
              <h2>Create Agent</h2>
              <p>
                Add a support agent and assign a department.
              </p>
            </div>
          </div>

          {message && (
            <div className="alert alert-success">
              {message}
            </div>
          )}

          <form
            onSubmit={createAgent}
            className="admin-form"
          >
            <div className="form-group">
              <label>Agent name</label>

              <input
                value={agentName}
                onChange={(e) =>
                  setAgentName(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                value={agentEmail}
                onChange={(e) =>
                  setAgentEmail(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                minLength={6}
                value={agentPassword}
                onChange={(e) =>
                  setAgentPassword(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Department</label>

              <select
                value={agentDepartment}
                onChange={(e) =>
                  setAgentDepartment(e.target.value)
                }
                required
              >
                <option value="">
                  Select department
                </option>

                {departments.map((department) => (
                  <option
                    key={department.id}
                    value={department.id}
                  >
                    {department.name}
                  </option>
                ))}
              </select>
            </div>

            <button className="button button-primary">
              Create Agent
            </button>
          </form>
        </section>

        <section className="section-card">
          <div className="section-header">
            <div>
              <h2>Users</h2>
              <p>
                Registered customers and support staff.
              </p>
            </div>

            <span className="count-pill">
              {users.length}
            </span>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.name}</strong>
                      <span className="table-subtext">
                        {user.email}
                      </span>
                    </td>

                    <td>{user.role}</td>

                    <td>
                      {user.departmentName ?? "Unassigned"}
                    </td>

                    <td>
                      <span
                        className={
                          user.active
                            ? "user-status active"
                            : "user-status"
                        }
                      >
                        {user.active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>All Tickets</h2>
            <p>
              System-wide support activity.
            </p>
          </div>

          <span className="count-pill">
            {tickets.length}
          </span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Customer</th>
                <th>Department</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Agent</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>
                    <strong>
                      #{ticket.id} {ticket.title}
                    </strong>
                  </td>

                  <td>{ticket.customerName}</td>

                  <td>{ticket.departmentName}</td>

                  <td>
                    <StatusBadge
                      value={ticket.priority}
                    />
                  </td>

                  <td>
                    <StatusBadge
                      value={ticket.status}
                    />
                  </td>

                  <td>
                    {ticket.assignedAgentName ??
                      "Unassigned"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
