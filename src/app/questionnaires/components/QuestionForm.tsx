import QuestionInput from "./QuestionInput";
import QuestionCheckbox from "./QuestionCheckbox";

interface Question {
  id: number;
  text: string;
  type: "input" | "checkbox";
  options?: string[];
}

interface QuestionFormProps {
  questions: Question[];
  answers: { [key: number]: string | string[] };
  setAnswers: React.Dispatch<React.SetStateAction<{ [key: number]: string | string[] }>>;
  submitting: boolean;
  handleSubmit: () => void;
}

export default function QuestionForm({ questions, answers, setAnswers, submitting, handleSubmit }: QuestionFormProps) {
  return (
    <form className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
      {questions.map((q) => (
        <div key={q.id} className="mb-4">
          <label className="block font-semibold">{q.text}</label>
          {q.type === "input" ? (
            <QuestionInput questionId={q.id} setAnswers={setAnswers} />
          ) : (
            <QuestionCheckbox question={q} answers={answers} setAnswers={setAnswers} />
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={handleSubmit}
        className={`${
          submitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        } text-white px-4 py-2 rounded w-full mt-4 flex items-center justify-center`}
        disabled={submitting}
      >
        {submitting ? (
          <>
            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            Submitting...
          </>
        ) : (
          "Submit Answers"
        )}
      </button>
    </form>
  );
}
