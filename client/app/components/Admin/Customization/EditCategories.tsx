import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";

type Props = {};

const EditCategories = (props: Props) => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout, { isSuccess, error }] = useEditLayoutMutation();
  const [categories, setCategories] = useState<any[]>([]);
  const [originalCategories, setOriginalCategories] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setCategories(data.layout.categories);
      setOriginalCategories(data.layout.categories);
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Categories updated successfully");
    }
  }, [isSuccess, refetch]);

  useEffect(() => {
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData?.data?.message);
      }
    }
  }, [error]);

  const handleCategoriesAdd = (id: any, value: string) => {
    setCategories((prevCategory: any) =>
      prevCategory.map((i: any) => (i._id === id ? { ...i, title: value } : i))
    );
  };

  const newCategoriesHandler = () => {
    if (categories[categories.length - 1]?.title === "") {
      return toast.error("Category title cannot be empty");
    } else {
      setCategories((prevCategory: any) => [
        ...prevCategory,
        { _id: Date.now().toString(), title: "" },
      ]);
    }
  };

  const areCategoriesUnchanged = (
    oldCategories: any[],
    newCategories: any[]
  ) => {
    return JSON.stringify(oldCategories.map(c => ({ title: c.title }))) === JSON.stringify(newCategories.map(c => ({ title: c.title })));
  };

  const isAnyCategoryTitleEmpty = (categories: any[]) => {
    return categories.some((category) => category.title === "");
  };

  const editCategoriesHandler = async () => {
    if (
      !areCategoriesUnchanged(originalCategories, categories) &&
      !isAnyCategoryTitleEmpty(categories)
    ) {
      await editLayout({ type: "Categories", categories });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-[120px] text-center">
          <h1 className={`${styles.title}`}>All Categories</h1>
          {categories &&
            categories.map((category, index) => {
              return (
                <div className="p-3" key={category._id}>
                  <div className="flex items-center w-full justify-center">
                    <input
                      className={`${styles.input} !w-[unset] !border-none !text-[20px]`}
                      value={category.title}
                      onChange={(e) =>
                        handleCategoriesAdd(category._id, e.target.value)
                      }
                      placeholder="Category Title..."
                    />
                    <AiOutlineDelete
                      className="dark:text-white text-[18px] text-[#0F172A] cursor-pointer"
                      onClick={() => {
                        setCategories((prevCategory: any) =>
                          prevCategory.filter(
                            (i: any) => i._id !== category._id
                          )
                        );
                      }}
                    />
                  </div>
                </div>
              );
            })}
          <div className="w-full flex justify-center mt-4">
            <IoMdAddCircleOutline
              className="dark:text-white text-[25px] text-[#0F172A] cursor-pointer"
              onClick={newCategoriesHandler}
            />
          </div>

          <div
            className={`${
              styles.button
            } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-[#0F172A] bg-[#cccccc34] ${
              areCategoriesUnchanged(originalCategories, categories) ||
              isAnyCategoryTitleEmpty(categories)
                ? "cursor-not-allowed"
                : "cursor-pointer !bg-[#42d383]"
            } !rounded absolute bottom-12 right-12`}
            onClick={
              areCategoriesUnchanged(originalCategories, categories) ||
              isAnyCategoryTitleEmpty(categories)
                ? () => null
                : editCategoriesHandler
            }
          >
            Save
          </div>
        </div>
      )}
    </>
  );
};

export default EditCategories;
