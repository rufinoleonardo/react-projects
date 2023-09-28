import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth";

export default function Private({ children }) {
  const { signed, loading } = useContext(AuthContext);

  //console.log("Signed", signed);

  if (loading) {
    console.log("Loading", loading);
    return <div></div>;
  }

  if (!signed) {
    return <Navigate to="/" />;
  }
  return children;
}
