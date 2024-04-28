"use client";
import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiFillGithub,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { styles } from "../../styles/style";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

type Props = {
  setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
  name: Yup.string().required("Please enter your name"),
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email"),
  password: Yup.string()
    .min(6, "Password is too short")
    .required("Please enter your password"),
});

const SignUp: React.FC<Props> = ({ setRoute }) => {
  const [show, setShow] = React.useState(false);
  const [register, {data, isSuccess, error}] = useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "User registered successfully";
      toast.success(message);
      setRoute("Verification");
    }
    if (error) {
      if("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error])

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: async ({name, email, password }) => {
      const data = {
        name, email, password
      };
      await register(data);
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full">
      <h1 className={`${styles.title}`}>Sign Up To 9rayti</h1>
      <form onSubmit={handleSubmit}>
        <div className="w-full mt-4">
          <label htmlFor="name" className={`${styles.label}`}>
            Enter your Name
          </label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            id="name"
            placeholder="John Doe"
            className={`${errors.name && touched.name && "border-red-500"} ${
              styles.input
            }`}
          />
          {errors.name && touched.name && (
            <span className="text-red-500 pt-1 block">{errors.name}</span>
          )}
        </div>
        <div className="w-full mt-4">
          <label htmlFor="email" className={`${styles.label}`}>
            Enter your Email
          </label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            id="email"
            placeholder="example@gmail.com"
            className={`${errors.email && touched.email && "border-red-500"} ${
              styles.input
            }`}
          />
          {errors.email && touched.email && (
            <span className="text-red-500 pt-1 block">{errors.email}</span>
          )}
        </div>
        <div className="w-full mt-4 relative mb-1">
          <label htmlFor="password" className={`${styles.label}`}>
            Enter your Password
          </label>
          <input
            type={show ? "text" : "password"}
            name="password"
            value={values.password}
            onChange={handleChange}
            id="password"
            placeholder="$*w3rD@ss"
            className={`${
              errors.password && touched.password && "border-red-500"
            } ${styles.input}`}
          />
          {!show ? (
            <AiOutlineEye
              onClick={() => setShow(true)}
              size={20}
              className="absolute right-2 bottom-3 z-1 cursor-pointer"
            />
          ) : (
            <AiOutlineEyeInvisible
              onClick={() => setShow(false)}
              size={20}
              className="absolute right-2 bottom-3 z-1 cursor-pointer"
            />
          )}
        </div>
        {errors.password && touched.password && (
          <span className="text-red-500 pt-1 block">{errors.password}</span>
        )}
        <div className="w-full mt-4">
          <input type="submit" value="Sign Up" className={`${styles.button}`} />
        </div>
        <h5 className="text-center pt-3 font-Poppins text-[14px] text-[#0F172A] dark:text-white">
          or signup with
        </h5>
        <div className="flex items-center justify-center my-2">
          <FcGoogle size={30} className="cursor-pointer" />
          <AiFillGithub size={30} className="cursor-pointer ml-5" />
        </div>
        <h5 className="text-center pt-3 font-Poppins text-[14px] pb-2">
          Already have an account?{" "}
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setRoute("Login")}
          >
            Sign in
          </span>
        </h5>
      </form>
    </div>
  );
};

export default SignUp;
