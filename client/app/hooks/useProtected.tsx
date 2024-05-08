import { redirect } from "next/navigation";
import userAuth from "./userAuth";

interface ProtectedProps {
  children: React.ReactNode;
}

export default function Protected({children}: ProtectedProps) {
  const isAuthenticated = userAuth();

  isAuthenticated ? console.log("children") : console.log("/");

  return isAuthenticated ? children : redirect("/");
}