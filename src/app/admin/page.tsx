"use client";

import { useEffect, useState } from "react";
import { getData } from "@/services/api";

interface UserAnswer {
  id: string;
  username: string;
  questionnaireid?: number;
  questionnairetitle?: string;
}

interface AnswerDetail {
  question: string;
  answer: string;
  questionnaire: string;
}

export default function AdminPanel() {
  const [users, setUsers] = useState<UserAnswer[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserAnswer | null>(null);
  const [answers, setAnswers] = useState<AnswerDetail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData<UserAnswer[]>("questionnaires/users-with-answers").then((data) => {
      setUsers(data);
    });
  }, []);

  const loadAnswers = async (user: UserAnswer) => {
    setSelectedUser(user);
    setLoading(true);
    const data = await getData<AnswerDetail[]>(`questionnaires/user/${user.id}/questionnaire/${user.questionnaireid}/answers`);
    setAnswers(data);
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Username</th>
            <th className="border p-2">Questionnaire ID</th>
            <th className="border p-2">Completed Questionnaire</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center p-4 text-gray-500">
                No users have completed questionnaires yet.
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr
                key={index}
                className="border cursor-pointer hover:bg-gray-200"
                onClick={() => loadAnswers(user)}
              >
                <td className="p-2 text-center">{user.username ? user.username : <span>&mdash;</span>}</td>
                <td className="p-2 text-center">
                  {user.questionnaireid !== undefined ? user.questionnaireid : <span>&mdash;</span>}
                </td>
                <td className="p-2 text-center">{user.questionnairetitle || <span>&mdash;</span>}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">
              Answers from {selectedUser.username} - {selectedUser.questionnairetitle || "N/A"}
            </h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ul>
                {Object.entries(
                  answers.reduce((acc: Record<string, string[]>, a) => {
                    if (!acc[a.question]) acc[a.question] = [];
                    acc[a.question].push(a.answer);
                    return acc;
                  }, {} as Record<string, string[]>)
                ).map(([question, answerList], idx) => (
                  <li key={idx} className="mb-2">
                    <strong>Q: {question}</strong>
                    <p className="ml-4">A: {answerList.join(", ")}</p>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setSelectedUser(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
