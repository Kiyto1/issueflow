import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/axios";
import type { AuthResponse } from "../types";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post<AuthResponse>(
        "/auth/register",
        {
          name,
          email,
          password,
        }
      );

      const data = response.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "userId",
        String(data.userId)
      );
      localStorage.setItem("name", data.name);
      localStorage.setItem("email", data.email);
      localStorage.setItem("role", data.role);

      navigate("/tickets");
    } catch (err: any) {
      setError(
        err.response?.data?.message ??
          "Could not create account"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 font-bold">
            IF
          </div>

          <span className="text-lg font-semibold">
            IssueFlow
          </span>
        </div>

        <div className="max-w-xl">
          <p className="mb-4 text-xs font-bold tracking-[0.2em] text-blue-400">
            GET SUPPORT FASTER
          </p>

          <h1 className="text-5xl font-bold leading-tight tracking-tight">
            One place for
            <br />
            every support request.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-slate-300">
            Create tickets, follow progress, and
            communicate with your support team.
          </p>
        </div>

        <p className="text-xs text-slate-500">
          IssueFlow Helpdesk SaaS
        </p>
      </div>

      <div className="flex items-center justify-center bg-slate-50 px-4 py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40"
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Create account
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Register as a customer.
          </p>

          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full name
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              required
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              required
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>

            <input
              type="password"
              minLength={6}
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading
              ? "Creating account..."
              : "Create account"}
          </button>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already registered?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}