import { styled } from "styled-components";
import Image from "next/image";
import { CiLogout } from "react-icons/ci";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsCart2, BsPerson } from "react-icons/bs";

const Nav = styled.div`
  position: relative;
  width: 100%;
  height: 64px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 3px 5px 0px;
`;

const NavBlack = styled.div`
  position: relative;
  width: 100%;
  height: 64px;
  background-color: #000;
`;

const Logo = styled.div`
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
`;

const Logout = styled.button`
  color: #fc541b;
  position: absolute;
  top: 50%;
  right: 0%;
  transform: translate(-50%, -50%);
`;

const ToolsList = styled.div`
  position: absolute;
  top: 50%;
  right: 0%;
  transform: translate(-50%, -50%);
`;

const NavBar = ({ isAdmin }) => {
  const router = useRouter();

  const [allowTools, setAllowTools] = useState();

  useEffect(() => {
    setAllowTools(sessionStorage.getItem('token'));
  }, [])

  const logout = () => {
    sessionStorage.clear();
    router.push("/");
  };

  return (
    <>
      {isAdmin && (
        <NavBlack>
          <Logo>
            <Image
              src={"/assets/LogoBlack.png"}
              alt={"logo"}
              width={123}
              height={40}
            />
          </Logo>
          <Logout onClick={logout}>
            <CiLogout size={30} />
          </Logout>
        </NavBlack>
      )}
      {!isAdmin && (
        <Nav>
          <Logo>
            <Image
              src={"/assets/Logo.png"}
              alt={"logo"}
              width={123}
              height={40}
            />
          </Logo>
          {
            allowTools &&
            <ToolsList className="flex">
              <button className="mr-2" onClick={() => router.push('/cart')}>
                <BsCart2 size={20}/>
              </button>
              <button>
                <BsPerson size={20}/>
              </button>
            </ToolsList>
          }
        </Nav>
      )}
    </>
  );
};

export default NavBar;
