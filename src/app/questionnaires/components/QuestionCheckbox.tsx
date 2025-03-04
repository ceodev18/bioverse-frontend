interface Question {
    id: number;
    text: string;
    options?: string[];
  }
  
  interface QuestionCheckboxProps {
    question: Question;
    answers: { [key: number]: string | string[] };
    setAnswers: React.Dispatch<React.SetStateAction<{ [key: number]: string | string[] }>>;
  }
  
  export default function QuestionCheckbox({ question, answers, setAnswers }: QuestionCheckboxProps) {
    const handleSelectAll = (checked: boolean) => {
      setAnswers((prev) => ({
        ...prev,
        [question.id]: checked ? question.options || [] : [],
      }));
    };
  
    const handleCheckboxChange = (option: string, checked: boolean) => {
      setAnswers((prev) => {
        const selectedOptions = (prev[question.id] as string[]) || [];
        return {
          ...prev,
          [question.id]: checked
            ? [...selectedOptions, option]
            : selectedOptions.filter((o) => o !== option),
        };
      });
    };
  
    return (
      <div className="flex flex-col space-y-2">
        <label className="flex items-center space-x-2 font-semibold">
          <input
            type="checkbox"
            className="h-4 w-4"
            onChange={(e) => handleSelectAll(e.target.checked)}
            checked={(answers[question.id] as string[])?.length === question.options?.length}
          />
          <span>Select all that apply</span>
        </label>
        {question.options?.map((option) => (
          <label key={option} className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={(answers[question.id] as string[])?.includes(option) || false}
              onChange={(e) => handleCheckboxChange(option, e.target.checked)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    );
  }
  