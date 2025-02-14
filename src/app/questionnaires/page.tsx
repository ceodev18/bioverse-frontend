"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getData } from "@/services/api";

interface Questionnaire {
  id: number;
  title: string;
  description?: string;
}

export default function QuestionnairesPage() {
  const router = useRouter();
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getData<Questionnaire[]>("questionnaires")
      .then(setQuestionnaires)
      .catch(() => setError("Error loading questionnaires"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Select a Questionnaire</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="w-full max-w-2xl">
        {questionnaires.map((q) => (
          <div
            key={q.id}
            className="bg-white p-4 rounded-lg shadow-md mb-4 cursor-pointer hover:bg-gray-200"
            onClick={() => router.push(`/questionnaires/${q.id}`)}
          >
            <h2 className="text-xl font-semibold">{q.title}</h2>
            {q.description && <p className="text-gray-600">{q.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
