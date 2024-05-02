import React, { FC, useEffect, useState } from "react";
import { styles } from "@/app/styles/style";
import { useUpdatePasswordMutation } from "@/redux/features/user/userApi";
import toast from "react-hot-toast";

type Props = {};

const ChangePassword: FC<Props> = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();

  const passwordChangeHandler = async (e:any) => {
    e.preventDefault();
    if (oldPassword === "" || newPassword === "" || confirmPassword === "") {
      toast.error("Please fill all the fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Password does not match");
      return;
    }
    await updatePassword({ oldPassword, newPassword });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Password updated successfully");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error]);

  return (
    <div className="w-full pl-7 px-2 800px:px-5 800px:pl-0">
      <h1 className="block text-[25px] 800px:text-[30px] font-Poppins text-center font-[500] text-[#0F172A] dark:text-[#fff] pb-2">
        Change Password
      </h1>
      <div className="w-full">
        <form
          onSubmit={passwordChangeHandler}
          className="flex flex-col items-center"
        >
          <div className="w-[100%] 800px:w-[60%] mt-5">
            <label className="block pb-2 text-[#0F172A] dark:text-[#fff]">
              Enter your old password
            </label>
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              required
              onChange={(e) => setOldPassword(e.target.value)}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0 text-[#0F172A] dark:text-[#fff]`}
            />
          </div>
          <div className="w-[100%] 800px:w-[60%] mt-2">
            <label className="block pb-2 text-[#0F172A] dark:text-[#fff]">
              Enter your new password
            </label>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              required
              onChange={(e) => setNewPassword(e.target.value)}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0 text-[#0F172A] dark:text-[#fff]`}
            />
          </div>
          <div className="w-[100%] 800px:w-[60%] mt-2">
            <label className="block pb-2 text-[#0F172A] dark:text-[#fff]">
              Enter your confirm password
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0 text-[#0F172A] dark:text-[#fff]`}
            />
            <input
              className="w-[95%] h-[40px] border border-[#37a39a] text-center dark:text-[#fff] rounded-[3px] mt-8 cursor-pointer"
              required
              value="Update Password"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
