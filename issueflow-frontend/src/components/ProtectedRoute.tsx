import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import type { Role } from "../types";

interface Props {
  children: ReactNode;
  roles?: Role[];
}

export default function ProtectedRoute({
  children,
  roles,
}: Props) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") as Role | null;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && (!role || !roles.includes(role))) {
    return <Navigate to="/" replace />;
  }

  return children;
}