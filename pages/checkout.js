import DefaultLayout from "../layouts/Default";
import styled from "styled-components";
import { useRouter } from "next/router";
import { BsCheck2Circle } from "react-icons/bs";

const WrapperCheckout = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
`;

const ModalCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -70%);
`;

const Green = styled.div`
  color: #6ec28a;
`;

const Button = styled.div`
  background-color: #fc541b;
  color: #fff;
  text-align: center;
  padding: 5px 10px;
`;

const CheckOut = () => {
  const router = useRouter();

  return (
    <WrapperCheckout>
      <ModalCenter>
        <Green className='flex justify-center'>
          <BsCheck2Circle size={150} />
        </Green>
        <h3 className='text-center whitespace-nowrap font-bold'>
          Thank you for your purchase
        </h3>
        <p className='text-center whitespace-nowrap my-3'>
          your order number is 123451231
        </p>
        <div>
          <Button onClick={() => router.push('/store')}>Continue shopping</Button>
        </div>
      </ModalCenter>
    </WrapperCheckout>
  );
};

CheckOut.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

export default CheckOut;
