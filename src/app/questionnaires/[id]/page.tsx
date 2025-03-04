"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getData, postData } from "@/services/api";
import { getCurrentUser } from "@/services/authService";
import QuestionForm from "../components/QuestionForm";

interface Question {
  id: number;
  text: string;
  type: "input" | "checkbox";
  options?: string[];
}

export default function QuestionnairePage() {
  const { id } = useParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string | string[] }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const user = getCurrentUser();
      if (!user) {
        alert("User not found. Please log in.");
        router.push("/login");
        return;
      }

      try {
        const fetchedQuestions = await getData<Question[]>(`questionnaires/${id}/questions`);
        setQuestions(fetchedQuestions);
      } catch (err) {
        console.error(err);
        setError("Error loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    const user = getCurrentUser();
    if (!user || !user.id) {
      alert("User not found. Please log in again.");
      router.push("/login");
      setSubmitting(false);
      return;
    }

    for (const question of questions) {
      const answer = answers[question.id];

      if (question.type === "input" && (!answer || (typeof answer === "string" && !answer.trim()))) {
        alert(`Please provide a valid answer for: "${question.text}"`);
        setSubmitting(false);
        return;
      }

      if (question.type === "checkbox" && (!answer || (Array.isArray(answer) && answer.length === 0))) {
        alert(`Please select at least one option for: "${question.text}"`);
        setSubmitting(false);
        return;
      }
    }

    try {
      await postData(`questionnaires/${id}/submit`, { userId: user.id, answers });
      router.push("/questionnaires");
    } catch (err) {
      console.error(err);
      setError("Error submitting answers. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Answer the Questionnaire</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <QuestionForm
        questions={questions}
        answers={answers}
        setAnswers={setAnswers}
        submitting={submitting}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
