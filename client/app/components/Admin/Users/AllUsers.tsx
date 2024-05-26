import React, { FC, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, gridClasses, Modal } from "@mui/material";
import { AiOutlineDelete, AiOutlineMail } from "react-icons/ai";
import { useTheme } from "next-themes";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { useDeleteUserMutation, useGetAllUsersQuery, useUpdateUserRoleMutation } from "@/redux/features/user/userApi";
import { styles } from "@/app/styles/style";
import toast from "react-hot-toast";

type Props = {
  isTeam?: boolean;
};

const AllUsers: FC<Props> = ({ isTeam }) => {
  const { theme, setTheme } = useTheme();
  const [active , setActive] = useState(false)
  const [email , setEmail] = useState('');
  const [role , setRole] = useState('admin');
  const [open , setOpen] = useState(false);
  const [userId , setUserId] = useState('');
  const [updateUserRole , {error: updateError , isSuccess}] = useUpdateUserRoleMutation({});
  const {isLoading , data , refetch} = useGetAllUsersQuery({}, { refetchOnMountOrArgChange: true });
  const [deleteUser , {isSuccess: deleteSuccess, error: deleteError }] = useDeleteUserMutation({});

  useEffect(() => {
    if (updateError) {
      if ("data" in updateError) {
        const errorMessage = updateError as any;
        toast.error(errorMessage.data.message);
      }
    }
    if (isSuccess) {
      refetch();
      toast.success("User role updated successfully");
      setActive(false);
    }
    if (deleteSuccess) {
      refetch();
      toast.success("User deleted successfully");
      setOpen(false);
    }
    if (deleteError) {
      if ("data" in deleteError) {
        const errorMessage = deleteError as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [ updateError, isSuccess, deleteSuccess, deleteError]);


  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Name", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 0.5 },
    { field: "role", headerName: "Role", flex: 0.3 },
    { field: "courses", headerName: "N. Courses", flex: 0.4 },
    { field: "created_at", headerName: "Joined At", flex: 0.5 },
    {
      field: " ",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <>
            <Button
              onClick={() => {
                setUserId(params.row.id);
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
    {
      field: "  ",
      headerName: "Email",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <>
            <a href={`mailto:${params.row.email}`}>
              <Button>
                <AiOutlineMail
                  size={20}
                  className="dark:text-white text-[#0F172A]"
                />
              </Button>
            </a>
          </>
        );
      },
    },
  ];

  const rows: any = [];

  if (isTeam) {
    const newData =
      data && data.users.filter((item: any) => item.role === "admin");
    newData &&
      newData.forEach((item: any) => {
        rows.push({
          id: item._id,
          name: item.name,
          email: item.email,
          role: item.role,
          courses: item.courses.length,
          created_at: format(item.createdAt),
        });
      });
  } else {
    data &&
      data.users.forEach((item: any) => {
        rows.push({
          id: item._id,
          name: item.name,
          email: item.email,
          role: item.role,
          courses: item.courses.length,
          created_at: format(item.createdAt),
        });
      });
  }

  const handleSubmit = async () => {
    await updateUserRole({email , role});
  }

  const handleDelete = async () => {
    await deleteUser(userId);
  }

  return (
    <div className="mt-[120px]">
      {isLoading ? (
        <Loader />
      ) : (
        <Box m="20px">
          {
            isTeam && (
              <div className="w-full flex justify-start">
                <Button 
                  className={`${styles.button} !bg-[#2190ff] !w-[200px] !h-[35px] cursor-pointer !text-white`}
                  onClick={() => setActive(!active)}
                >
                  Add New Member
                </Button>
              </div>
            )
          }

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
                // textAlign: "center",
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
            active && (
              <Modal
                open={active}
                onClose={() => setActive(!active)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-10 rounded-md dark:bg-[#0F172A] z-50"
                >
                  <h1 className={`${styles.title}`}>
                    Add New Member
                  </h1>
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      className={`${styles.input}`}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <select
                      className={`${styles.input} text-[#0F172A]`}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="admin" className="text-[#0F172A]">Admin</option>
                      <option value="user" className="text-[#0F172A]">User</option>
                    </select>
                    <Button
                      onClick={handleSubmit}
                      className={`${styles.button} !bg-[#2190ff] !w-[150px] !h-[35px] cursor-pointer !text-white !mt-4`}
                    >
                      Add
                    </Button>
                  </div>
                </Box>
              </Modal>
            )
          }
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
                    Are you sure you want to delete this user?
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
      )}
    </div>
  );
};

export default AllUsers;
