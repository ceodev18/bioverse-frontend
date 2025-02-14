"use client";
import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const loggedInUser = getCurrentUser();
    
    if (!loggedInUser) {
      router.push("/login"); // Si no está autenticado, lo redirige
    } else {
      setUser(loggedInUser);
    }
  }, []);

  return (
    <div>
      <h1>User Dashboard</h1>
      {user && <p>Welcome, <strong>{user.username}</strong></p>}
      <button onClick={() => { logout(); router.push("/login"); }}>Logout</button>
    </div>
  );
}
