import { styles } from "@/app/styles/style";
import React, { FC, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { BsLink45Deg, BsPencil } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

type Props = {
  courseContentData: any;
  setCourseContentData: (courseContentData: any) => void;
  active: number;
  setActive: (active: number) => void;
  handleSubmit: any;
};

const CourseContent: FC<Props> = ({
  courseContentData,
  setCourseContentData,
  active,
  setActive,
  handleSubmit: handleCourseSubmit,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(
    Array(courseContentData.length).fill(false)
  );
  const [activeSection, setActiveSection] = useState(1);

  const handleCollapseToggle = (index: number) => {
    const updatedCollapsed = [...isCollapsed];
    updatedCollapsed[index] = !updatedCollapsed[index];
    setIsCollapsed(updatedCollapsed);
  };

  const handleRemoveLink = (index: number, linkIndex: number) => {
    const updatedData = courseContentData.map((item: any, i: number) => {
      if (i === index) {
        return {
          ...item,
          links: item.links.filter((_: any, li: number) => li !== linkIndex)
        };
      }
      return item;
    });
    setCourseContentData(updatedData);
  };

  const handleAddLink = (index: number) => {
    const updatedData = courseContentData.map((item: any, i: number) => {
      if (i === index) {
        return {
          ...item,
          links: [...item.links, { title: "", url: "" }]
        };
      }
      return item;
    });
    setCourseContentData(updatedData);
  };

  const newContentHandler = (item: any) => {
    if (
      item.title === "" ||
      item.videoUrl === "" ||
      item.description === "" ||
      item.links[0].title === "" ||
      item.links[0].url === ""
    ) {
      toast.error("Please fill all the field first!");
    } else {
      let newVideoSection = "";
      if (courseContentData.length > 0) {
        const lastVideoSection =
          courseContentData[courseContentData.length - 1].videoSection;

        // use the last video section if available, else use user input
        if (lastVideoSection) {
          newVideoSection = lastVideoSection;
        }
      }
      const newContent = {
        videoUrl: "",
        title: "",
        description: "",
        videoSection: newVideoSection,
        links: [
          {
            title: "",
            url: "",
          },
        ],
      };

      setCourseContentData([...courseContentData, newContent]);
    }
  };

  const addNewSection = () => {
    const lastContent = courseContentData[courseContentData.length - 1];
    if (
      lastContent.title === "" ||
      lastContent.videoUrl === "" ||
      lastContent.description === "" ||
      lastContent.links[0].title === "" ||
      lastContent.links[0].url === ""
    ) {
      toast.error("Please fill all the field first!");
    } else {
      setActiveSection(activeSection + 1);
      const newContent = {
        videoUrl: "",
        title: "",
        description: "",
        videoSection: `Untitled Section ${activeSection}`,
        links: [
          {
            title: "",
            url: "",
          },
        ],
      };
      setCourseContentData([...courseContentData, newContent]);
    }
  };

  const preButton = () => {
    setActive(active - 1);
  };

  const handleOptions = () => {
    const lastContent = courseContentData[courseContentData.length - 1];
    if (
      lastContent.title === "" ||
      lastContent.videoUrl === "" ||
      lastContent.description === "" ||
      lastContent.links[0].title === "" ||
      lastContent.links[0].url === ""
    ) {
      toast.error("Section can't be empty!");
    } else {
      handleCourseSubmit();
      setActive(active + 1);
    }
  };

  const handleChange = (index: number, key: string, value: string) => {
    const updatedData = courseContentData.map((item: any, i: number) => {
      if (i === index) {
        return { ...item, [key]: value };
      }
      return item;
    });
    setCourseContentData(updatedData);
  };

  const handleLinkChange = (index: number, linkIndex: number, key: string, value: string) => {
    const updatedData = courseContentData.map((item: any, i: number) => {
      if (i === index) {
        const updatedLinks = item.links.map((link: any, li: number) => {
          if (li === linkIndex) {
            return { ...link, [key]: value };
          }
          return link;
        });
        return { ...item, links: updatedLinks };
      }
      return item;
    });
    setCourseContentData(updatedData);
  };

  return (
    <div className="w-[80%] m-auto mt-24 p-3">
      <form onSubmit={(e) => e.preventDefault()}>
        {courseContentData?.map((courseContent: any, courseContentIndex: number) => {
          const showSectionInput =
            courseContentIndex === 0 ||
            courseContent.videoSection !== courseContentData[courseContentIndex - 1].videoSection;

          return (
            <div
              key={courseContentIndex}
              className={`w-full dark:bg-[#202f53d6] bg-[#fafcfea0] shadow-xl p-6 rounded-[10px] ${
                showSectionInput ? "mt-10" : "mt-0"
              }`}
            >
              {showSectionInput && (
                <div className="flex w-full items-center mb-8">
                  <input
                    type="text"
                    className={`text-[20px] ${
                      courseContent.videoSection === "Untitled Section"
                        ? "w-[170px]"
                        : "w-min"
                    } font-Poppins dark:text-white text-[#0F172A] cursor-pointer bg-transparent outline-none`}
                    value={courseContent.videoSection}
                    onChange={(e) =>
                      handleChange(courseContentIndex, "videoSection", e.target.value)
                    }
                  />
                  <BsPencil className="cursor-pointer dark:text-white text-[#0F172A]" />
                </div>
              )}

              <div className="flex w-full items-center justify-between my-3">
                {isCollapsed[courseContentIndex] ? (
                  <p className="font-Poppins dark:text-white text-[#0F172A]">
                    {courseContentIndex + 1}. {courseContent.title}
                  </p>
                ) : (
                  <div></div>
                )}

                <div className="flex items-center">
                  <AiOutlineDelete
                    className={`dark:text-white text-[20px] mr-2 text-[#0F172A] ${
                      courseContentIndex > 0 ? "cursor-pointer" : "cursor-no-drop"
                    }`}
                    onClick={() => {
                      if (courseContentIndex > 0) {
                        const updatedData = courseContentData.filter(
                          (_: any, i: number) => i !== courseContentIndex
                        );
                        setCourseContentData(updatedData);
                      }
                    }}
                  />
                  <MdOutlineKeyboardArrowDown
                    fontSize="large"
                    className="cursor-pointer dark:text-white text-[#0F172A]"
                    style={{
                      transform: isCollapsed[courseContentIndex]
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                    onClick={() => handleCollapseToggle(courseContentIndex)}
                  />
                </div>
              </div>

              {!isCollapsed[courseContentIndex] && (
                <>
                  <div className="my-3">
                    <label className={styles.label}>Video Title</label>
                    <input
                      type="text"
                      placeholder="Enter video title"
                      className={styles.input}
                      value={courseContent.title}
                      onChange={(e) =>
                        handleChange(courseContentIndex, "title", e.target.value)
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className={styles.label}>Video Url</label>
                    <input
                      type="text"
                      placeholder="Enter video url"
                      className={styles.input}
                      value={courseContent.videoUrl}
                      onChange={(e) =>
                        handleChange(courseContentIndex, "videoUrl", e.target.value)
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className={styles.label}>Video Length (in minutes)</label>
                    <input
                      type="text"
                      placeholder="Enter video length"
                      className={styles.input}
                      value={courseContent.videoLength}
                      onChange={(e) => {
                        const updatedData = [...courseContentData];
                        updatedData[courseContentIndex].videoLength = e.target.value;
                        setCourseContentData(updatedData);
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className={styles.label}>Video Description</label>
                    <textarea
                      rows={8}
                      cols={30}
                      placeholder="Enter video description"
                      className={`${styles.input} !h-min py-2`}
                      value={courseContent.description}
                      onChange={(e) =>
                        handleChange(courseContentIndex, "description", e.target.value)
                      }
                    />
                  </div>

                  {courseContent.links.map((link: any, linkIndex: number) => (
                    <div className="mb-3 block" key={linkIndex}>
                      <div className="w-full flex item-center justify-between">
                        <label className={styles.label}>
                          Link {linkIndex + 1}
                        </label>
                        <AiOutlineDelete
                          className={`${
                            linkIndex === 0 ? "cursor-no-drop" : "cursor-pointer"
                          } dark:text-white text-[20px] text-[#0F172A]`}
                          onClick={() => {
                            if (linkIndex !== 0) {
                              handleRemoveLink(courseContentIndex, linkIndex);
                            }
                          }}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Source Code... (Link title)"
                        className={styles.input}
                        value={link.title}
                        onChange={(e) =>
                          handleLinkChange(courseContentIndex, linkIndex, "title", e.target.value)
                        }
                      />
                      <input
                        type="url"
                        placeholder="Source Code Url... (Link url)"
                        className={`${styles.input} mt-6`}
                        value={link.url}
                        onChange={(e) =>
                          handleLinkChange(courseContentIndex, linkIndex, "url", e.target.value)
                        }
                      />
                    </div>
                  ))}

                  <div className="inline-block mb-4 mt-1">
                    <p
                      className="flex items-center text-[18px] dark:text-white text-[#0F172A] cursor-pointer"
                      onClick={() => handleAddLink(courseContentIndex)}
                    >
                      <BsLink45Deg className="mr-2" /> Add Link
                    </p>
                  </div>
                </>
              )}

              {courseContentIndex === courseContentData.length - 1 && (
                <div>
                  <p
                    className="flex items-center text-[18px] dark:text-white text-[#0F172A] cursor-pointer"
                    onClick={() => newContentHandler(courseContent)}
                  >
                    <AiOutlinePlusCircle className="mr-2" /> Add New Content
                  </p>
                </div>
              )}
            </div>
          );
        })}
        <div
          className="flex items-center justify-center text-[20px] dark:text-white text-[#0F172A] cursor-pointer mt-4"
          onClick={() => addNewSection()}
        >
          <AiOutlinePlusCircle className="mr-2" /> Add New Section
        </div>
      </form>
      <div className="w-full flex items-center justify-between mt-2 mb-4">
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => preButton()}
        >
          Prev
        </div>
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => handleOptions()}
        >
          Next
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
