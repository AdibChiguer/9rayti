import { styles } from "../../../../app/styles/style";
import React, { FC, useState } from "react";

type Props = {
  courseInfo: any;
  setCourseInfo: (courseInfo: any) => void;
  active: number;
  setActive: (active: number) => void;
};

const CourseInformation: FC<Props> = ({
  courseInfo,
  setCourseInfo,
  active,
  setActive,
}) => {
  const [dragging, setDragging] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setActive(active + 1);
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setCourseInfo({ ...courseInfo, thumbnail: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setCourseInfo({ ...courseInfo, thumbnail: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-[80%] m-auto mt-24">
      <form onSubmit={handleSubmit} className={`${styles.label}`}>
        <div className="mb-5">
          <label className={`${styles.label}`}>Course Name</label>
          <input
            type="text"
            name=""
            required
            value={courseInfo.name}
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, name: e.target.value })
            }
            className={`${styles.input}`}
            id="name"
            placeholder="Enter course name"
          />
        </div>

        <div className="mb-5">
          <label className={`${styles.label}`}>Course Description</label>
          <textarea
            name=""
            id=""
            cols={30}
            rows={8}
            placeholder="write some description"
            className={`${styles.input} !h-min !py-2`}
            value={courseInfo.description}
            onChange={(e: any) => {
              setCourseInfo({ ...courseInfo, description: e.target.value });
            }}
          ></textarea>
        </div>

        <div className="w-full flex justify-between mb-5">
          <div className="w-[45%]">
            <label className={`${styles.label}`}>Course Price</label>
            <input
              type="number"
              name=""
              required
              value={courseInfo.price}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, price: parseFloat(e.target.value) })
              }
              className={`${styles.input}`}
              id="price"
              placeholder="29"
            />
          </div>
          <div className="w-[50%]">
            <label className={`${styles.label} w-[50%]`}>
              Estimated Price (optional)
            </label>
            <input
              type="number"
              name=""
              value={courseInfo.estimatedPrice}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, estimatedPrice: parseFloat(e.target.value) })
              }
              className={`${styles.input}`}
              id="estimatedPrice"
              placeholder="79"
            />
          </div>
        </div>

        <div className="mb-5">
          <label className={`${styles.label}`}>Course Tags</label>
          <input
            type="text"
            name=""
            required
            value={courseInfo.tags}
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, tags: e.target.value })
            }
            className={`${styles.input}`}
            id="tags"
            placeholder="Next 13 , React , Redux"
          />
        </div>

        <div className="w-full flex justify-between mb-5">
          <div className="w-[45%]">
            <label className={`${styles.label}`}>Course Level</label>
            <input
              type="text"
              name=""
              required
              value={courseInfo.level}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, level: e.target.value })
              }
              className={`${styles.input}`}
              id="level"
              placeholder="Beginner/Intermediate/Advanced"
            />
          </div>

          <div className="w-[50%]">
            <label className={`${styles.label} w-[50%]`}>Demo Url</label>
            <input
              type="text"
              name=""
              value={courseInfo.demoUrl}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, demoUrl: e.target.value })
              }
              className={`${styles.input}`}
              id="demoUrl"
              placeholder="https://www.9rayti.com/..."
            />
          </div>
        </div>

        <div className="w-full mb-3">
          <input
            type="file"
            accept="image/*"
            id="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file"
            className={`w-full min-h-[10vh] dark:border-white border-[#00000026] p-3 border flex items-center justify-center ${
              dragging ? "bg-blue-500" : "bg-transparent"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {courseInfo.thumbnail ? (
              <img
                src={courseInfo.thumbnail}
                alt="thumbnail"
                className="max-h-full w-full object-cover"
              />
            ) : (
              <span className="text-[#111c43] dark:text-white ">
                Drag and drop or click to upload thumbnail
              </span>
            )}
          </label>
        </div>
        
        <div className="w-full flex items-center justify-end mb-5">
          <input 
            type="submit" 
            value="Next"
            className="w-full 800px:w-[180px] h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-4 cursor-pointer"
          />
        </div>
      </form>
    </div>
  );
};

export default CourseInformation;