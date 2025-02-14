"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getData, postData } from "@/services/api";
import { getCurrentUser } from "@/services/authService";

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
        // Check if user already answered
        const completed = await getData<boolean>(`questionnaires/${id}/user/${user.id}/completed`);
        if (completed) {
          alert("You have already completed this questionnaire.");
          router.push("/questionnaires"); // Redirect if already completed
          return;
        }

        // Load questions
        const fetchedQuestions = await getData<Question[]>(`questionnaires/${id}/questions`);
        setQuestions(fetchedQuestions);
      } catch (err) {
        console.error(err); // Log the error
        setError("Error loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]); // Add 'router' to the dependency array

  const handleInputChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value.trimStart() })); // Remove leading whitespace
  };

  const handleCheckboxChange = (questionId: number, option: string, checked: boolean) => {
    setAnswers((prev) => {
      const selectedOptions = (prev[questionId] as string[]) || [];
      return {
        ...prev,
        [questionId]: checked
          ? [...selectedOptions, option]
          : selectedOptions.filter((o) => o !== option),
      };
    });
  };

  const handleSubmit = async () => {
    const user = getCurrentUser(); // Get user from localStorage or context

    if (!user || !user.id) {
      alert("User not found. Please log in again.");
      router.push("/login");
      return;
    }

    // ✅ Input Validation
    for (const question of questions) {
      const answer = answers[question.id];

      if (question.type === "input") {
        if (!answer || (typeof answer === "string" && !answer.trim())) {
          alert(`Please provide a valid answer for: "${question.text}"`);
          return;
        }
      }

      if (question.type === "checkbox") {
        if (!answer || (Array.isArray(answer) && answer.length === 0)) {
          alert(`Please select at least one option for: "${question.text}"`);
          return;
        }
      }
    }

    try {
      await postData(`questionnaires/${id}/submit`, {
        userId: user.id, // Ensure we send the user ID
        answers,
      });
      router.push("/questionnaires");
    } catch (err) {
      console.error(err); // Log the error
      setError("Error submitting answers. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Answer the Questionnaire</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <form className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        {questions.map((q) => (
          <div key={q.id} className="mb-4">
            <label className="block font-semibold">{q.text}</label>
            {q.type === "input" ? (
              <input
                type="text"
                className="border p-2 w-full rounded"
                onChange={(e) => handleInputChange(q.id, e.target.value)}
              />
            ) : (
              <div className="flex flex-col space-y-2">
                {q.options?.map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      value={option}
                      onChange={(e) => handleCheckboxChange(q.id, option, e.target.checked)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full mt-4"
        >
          Submit Answers
        </button>
      </form>
    </div>
  );
}
