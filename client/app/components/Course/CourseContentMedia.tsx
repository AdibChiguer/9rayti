import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Ratings from "@/app/utils/Ratings";
import {
  useAddAnswerInQuestionMutation,
  useAddNewQuestionMutation,
  useAddReplyInReviewMutation,
  useAddReviewInCourseMutation,
  useGetCourseDetailsQuery,
} from "@/redux/features/courses/coursesApi";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineStar,
} from "react-icons/ai";
import { BiMessage } from "react-icons/bi";
import { VscVerifiedFilled } from "react-icons/vsc";
import { format } from "timeago.js";
import socketIO from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  data: any;
  id: string;
  activeVideo: number;
  setActiveVideo: (activeVideo: number) => void;
  user: any;
  refetch: any;
};

const CourseContentMedia = ({
  data,
  id,
  activeVideo,
  setActiveVideo,
  user,
  refetch,
}: Props) => {
  const [activeBar, setActiveBar] = useState(0);
  const [question, setQuestion] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [answer, setAnswer] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [
    addAnswerInQuestion,
    {
      isSuccess: answerSuccess,
      error: answerError,
      isLoading: answerCreationLoading,
    },
  ] = useAddAnswerInQuestionMutation({});
  const [
    addReviewInCourse,
    {
      isSuccess: reviewSuccess,
      error: reviewError,
      isLoading: reviewCreationLoading,
    },
  ] = useAddReviewInCourseMutation({});
  const [
    addNewQuestion,
    { isSuccess, error, isLoading: questionCreationLoading },
  ] = useAddNewQuestionMutation({});
  const { data: courseData, refetch: courseRefetch } = useGetCourseDetailsQuery(
    id,
    { refetchOnMountOrArgChange: true }
  );
  const course = courseData?.course;
  const [isReviewReply, setIsReviewReply] = useState(false);
  const [reply, setReply] = useState("");
  const [
    addReplyInReview,
    {
      isSuccess: replySuccess,
      error: replyError,
      isLoading: replyCreationLoading,
    },
  ] = useAddReplyInReviewMutation({});
  const [reviewId, setReviewId] = useState("");

  const isReviewExists = course?.reviews?.find(
    (item: any) => item._id === user._id
  );

  const handleQuestionSubmit = () => {
    if (question.length === 0) {
      toast.error("Question cannot be empty");
    } else {
      addNewQuestion({
        question,
        courseId: id,
        contentId: data[activeVideo]._id,
      });
    }
  };

  const handleAnswerSubmit = () => {
    addAnswerInQuestion({
      answer,
      courseId: id,
      contentId: data[activeVideo]._id,
      questionId: questionId,
    });
  };

  const handleReviewSubmit = async () => {
    if (review.length === 0) {
      toast.error("Review cannot be empty");
    } else {
      addReviewInCourse({ review, rating, courseId: id });
    }
  };

  const handleReviewReplySubmit = () => {
    if (reply === "") {
      toast.error("Reply cannot be empty");
    } else {
      addReplyInReview({ reviewId, comment: reply, courseId: id });
    }
  };

  useEffect(() => {
    // seccess part
    if (isSuccess) {
      toast.success("Question added successfully");
      refetch();
      setQuestion("");
      socketId.emit("notification", {
        title: "New Question Received",
        message: `You have a new question in ${data[activeVideo].title}`,
        userId: user._id,
      });
    }
    if (answerSuccess) {
      toast.success("Answer added successfully");
      refetch();
      setAnswer("");
      if (user.role !== "admin") {
        socketId.emit("notification", {
          title: "New Reply Received",
          message: `You have a new Reply in ${data[activeVideo].title}`,
          userId: user._id,
        });
      }
    }
    if (reviewSuccess) {
      toast.success("Review added successfully");
      courseRefetch();
      setReview("");
      setRating(0);
      socketId.emit("notification", {
        title: "New Review Received",
        message: `${user.name} has given a review in ${data[activeVideo].title}`,
        userId: user._id,
      });
    }
    if (replySuccess) {
      toast.success("Reply added successfully");
      courseRefetch();
      setReply("");
    }

    // error part
    if (error) {
      if ("data" in error) {
        const errorMessage = error.data as any;
        toast.error(errorMessage.data.message);
      }
    }
    if (answerError) {
      if ("data" in answerError) {
        const errorMessage = answerError as any;
        toast.error(errorMessage.data.message);
      }
    }
    if (reviewError) {
      if ("data" in reviewError) {
        const errorMessage = reviewError as any;
        toast.error(errorMessage.data.message);
      }
    }
    if (replyError) {
      if ("data" in replyError) {
        const errorMessage = replyError as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [
    isSuccess,
    error,
    answerSuccess,
    answerError,
    reviewSuccess,
    reviewError,
    replySuccess,
    replyError,
  ]);

  return (
    <div className="md:w-[95%] 800px:w-[86%] py-4 m-auto">
      <CoursePlayer
        title={data[activeVideo]?.title}
        videoUrl={data[activeVideo]?.videoUrl}
      />

      {/* Next and Previous buttons */}
      <div className="w-full flex items-center justify-between my-3">
        <div
          className={`${
            styles.button
          } text-[#edfff4] !w-[unset] !min-h-[40px] !py-[unset] ${
            activeVideo === 0 && "!cursor-no-drop opacity-[.8]"
          }`}
          onClick={() =>
            setActiveVideo(activeVideo === 0 ? activeVideo : activeVideo - 1)
          }
        >
          <AiOutlineArrowLeft className="mr-2" />
          Prev Lesson
        </div>

        <div
          className={`${
            styles.button
          }  text-[#edfff4] !w-[unset] !min-h-[40px] !py-[unset] ${
            data.length - 1 === activeVideo && "!cursor-no-drop opacity-[.8]"
          }`}
          onClick={() =>
            setActiveVideo(
              data && data.length - 1 === activeVideo
                ? activeVideo
                : activeVideo + 1
            )
          }
        >
          <AiOutlineArrowRight className="mr-2" />
          Next Lesson
        </div>
      </div>

      <h1 className="pt-2 text-[25px] font-[600] dark:text-[#edfff4] text-[#0F172A]">
        {data[activeVideo].title}
      </h1>
      <br />

      {/* Overview and Resources and Q&A and Reviews navigation bar  */}
      <div className="w-full p-4 flex items-center justify-between bg-slate-500 bg-opacity-20 backdrop-blur shadow-[bg-slate-700] rounded shadow-inner">
        {["Overview", "Resources", "Q&A", "Reviews"].map((text, index) => (
          <h5
            key={index}
            className={`800px:text-[20px] cursor-pointer ${
              activeBar === index
                ? "text-red-500"
                : "dark:text-[#edfff4] text-[#0F172A]"
            } `}
            onClick={() => setActiveBar(index)}
          >
            {text}
          </h5>
        ))}
      </div>

      <br />

      {/* Overview and Resources and Q&A and Reviews logique code  */}
      {activeBar === 0 && (
        <p className="break-words text-[18px] whitespace-pre-line mb-3 dark:text-[#edfff4] text-[#0F172A] mx-4">
          {data[activeVideo]?.description}
        </p>
      )}
      {activeBar === 1 && (
        <div>
          {data[activeVideo]?.links.map((item: any, index: number) => (
            <div className="mb-5 mx-4" key={index}>
              <h2 className="break-words text-[18px] md:text-[20px] dark:text-[#edfff4] text-[#0F172A] mb-4">
                {item.title && item.title + " :"}
              </h2>
              <a
                href={item.url}
                className="break-words text-[#4395c4] text-[18px] md:text-[20px] inline-block w-full"
              >
                {item.url}
              </a>
            </div>
          ))}
        </div>
      )}
      {activeBar === 2 && (
        <>
          <div className="mx-4">
            <div className="flex w-full">
              <Image
                src={
                  user.avatar
                    ? user.avatar
                    : require("../../../public/assets/avatar.jpg")
                }
                width={50}
                height={50}
                alt="avatar"
                className="w-[50px] h-[50px] object-cover rounded-full"
              />
              <textarea
                name=""
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                cols={40}
                rows={5}
                placeholder="Write your question here"
                className="outline-none bg-transparent ml-3 border border-[#ffffff57] 800px:w-full p-2 rounded w-[90%] 800px:text-[18px] font-Poppins"
              ></textarea>
            </div>
            <div className="w-full flex justify-end">
              <div
                className={`${
                  styles.button
                } !w-[120px] !h-[40px] text-[18px] mt-5 ${
                  questionCreationLoading && "cursor-no-drop"
                }`}
                onClick={
                  questionCreationLoading ? () => {} : handleQuestionSubmit
                }
              >
                Submit
              </div>
            </div>
            <br />
            <hr className="mb-3 dark:text-[#edfff4] text-[#0F172A]" />

            <div>
              <CommentReply
                data={data}
                activeVideo={activeVideo}
                answer={answer}
                setAnswer={setAnswer}
                handleAnswerSubmit={handleAnswerSubmit}
                user={user}
                questionId={questionId}
                setQuestionId={setQuestionId}
                answerCreationLoading={answerCreationLoading}
              />
            </div>
          </div>
        </>
      )}
      {activeBar === 3 && (
        <div className="w-full">
          <>
            {!isReviewExists && (
              <>
                <div className="flex w-full">
                  <Image
                    src={
                      user.avatar
                        ? user.avatar
                        : require("../../../public/assets/avatar.jpg")
                    }
                    width={50}
                    height={50}
                    alt="avatar"
                    className="w-[50px] h-[50px] object-cover rounded-full"
                  />
                  <div className="w-full">
                    <h5 className="pl-3 text-[20px] font-[500] dark:text-[#edfff4] text-[#0F172A]">
                      Give a Rating <span className="text-red-500">*</span>
                    </h5>
                    <div className="flex w-full ml-2 pb-3">
                      {[1, 2, 3, 4, 5].map((i, index) =>
                        rating >= i ? (
                          <AiFillStar
                            key={index}
                            className="mr-1 cursor-pointer"
                            color="rgb(246,186,0)"
                            size={25}
                            onClick={() => setRating(i)}
                          />
                        ) : (
                          <AiOutlineStar
                            key={index}
                            className="mr-1 cursor-pointer"
                            color="rgb(246,186,0)"
                            size={25}
                            onClick={() => setRating(i)}
                          />
                        )
                      )}
                    </div>
                    <textarea
                      name=""
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      cols={40}
                      rows={5}
                      placeholder="Write your review here"
                      className="outline-none bg-transparent 800px:ml-3 border border-[#ffffff57] 800px:w-full p-2 rounded w-[95%] text-[18px] font-Poppins"
                    ></textarea>
                  </div>
                </div>
                <div className="w-full flex justify-end">
                  <div
                    className={`${
                      styles.button
                    } !w-[120px] !h-[40px] text-[18px] mt-5 800px:mr-0 mr-2 ${
                      reviewCreationLoading && "cursor-no-drop"
                    }`}
                    onClick={
                      reviewCreationLoading ? () => {} : handleReviewSubmit
                    }
                  >
                    Submit
                  </div>
                </div>
              </>
            )}
            <br />
            <hr className="mb-3 dark:text-[#edfff4] text-[#0F172A]" />

            <div className="w-full">
              {(course?.reviews && [...course?.reviews].reverse()).map(
                (item: any, index: number) => (
                  <div
                    className="w-full my-5 dark:text-[#edfff4] text-[#0F172A]"
                    key={index}
                  >
                    <div className="w-full flex">
                      <div>
                        <Image
                          src={
                            item?.user.avatar
                              ? item?.user.avatar
                              : require("../../../public/assets/avatar.jpg")
                          }
                          width={50}
                          height={50}
                          alt="avatar"
                          className="w-[50px] h-[50px] object-cover rounded-full"
                        />
                      </div>
                      <div className="ml-2">
                        <h1 className="text-[18px]">{item?.user.name}</h1>
                        <Ratings rating={item.rating} />
                        <p>{item.comment}</p>
                        <small className="dark:text-[#edfff4] text-[#0F172A]">
                          {format(item.createdAt)}
                        </small>
                      </div>
                    </div>
                    {user.role === "admin" &&
                      item.commentReplies.length === 0 && (
                        <span
                          className={`${styles.label} !ml-10 cursor-pointer`}
                          onClick={() => {
                            setIsReviewReply(true);
                            setReviewId(item._id);
                          }}
                        >
                          Add Reply{" "}
                          <BiMessage size={20} className="cursor-pointer" />
                        </span>
                      )
                    }
                    {isReviewReply && reviewId === item._id && (
                      <div className="w-full flex relative">
                        <input
                          type="text"
                          placeholder="Enter your reply...."
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          className="block 800px:ml-12 mt-2 outline-none bg-transparent border-b dark:border-[#fff] border-[#0F172A] p-[5px] w-[95%] dark:text-[#edfff4] text-[#0F172A]"
                        />
                        <button
                          type="submit"
                          className="absolute right-0 bottom-0"
                          onClick={
                            replyCreationLoading
                              ? () => {}
                              : handleReviewReplySubmit
                          }
                          disabled={reply === "" || replyCreationLoading}
                        >
                          Submit
                        </button>
                      </div>
                    )}
                    {item.commentReplies.map((i: any, index: number) => (
                      <div
                        className="w-full flex 800px:ml-16 my-5 dark:text-[#edfff4] text-[#0F172A]"
                        key={index}
                      >
                        <div>
                          <Image
                            src={
                              i?.user.avatar
                                ? i?.user.avatar
                                : require("../../../public/assets/avatar.jpg")
                            }
                            width={50}
                            height={50}
                            alt="avatar"
                            className="w-[50px] h-[50px] object-cover rounded-full"
                          />
                        </div>
                        <div className="pl-3">
                          <div className="flex items-center">
                            <h5 className="text-[20px]">{i?.user.name}</h5>
                            {i.user.role === "admin" && (
                              <VscVerifiedFilled className="text-[#0095f6] ml-2 text-[20px]" />
                            )}
                          </div>
                          <p>{i.comment}</p>
                          <small className="dark:text-[#edfff4] text-[#0F172A]">
                            {format(i?.createdAt)}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </>
        </div>
      )}
    </div>
  );
};

const CommentReply = ({
  data,
  activeVideo,
  answer,
  setAnswer,
  handleAnswerSubmit,
  setQuestionId,
  answerCreationLoading,
  questionId,
}: any) => {
  return (
    <>
      <div className="w-full my-3">
        {data[activeVideo]?.questions.map((item: any, index: number) => (
          <CommentItem
            key={index}
            data={data}
            activeVideo={activeVideo}
            item={item}
            index={index}
            answer={answer}
            setAnswer={setAnswer}
            questionId={questionId}
            setQuestionId={setQuestionId}
            handleAnswerSubmit={handleAnswerSubmit}
            answerCreationLoading={answerCreationLoading}
          />
        ))}
      </div>
    </>
  );
};

const CommentItem = ({
  item,
  answer,
  setAnswer,
  handleAnswerSubmit,
  setQuestionId,
  answerCreationLoading,
  questionId,
}: any) => {
  const [replyActive, setReplyActive] = useState(false);

  return (
    <>
      <div className="my-4">
        <div className="flex mb-2">
          <div>
            <Image
              src={
                item?.user.avatar
                  ? item?.user.avatar
                  : require("../../../public/assets/avatar.jpg")
              }
              width={50}
              height={50}
              alt="avatar"
              className="w-[50px] h-[50px] object-cover rounded-full"
            />
          </div>
          <div className="pl-3 dark:text-[#edfff4] text-[#0F172A]">
            <h5 className="text-[20px]">{item?.user.name}</h5>
            <p>{item?.question}</p>
            <small className="dark:text-[#edfff4] text-[#0F172A]">
              {!item.createdAt ? "" : format(item?.createdAt)}
            </small>
          </div>
        </div>

        <div className="w-full flex items-center">
          <span
            className="800px:pl-16 dark:text-[#edfff4] text-[#0F172A] cursor-pointer mr-2"
            onClick={() => {
              setReplyActive(!replyActive);
              setQuestionId(item._id);
            }}
          >
            {!replyActive
              ? item.questionReplies?.length !== 0
                ? "All Replies"
                : "Add Reply"
              : "Hide Replies"}
          </span>
          <div className="flex items-center justify-between">
            <BiMessage
              size={20}
              className="dark:text-[#edfff4] text-[#0F172A] cursor-pointeur"
            />
            <span className="pl-1 mt-[-4px] cursor-pointer dark:text-[#edfff4] text-[#0F172A]">
              {item.questionReplies?.length}
            </span>
          </div>
        </div>

        {replyActive && questionId === item._id && (
          <>
            {item.questionReplies.map((item: any, index: number) => (
              <div
                className="w-full flex 800px:ml-16 my-5 dark:text-[#edfff4] text-[#0F172A]"
                key={index}
              >
                <div>
                  <Image
                    src={
                      item?.user.avatar
                        ? item?.user.avatar
                        : require("../../../public/assets/avatar.jpg")
                    }
                    width={50}
                    height={50}
                    alt="avatar"
                    className="w-[50px] h-[50px] object-cover rounded-full"
                  />
                </div>
                <div className="pl-3">
                  <div className="flex items-center">
                    <h5 className="text-[20px]">{item?.user.name}</h5>
                    {item.user.role === "admin" && (
                      <VscVerifiedFilled className="text-[#0095f6] ml-2 text-[20px]" />
                    )}
                  </div>
                  <p>{item.answer}</p>
                  <small className="dark:text-[#edfff4] text-[#0F172A]">
                    {format(item?.createdAt)}
                  </small>
                </div>
              </div>
            ))}
            <>
              <div className="w-full flex relative dark:text-[#edfff4] text-[#0F172A]">
                <input
                  type="text"
                  placeholder="Enter your answer...."
                  value={answer}
                  onChange={(e: any) => setAnswer(e.target.value)}
                  className={`block 800px:ml-12 mt-2 outline-none bg-transparent border-b dark:border-[#fff] border-[#0F172A] p-[5px] w-[95%] dark:text-[#edfff4] text-[#0F172A] ${
                    answer === "" ||
                    (answerCreationLoading && "cursor-not-allowed")
                  }`}
                />
                <button
                  type="submit"
                  className="absolute right-0 bottom-0"
                  onClick={handleAnswerSubmit}
                  disabled={answer === "" || answerCreationLoading}
                >
                  Submit
                </button>
              </div>
              <br />
            </>
          </>
        )}
      </div>
    </>
  );
};

export default CourseContentMedia;
