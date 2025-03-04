"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getData } from "@/services/api";
import { getCurrentUser } from "@/services/authService";

interface Questionnaire {
  id: number;
  title: string;
  description?: string;
  completed?: boolean;
}

export default function QuestionnairesPage() {
  const router = useRouter();
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = getCurrentUser();
        if (!user) {
          alert("User not found. Please log in.");
          router.push("/login");
          return;
        }

        const qList = await getData<Questionnaire[]>("questionnaires");

        const completedPromises = qList.map((q) =>
          getData<{ completed: boolean }>(`questionnaires/${q.id}/user/${user.id}/completed`)
            .then((res) => ({ ...q, completed: res.completed }))
            .catch(() => ({ ...q, completed: false }))
        );

        const updatedQuestionnaires = await Promise.all(completedPromises);
        setQuestionnaires(updatedQuestionnaires);
      } catch {
        setError("Error loading questionnaires.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleQuestionnaireClick = (q: Questionnaire) => {
    if (q.completed) {
      alert("You have already completed this questionnaire.");
      return;
    }
    router.push(`/questionnaires/${q.id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Select a Questionnaire</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="w-full max-w-2xl">
        {questionnaires.map((q) => (
          <div
            key={q.id}
            className={`bg-white p-4 rounded-lg shadow-md mb-4 cursor-pointer ${
              q.completed ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
            }`}
            onClick={() => handleQuestionnaireClick(q)}
          >
            <h2 className="text-xl font-semibold">{q.title}</h2>
            {q.description && <p className="text-gray-600">{q.description}</p>}
            {q.completed && <p className="text-red-500 text-sm">Completed</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
