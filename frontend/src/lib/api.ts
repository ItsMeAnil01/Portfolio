import { Project, Message, Experience, Skill } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data as T;
}

// ---- Public ----

export function fetchProjects(): Promise<{ projects: Project[] }> {
  return request("/api/projects");
}

export function fetchExperiences(): Promise<{ experiences: Experience[] }> {
  return request("/api/experiences");
}

export function fetchSkills(): Promise<{ skills: Skill[] }> {
  return request("/api/skills");
}

export function submitContactForm(payload: {
  name: string;
  email: string;
  subject?: string;
  body: string;
  company?: string; // honeypot
}): Promise<{ success: boolean; id: string }> {
  return request("/api/contact", { method: "POST", body: JSON.stringify(payload) });
}

// ---- Admin ----

export function adminLogin(email: string, password: string) {
  return request<{ token: string; admin: { id: string; email: string } }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function adminLogout() {
  return request("/api/auth/logout", { method: "POST" });
}

export function adminListProjects(token: string): Promise<{ projects: Project[] }> {
  return request("/api/admin/projects", { headers: { Authorization: `Bearer ${token}` } });
}

export function adminCreateProject(token: string, data: Partial<Project>) {
  return request<{ project: Project }>("/api/admin/projects", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export function adminUpdateProject(token: string, id: string, data: Partial<Project>) {
  return request<{ project: Project }>(`/api/admin/projects/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export function adminDeleteProject(token: string, id: string) {
  return request<{ success: boolean }>(`/api/admin/projects/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function adminListMessages(token: string): Promise<{ messages: Message[] }> {
  return request("/api/admin/messages", { headers: { Authorization: `Bearer ${token}` } });
}

export function adminMarkMessageRead(token: string, id: string) {
  return request<{ message: Message }>(`/api/admin/messages/${id}/read`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ---- Admin Experience ----
export function adminListExperiences(token: string): Promise<{ experiences: Experience[] }> {
  return request("/api/admin/experiences", { headers: { Authorization: `Bearer ${token}` } });
}

export function adminCreateExperience(token: string, data: Partial<Experience>) {
  return request<{ experience: Experience }>("/api/admin/experiences", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export function adminUpdateExperience(token: string, id: string, data: Partial<Experience>) {
  return request<{ experience: Experience }>(`/api/admin/experiences/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export function adminDeleteExperience(token: string, id: string) {
  return request<{ success: boolean }>(`/api/admin/experiences/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ---- Admin Skills ----
export function adminListSkills(token: string): Promise<{ skills: Skill[] }> {
  return request("/api/admin/skills", { headers: { Authorization: `Bearer ${token}` } });
}

export function adminCreateSkill(token: string, data: Partial<Skill>) {
  return request<{ skill: Skill }>("/api/admin/skills", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export function adminUpdateSkill(token: string, id: string, data: Partial<Skill>) {
  return request<{ skill: Skill }>(`/api/admin/skills/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export function adminDeleteSkill(token: string, id: string) {
  return request<{ success: boolean }>(`/api/admin/skills/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
