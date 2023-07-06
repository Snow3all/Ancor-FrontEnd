import styled from "styled-components";

const BackGround = styled.div`
  background-color: #F2F2F2;
  height: 30px;
  padding: 2px;
  bottom: 0%;
  position: fixed;
  width: 100%;
`;

const Footer = () => {
  return(
    <>
      <BackGround className="text-center">Copyright 2023 Online Shop</BackGround>
    </>
  )
};

export default Footer;