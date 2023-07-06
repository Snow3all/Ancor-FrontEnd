import { useEffect, useState } from "react";
import AuthLayout from "../layouts/Auth";
import styled from "styled-components";
import { axiosFetchAPI } from "../lib/axios";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/router";

const WrapperBox = styled.div`
  padding: 10px;

  @media (min-width: 768px) {
    width: 500px;
    margin: 0 auto;
  }
`;

const Input = styled.input`
  border: 1px solid #d9d9d9;
  width: 100%;
  padding: 2px 5px;
`;

const LoginBtn = styled.button`
  background-color: #fc541b;
  color: #fff;
  width: 100%;
  padding: 5px 5px;
`;

const Home = () => {
  const router = useRouter();

  const [username, setUsername] = useState();

  const [password, setPassword] = useState();

  const [remember, setRemember] = useState(false);

  useEffect(() => {
    const cookieUsername = getCookie("username");
    const cookiePassword = getCookie("password");
    const cookieTerm = getCookie("term");
    setUsername(cookieUsername ? cookieUsername : "");
    setPassword(cookiePassword ? cookiePassword : "");
    setRemember(Number(cookieTerm) === 1 ? true : false);
  }, []);

  useEffect(() => {
    if (remember && username && password) {
      setCookie("username", `${username}`);
      setCookie("password", `${password}`);
      setCookie("term", 1);
    } else {
      deleteCookie("username");
      deleteCookie("password");
      deleteCookie("term");
    }
  }, [remember, username, password]);

  const login = async () => {
    const request = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/login`,
      data: {
        username: username,
        password: password,
      },
    };
    const resAPI = await axiosFetchAPI(request);
    const { status } = resAPI;
    if (status === 0) {
      sessionStorage.setItem("token", resAPI.token);
      sessionStorage.setItem("username", resAPI.username);
      sessionStorage.setItem("role", resAPI.role);
      if(resAPI.role.includes('ADMIN')) {
        router.push("/management");
      } else if(resAPI.role.includes('MEMBER')) {
        router.push("/store");
      }
    }
  };

  return (
    <WrapperBox>
      <h1 className='font-bold text-xl'>Login</h1>
      <div className='mt-5'>
        <label>Username</label>
        <div>
          <Input
            type='text'
            onChange={(e) => setUsername(e.target.value)}
            placeholder={username ? username : "Fill Username"}
          />
        </div>
      </div>
      <div className='mt-3'>
        <label>Password</label>
        <div>
          <Input
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            placeholder={password ? "············" : "Fill Password"}
          />
        </div>
      </div>
      <div className='mt-3 flex'>
        <div className='mr-2'>
          <input
            type='checkbox'
            onChange={() => setRemember(!remember)}
            checked={remember}
          />
        </div>
        <div>Remember me</div>
      </div>
      <div className='mt-3'>
        <LoginBtn onClick={login}>Log In</LoginBtn>
      </div>
      <div className='mt-3 flex'>
        <div className='mr-2'>
          Don't have an account? <a href={"/register"}>Sign Up</a>
        </div>
      </div>
    </WrapperBox>
  );
};

Home.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Home;
