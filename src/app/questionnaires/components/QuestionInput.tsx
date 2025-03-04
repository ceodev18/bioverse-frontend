interface QuestionInputProps {
    questionId: number;
    setAnswers: React.Dispatch<React.SetStateAction<{ [key: number]: string | string[] }>>;
  }
  
  export default function QuestionInput({ questionId, setAnswers }: QuestionInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: e.target.value.trimStart(),
      }));
    };
  
    return <input type="text" className="border p-2 w-full rounded" onChange={handleChange} />;
  }
  