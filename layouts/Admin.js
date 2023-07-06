import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";

const AuthLayout = ({ children }) => {
  const [admin, setAdmin] = useState(true);
  return (
    <>
      <Navbar
        isAdmin={admin}
      />
      {children}
      <Footer />
    </>
  );
};

export default AuthLayout;
