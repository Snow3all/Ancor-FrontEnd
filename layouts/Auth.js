import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AuthLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default AuthLayout;
