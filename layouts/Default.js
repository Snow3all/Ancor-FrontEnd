import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styled from 'styled-components';

const Blank = styled.div`
  height: 50px;
`;

const DefaultLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      {/* <Blank></Blank> */}
      <Footer className='mt-5'/>
    </>
  );
};

export default DefaultLayout;
