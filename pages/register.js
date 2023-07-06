import { useState } from "react";
import AuthLayout from "../layouts/Auth";
import styled from "styled-components";
import { axiosFetchAPI } from "../lib/axios";
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

const SignupBtn = styled.button`
  color: #fc541b;
`;

const Register = () => {
  const router = useRouter();

  const [username, setUsername] = useState();

  const [password, setPassword] = useState();

  const [checkTerm, setCheckTerm] = useState(false);

  const register = async() => {
    const request = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/register`,
      data: {
        username: username,
        password: password,
      },
    };
    const resAPI = await axiosFetchAPI(request);
    const { status } = resAPI;
    if (status === 0) {
      router.push('/');
    }
  };

  return (
    <WrapperBox>
      <h1 className='font-bold text-xl'>Sign Up</h1>
      <div className='mt-5'>
        <label>Username</label>
        <div>
          <Input type='text' onChange={(e) => setUsername(e.target.value)} />
        </div>
      </div>
      <div className='mt-3'>
        <label>Password</label>
        <div>
          <Input
            type='password'
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div className='mt-3 flex'>
        <div className='mr-2'>
          <input type='checkbox' onChange={() => setCheckTerm(!checkTerm)} />
        </div>
        <div>
          I agree to <a href={'/'}>Term of Use</a> and <a href={'/'}>Privacy Policy</a>.
        </div>
      </div>
      <div className='mt-3'>
        <LoginBtn onClick={register} disabled={!checkTerm}>Sign Up</LoginBtn>
      </div>
      <div className='mt-3 flex'>
        <div className='mr-2'>Already have an account ? <a href={'/'}>Log In</a></div>
      </div>
    </WrapperBox>
  );
};

Register.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Register;
