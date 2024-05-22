import { styles } from "@/app/styles/style";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { HiMinus, HiPlus } from "react-icons/hi";
import { IoMdAddCircleOutline } from "react-icons/io";
import Loader from "../../Loader/Loader";

type Props = {};

const EditFaq = (props: Props) => {
  const { data, isLoading } = useGetHeroDataQuery("FAQ", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout, { isSuccess, error }] = useEditLayoutMutation();
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setQuestions(data.layout.faq);
    }
    if(isSuccess) {
      toast.success("FAQ updated successfully")
    }
    if(error) {
      if("data" in error) {
        const errorData = error as any
        toast.error(errorData?.data?.message)
      }
    }
  }, [data, isSuccess, error]);

  const toggleQuestion = (id: any) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question._id === id
          ? { ...question, active: !question.active }
          : question
      )
    );
  };

  const handleQuestionChange = (value: string, id: any) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question._id === id ? { ...question, question: value } : question
      )
    );
  };

  const handleAnswerChange = (value: string, id: any) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question._id === id ? { ...question, answer: value } : question
      )
    );
  };

  const newFaqHandler = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        answer: "",
      },
    ]);
  };

  // function to check if the faq array has been changed
  const areQuestionsUnchnaged = (
    originalQuestions: any[],
    newQuestions: any[]
  ) => {
    return JSON.stringify(originalQuestions) === JSON.stringify(newQuestions);
  };

  const isAnyQuestionEmpty = (questions: any[]) => {
    return questions.some(
      (question) => question.question === "" || question.answer === ""
    );
  };

  const handleEdit = async () => {
    if (
      !areQuestionsUnchnaged(data.layout.faq, questions) &&
      !isAnyQuestionEmpty(questions)
    ) {
      await editLayout({ type: "FAQ", faq: questions });
    }
  };

  return (
    <>
      {
        isLoading ? (
          <Loader />
        ) : (
          <div className="w-[90%] 800px:w-[80%] m-auto mt-[120px]">
            <div className="mt-12">
              <dl className="space-y-8 mb-3">
                {questions.map((q: any) => (
                  <div
                    key={q._id}
                    className={`${
                      q._id !== questions[0]?._id && "border-t"
                    } border-gray-200 pt-6`}
                  >
                    <dt className="text-lg">
                      <button
                        className="flex items-start dark:text-white text-[#0F172A] justify-between w-full text-left focus:outline-none"
                        onClick={() => toggleQuestion(q._id)}
                      >
                        <input
                          className={`${styles.input} border-none`}
                          value={q.question}
                          onChange={(e) =>
                            handleQuestionChange(e.target.value, q._id)
                          }
                          placeholder="Add your question here..."
                        />
                        <span className="ml-6 flex-shrink-0">
                          {q.active ? (
                            <HiMinus className="h-6 w-6" />
                          ) : (
                            <HiPlus className="h-6 w-6" />
                          )}
                        </span>
                      </button>
                    </dt>
                    {q.active && (
                      <dd className="mt-2 pr-12">
                        <input
                          className={`${styles.input} border-none`}
                          value={q.answer}
                          onChange={(e) => handleAnswerChange(e.target.value, q._id)}
                          placeholder="Add your answer here..."
                        />
                        <span className="ml-6 flex-shrink-0">
                          <AiOutlineDelete
                            className="dark:text-white text-[#0F172A] text-[18px] cursor-pointer"
                            onClick={() => {
                              setQuestions((prev) =>
                                prev.filter((question) => question._id !== q._id)
                              );
                            }}
                          />
                        </span>
                      </dd>
                    )}
                  </div>
                ))}
              </dl>
              <IoMdAddCircleOutline
                className="dark:text-white text-[#0F172A] text-[25px] cursor-pointer"
                onClick={newFaqHandler}
              />
            </div>

            <div
              className={`${
                styles.button
              } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-[#0F172A] bg-[#cccccc34] ${
                areQuestionsUnchnaged(data.layout.faq, questions) ||
                isAnyQuestionEmpty(questions)
                  ? "cursor-not-allowed"
                  : "cursor-pointer !bg-[#42d383]"
              } !rounded absolute bottom-12 right-12`}
              onClick={
                areQuestionsUnchnaged(data.layout.faq, questions) ||
                isAnyQuestionEmpty(questions)
                  ? () => null
                  : handleEdit
              }
            >
              Save
            </div>
          </div>
        )
      }
    </>
  );
};

export default EditFaq;
