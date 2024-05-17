import React, { FC } from "react";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import toast from "react-hot-toast";
import { styles } from "../../../styles/style";

type Props = {
  benifits: { title: string }[];
  setBenifits: (benifits: { title: string }[]) => void;
  prerequisites: { title: string }[];
  setPrerequisites: (prerequisites: { title: string }[]) => void;
  active: number;
  setActive: (active: number) => void;
};

const CourseData: FC<Props> = ({
  benifits,
  setBenifits,
  prerequisites,
  setPrerequisites,
  active,
  setActive,
}) => {

  const handleBenifitChange = (index: number, value: string) => {
    const updatedBenifits = benifits.map((benifit, i) => 
      i === index ? { ...benifit, title: value } : benifit
    );
    setBenifits(updatedBenifits);
  };

  const handleAddBenifit = () => {
    setBenifits([...benifits, { title: "" }]);
  };

  const handlePrerequisitesChange = (index: number, value: string) => {
    const updatedPrerequisites = prerequisites.map((prerequisite, i) => 
      i === index ? { ...prerequisite, title: value } : prerequisite
    );
    setPrerequisites(updatedPrerequisites);
  };

  const handleAddPrerequisites = () => {
    setPrerequisites([...prerequisites, { title: "" }]);
  };

  const prevButton = () => {
    setActive(active - 1);
  };

  const handleOptions = () => {
    if (benifits[benifits.length - 1]?.title !== "" && prerequisites[prerequisites.length - 1]?.title !== "") {
      setActive(active + 1);
    } else {
      toast.error("Please fill all the fields!");
    }
  };

  return (
    <div className="w-[80%] m-auto mt-24 block">
      <div className="mb-4">
        <label className={`${styles.label} text-[20px] mb-2`}>
          What are the benifits of this course?
        </label>
        {benifits?.map((benifit, index) => (
          <input
            type="text"
            key={index}
            name="benifit"
            placeholder="You will learn ..."
            required
            className={`${styles.input} w-[80%]`}
            value={benifit.title}
            onChange={(e) => handleBenifitChange(index, e.target.value)}
          />
        ))}
        <AddCircleIcon
          style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
          onClick={handleAddBenifit}
        />
      </div>

      <div className="mb-4">
        <label className={`${styles.label} text-[20px] mb-2`}>
          What are the prerequisites of this course?
        </label>
        {prerequisites.map((prerequisite, index) => (
          <input
            type="text"
            key={index}
            name="prerequisite"
            placeholder="You need basic knowledge of ..."
            required
            className={`${styles.input} w-[80%]`}
            value={prerequisite.title}
            onChange={(e) => handlePrerequisitesChange(index, e.target.value)}
          />
        ))}
        <AddCircleIcon
          style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
          onClick={handleAddPrerequisites}
        />
      </div>

      <div className="w-full flex items-center justify-between mb-4">
        <div 
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={prevButton}
        >
          Prev
        </div>

        <div 
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={handleOptions}
        >
          Next
        </div>
      </div>
    </div>
  );
};

export default CourseData;
