"use client";
import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "@/services/authService";
import { useRouter } from "next/navigation";
interface User {
  username: string;
  // Add other properties as needed
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loggedInUser = getCurrentUser();
    
    if (!loggedInUser) {
      router.push("/login"); // Si no está autenticado, lo redirige
    } else {
      setUser(loggedInUser);
    }
  }, [router]);

  return (
    <div>
      <h1>User Dashboard</h1>
      {user && <p>Welcome, <strong>{user.username}</strong></p>}
      <button onClick={() => { logout(); router.push("/login"); }}>Logout</button>
    </div>
  );
}
