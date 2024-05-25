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
import { useLoginMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

type Props = {
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
  refetch: any;
};

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email"),
  password: Yup.string()
    .min(6, "Password is too short")
    .required("Please enter your password"),
});

const Login: React.FC<Props> = ({setRoute , setOpen , refetch }) => {
  const [show, setShow] = React.useState(false);
  const [login , {isSuccess, error}] = useLoginMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      await login({email , password});
    },
  });

  useEffect(() => {
    if(isSuccess){
      toast.success("Logged in successfully");
      setOpen(false);
      refetch();
    }
    if (error) {
      if("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error])

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full">
      <h1 className={`${styles.title}`}>Login To 9rayti</h1>
      <form onSubmit={handleSubmit}>
        <div className="w-full mt-5">
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
            <span className="text-red-500 pt-2 block">{errors.email}</span>
          )}
        </div>
        <div className="w-full mt-5 relative mb-1">
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
            <span className="text-red-500 pt-2 block">{errors.password}</span>
          )}
        <div className="w-full mt-5">
          <input type="submit" value="Login" className={`${styles.button}`} />
        </div>
        <h5 className="text-center pt-4 font-Poppins text-[14px] text-[#0F172A] dark:text-white">or login with</h5>
        <div className="flex items-center justify-center my-3">
          <FcGoogle size={30} className="cursor-pointer" onClick={() => signIn("google")}/>
          <AiFillGithub size={30} className="cursor-pointer ml-5" onClick={() => signIn("github")}/>
        </div>
        <h5 className="text-center pt-4 font-Poppins text-[14px] pb-2">
          Not a member?{" "}
          <span className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setRoute("Sign-Up")}
          >
            Sign up
          </span>
        </h5>
      </form>
    </div>
  );
};

export default Login;
