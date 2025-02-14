"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Answer {
  question: string;
  answer: string;
}

export default function UserAnswersPage() {
  const { id } = useParams();
  const router = useRouter();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/admin/users/${id}`);
        if (!res.ok) throw new Error("Failed to fetch answers");
        const data = await res.json();
        setAnswers(data);
      } catch (err) {
        setError("Error loading answers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">User Responses</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">User ID: {id}</h2>
        <ul>
          {answers.map((a, index) => (
            <li key={index} className="p-4 border rounded-md mb-2">
              <p className="font-semibold">{a.question}</p>
              <p className="text-gray-700">{a.answer}</p>
            </li>
          ))}
        </ul>

        {/* ✅ Back to Admin Button */}
        <button
          onClick={() => router.push("/admin")}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back to Admin Panel
        </button>
      </div>
    </div>
  );
}
