import React, { FC, useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { MdOutlineOndemandVideo } from "react-icons/md";

type Props = {
  data: any;
  activeVideo?: number;
  setActiveVideo?: any;
  isDemo?: boolean;
};

const CourseContentList: FC<Props> = (props) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set<string>()
  );

  // Find unique video sections
  const videoSections: string[] = Array.from(
    new Set<string>(props.data.map((item: any) => item.videoSection))
  );
  let totalCount: number = 0;

  const toggleSection = (section: string) => {
    const newVisibleSections = new Set(visibleSections);
    if (newVisibleSections.has(section)) {
      newVisibleSections.delete(section);
    } else {
      newVisibleSections.add(section);
    }
    setVisibleSections(newVisibleSections);
  };

  return (
    <div
      className={`mt-[15px] w-full ${
        !props.isDemo && " sticky top-24 left-0 z-30 md:m-auto md:w-[95%]"
      }`}
    >
      {videoSections.map((section: string, index: number) => {
        const isSectionVisible = visibleSections.has(section);
        // filter videos by section
        const sectionVideos: any[] = props.data.filter(
          (item: any) => item.videoSection === section
        );
        const sectionVideoCount: number = sectionVideos.length;
        const sectionVideoLength: number = sectionVideos.reduce(
          (totalLength: number, item: any) => totalLength + item.videoLength,
          0
        );

        const sectionSartIndex: number = totalCount;
        totalCount += sectionVideoLength;

        const sectionContentHours: number = sectionVideoLength / 60;

        return (
          <div
            className={`${!props.isDemo && "border-b dark:border-[#ffffff8e] border-[#0F172A] pb-2 mr-4"}`}
            key={section}
          >
            <div className="w-full flex">
              {/* Render video section */}
              <div className="w-full flex justify-between items-center">
                <h2 className="text-[22px] text-[#0F172A] dark:text-white">
                  {section}
                </h2>
                <button
                  className="mr-4 cursor-pointer text-[#0F172A] dark:text-white"
                  onClick={() => toggleSection(section)}
                >
                  {isSectionVisible ? (
                    <BsChevronUp size={20} />
                  ) : (
                    <BsChevronDown size={20} />
                  )}
                </button>
              </div>
            </div>
            <h5 className="text-[#0F172A] dark:text-white">
              {sectionVideoCount} Lessons -{" "}
              {sectionVideoLength < 60
                ? sectionVideoLength
                : sectionContentHours.toFixed(2)}{" "}
              {sectionVideoLength > 60 ? "Hours" : "Minutes"}
            </h5>
            <br />
            {isSectionVisible && (
              <div className="w-full">
                {sectionVideos.map((item: any, index: number) => {
                  const videoIndex: number = sectionSartIndex + index;
                  const contentLength: number = item.videoLength / 60;

                  return (
                    <div
                      className={`w-full ${
                        videoIndex === props.activeVideo ? "dark:bg-slate-800 bg-[#E0E3E8]" : ""
                      } cursor-pointer transition-all p-2`}
                      key={item._id}
                      onAbort={() =>
                        props.isDemo ? null : props?.setActiveVideo(videoIndex)
                      }
                    >
                      <div className="flex items-center">
                        <div>
                          <MdOutlineOndemandVideo
                            size={20}
                            className="mr-2"
                            color="#1cdada"
                          />
                        </div>
                        <h1 className="text-[18px] inline-block break-words text-[#0F172A] dark:text-white">
                          {item.title}
                        </h1>
                      </div>
                      <h5 className="pl-8 text-[#0F172A] dark:text-white">
                        {item.videoLength > 60
                          ? contentLength.toFixed(2)
                          : item.videoLength}{" "}
                        {item.videoLength > 60 ? "Hours" : "Minutes"}
                      </h5>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseContentList;
