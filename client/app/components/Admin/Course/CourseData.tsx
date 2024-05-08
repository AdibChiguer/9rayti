import toast from "react-hot-toast";
import { styles } from "../../../styles/style";
import React, { FC } from "react";
import AddCircleIcon from '@mui/icons-material/AddCircle';

type Props = {
  benefits: { title: string }[];
  setBenefits: (benefits: { title: string }[]) => void;
  prerequisites: { title: string }[];
  setPrerequisites: (prerequisites: { title: string }[]) => void;
  active: number;
  setActive: (active: number) => void;
};

const CourseData: FC<Props> = ({
  benefits,
  setBenefits,
  prerequisites,
  setPrerequisites,
  active,
  setActive,
}) => {

  const handleBenefitChange = (index: number, value: any) => {
    const updatedBenefits = [...benefits];
    updatedBenefits[index].title = value;
    setBenefits(updatedBenefits);
  };

  const handleAddBenefit = () => {
    setBenefits([...benefits, { title: "" }]);
  }

  const handelPrerequisitesChange = (index: number, value: any) => {
    const updatePrerequisites = [...prerequisites];
    updatePrerequisites[index].title = value;
    setPrerequisites(updatePrerequisites);
  };

  const handleAddPrerequisites = () => {
    setPrerequisites([...prerequisites, { title: "" }]);
  }

  const prevButton = () => {
    setActive(active - 1);
  }

  const handleOptions = () => {
    if(benefits[benefits.length - 1]?.title !== "" && prerequisites[prerequisites.length - 1]?.title !== "") {
      setActive(active + 1);
    } else {
      toast.error("Please fill all the fields!");
    }
  }

  return (
    <div className="w-[80%] m-auto mt-24 block">
      <div className="mb-4">
        <label className={`${styles.label} text-[20px] mb-2`}>
          What are the benefits of this course?
        </label>
        {benefits.map((benefit, index) => (
          <input
            type="text"
            key={index}
            name="benefit"
            placeholder="You will learn ..."
            required
            className={`${styles.input} w-[80%]`}
            value={benefit.title}
            onChange={(e) => {
              handleBenefitChange(index, e.target.value);
            }}
          />
        ))}
        <AddCircleIcon
          style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
          onClick={handleAddBenefit}
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
            onChange={(e) => {
              handelPrerequisitesChange(index, e.target.value);
            }}
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
          onClick={() => prevButton()}
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

export default CourseData;
