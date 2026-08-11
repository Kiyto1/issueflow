export type Role = "CUSTOMER" | "AGENT" | "ADMIN";

export type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export type TicketPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";

export interface AuthResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
  role: Role;
}

export interface Department {
  id: number;
  name: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;

  customerId: number;
  customerName: string;

  departmentId: number;
  departmentName: string;

  assignedAgentId: number | null;
  assignedAgentName: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  authorId: number;
  authorName: string;
  authorRole: Role;
  createdAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  departmentId: number | null;
  departmentName: string | null;
}

export interface Dashboard {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
}