import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { useTheme } from "next-themes";
import { FiEdit2 } from "react-icons/fi";
import { useDeleteCourseMutation, useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import Loader from "../../Loader/Loader";
import { format } from 'timeago.js'
import { styles } from "@/app/styles/style";
import toast from "react-hot-toast";
import Link from "next/link";

type Props = {};

const AllCourses = (props: Props) => {
  const { theme, setTheme } = useTheme();
  const [open , setOpen] = useState(false);
  const [courseId , setCourseId] = useState("");
  const {isLoading , data , refetch} = useGetAllCoursesQuery({}, {refetchOnMountOrArgChange: true});
  const [deleteCourse, {isSuccess, error: deleteError}] = useDeleteCourseMutation();

  useEffect(() => {
    if (isSuccess) {
      setOpen(false); 
      refetch();
      toast.success("Course deleted successfully");
    }
    if (deleteError) {
      if ("data" in deleteError) {
        const errorMessage = deleteError as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, deleteError]);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "title", headerName: "Course Title", flex: 1 },
    { field: "ratings", headerName: "Ratings", flex: 0.5 },
    { field: "purchased", headerName: "Purchased", flex: 0.5 },
    { field: "created_at", headerName: "Created At", flex: 0.5 },
    {
      field: "  ",
      headerName: "Edit",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <>
            <Link href={`/admin/edit-course/${params.row.id}`}>
              <Button>
                <FiEdit2
                  size={20}
                  className="dark:text-white text-[#0F172A]"
                />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: " ",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <>
            <Button
              onClick={() => {
                setCourseId(params.row.id);
                setOpen(!open);
              }}
            >
              <AiOutlineDelete
                size={20}
                className="dark:text-white text-[#0F172A]"
              />
            </Button>
          </>
        );
      },
    },
  ];

  const rows:any = [];

  {
    data && data.courses.forEach((item:any) => {
      rows.push({
        id: item._id,
        title: item.name,
        ratings: item.ratings,
        purchased: item.purchased,
        created_at: format(item.createdAt),
      });
    });
  }

  const handleDelete = async () => {
    await deleteCourse(courseId);
  }

  return (
    <div className="mt-[120px]">
        {
          isLoading ? (
            <Loader />
          ) : (
            <Box m="20px">
              <Box
                m="40px 0 0 0"
                height="80vh"
                sx={{
                  "& .MuiDataGrid-root": {
                    border: "none",
                    outline: "none",
                    background: "#2190FF !important",
                    // backgroundColor: theme === "dark" ? "#1f2a40" : "#f2f0f0",
                  },
                  "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                    color: theme === "dark" ? "#fff" : "#000",
                  },
                  "& .MuiDataGrid-sortIcon": {
                    color: theme === "dark" ? "#fff" : "#000",
                  },
                  "& .MuiDataGrid-row": {
                    color: theme === "dark" ? "#fff" : "#000",
                    borderBottom:
                      theme === "dark"
                        ? "1px solid #ffffff30!important"
                        : "1px solid #ccc!important",
                  },
                  "& .MuiTablePagination-root": {
                    color: theme === "dark" ? "#fff" : "#000",
                  },
                  "& .MuiDataGrid-cell": {
                    borderBottom: "none",
                  },
                  "& .name-colums--cell": {
                    color: theme === "dark" ? "#fff" : "#000",
                  },
                  "& .MuiDataGrid-columnHeaders ": {
                    backgroundColor: theme === "dark" ? "#3e4396 !important" : "#a4a9fc !important",
                    borderBottom: "none",
                    color: theme === "dark" ? "#fff" : "#000",
                  },
                  "& .css-n3fyjk-MuiDataGrid-root": {
                    "--DataGrid-containerBackground": theme === "dark" ? "#3e4396 !important" : "#a4a9fc !important",
                  },
                  "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: theme === "dark" ? "#1f2a40" : "#f2f0f0",
                    color: theme === "dark" ? "#fff" : "#000",
                  },
                  "& .MuiDataGrid-footerContainer": {
                    color: theme === "dark" ? "#fff" : "#000",
                    borderTop: "none",
                    backgroundColor: theme === "dark" ? "#3e4396" : "#a4a9fc",
                  },
                  "& .MuiCheckbox-root": {
                    color:
                      theme === "dark" ? "#b7ebde !important" : "#000 !important",
                  },
                  "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                    color: "#fff !important",
                  },
                  "& .css-1w53k9d-MuiDataGrid-overlay": {
                    backgroundColor: theme === "dark" ? "#1f2a40" : "#f2f0f0",
                  },
                  ".css-1e6y48t-MuiButtonBase-root-MuiButton-root": {
                    justifyContent: "flex-start",
                  }
                }}
              >
                <DataGrid rows={rows} columns={columns} checkboxSelection />
              </Box>
              {
                open && (
                  <Modal
                    open={open}
                    onClose={() => setOpen(!open)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-10 rounded-md dark:bg-[#0F172A]"
                    >
                      <h1 className={`${styles.title}`}>
                        Are you sure you want to delete this course?
                      </h1>
                      <div className="w-full flex gap-4">
                        <Button
                          onClick={() => setOpen(!open)}
                          className={`${styles.button} !w-[100px] !h-[35px] !bg-[#57c7a3]`}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleDelete}
                          className={`${styles.button} !w-[100px] !h-[35px] !bg-[#f44336]`}
                        >
                          Delete
                        </Button>
                      </div>
                    </Box>
                  </Modal>
                )
              }
            </Box>
          )
        }
    </div>
  );
};

export default AllCourses;
