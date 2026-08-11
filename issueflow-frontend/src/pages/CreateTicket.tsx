import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import Layout from "../components/Layout";

import type {
  Department,
  TicketPriority,
} from "../types";

export default function CreateTicket() {
  const navigate = useNavigate();

  const [departments, setDepartments] =
    useState<Department[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [priority, setPriority] =
    useState<TicketPriority>("MEDIUM");

  const [departmentId, setDepartmentId] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadDepartments();
  }, []);

  async function loadDepartments() {
    const response =
      await api.get<Department[]>(
        "/departments"
      );

    setDepartments(response.data);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await api.post("/tickets", {
        title,
        description,
        priority,
        departmentId: Number(departmentId),
      });

      navigate("/tickets");
    } catch (err: any) {
      setError(
        err.response?.data?.message ??
          "Could not create ticket"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <span className="eyebrow">
            NEW REQUEST
          </span>

          <h1>Create Support Ticket</h1>

          <p>
            Tell us what you need help with and choose the correct department.
          </p>
        </div>
      </div>

      <div className="form-layout">
        <form
          onSubmit={handleSubmit}
          className="section-card form-card"
        >
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Ticket title</label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Example: Cannot access my account"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Department</label>

              <select
                value={departmentId}
                onChange={(e) =>
                  setDepartmentId(e.target.value)
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

            <div className="form-group">
              <label>Priority</label>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(
                    e.target.value as TicketPriority
                  )
                }
              >
                <option value="LOW">
                  Low
                </option>

                <option value="MEDIUM">
                  Medium
                </option>

                <option value="HIGH">
                  High
                </option>

                <option value="URGENT">
                  Urgent
                </option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Describe the issue, what you expected to happen, and any useful details..."
              rows={8}
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() =>
                navigate("/tickets")
              }
              className="button button-secondary"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="button button-primary"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit Ticket"}
            </button>
          </div>
        </form>

        <aside className="info-card">
          <span className="eyebrow">
            BEFORE SUBMITTING
          </span>

          <h3>Choose the right department</h3>

          <p>
            Your ticket will be visible to agents from
            the selected department.
          </p>

          <ul>
            <li>
              IT Support - technical problems
            </li>

            <li>
              HR - employee and policy questions
            </li>

            <li>
              Finance - invoices and payment issues
            </li>

            <li>
              General Support - anything else
            </li>
          </ul>
        </aside>
      </div>
    </Layout>
  );
}
