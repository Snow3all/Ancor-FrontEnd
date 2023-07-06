import DefaultLayout from "../layouts/Default";
import Image from "next/image";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { axiosFetchAPI } from "../lib/axios";
import { useRouter } from "next/router";
import { BsChevronCompactRight } from "react-icons/bs";
import Link from "next/link";
import { BsCartX } from "react-icons/bs";

const Container = styled.div`
  margin-bottom: 50px;
  height: 130vh;
`;
const Wrapper = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 50px 0;

  @media (max-width: 768px) {
    width: 90%;
    padding: 20px 0;
  }
`;

const BreadcrumbText = styled.div`
  line-height: 17px;
`;

const BreadcrumbName = styled.div`
  line-height: 17px;
  color: #a9a9a9;
`;

const WrapperImg = styled.div`
  width: 20%;
  max-height: 500px;

  @media (max-width: 768px) {
    width: 30%;
    display: flex;
    justify-content: center;
    padding: 10px;
  }
`;

const Content = styled.div`
  width: 60%;
  padding: 0px 20px;
  max-height: 500px;

  @media (max-width: 768px) {
    width: 70%;
  }
`;

const ToolsBtn = styled.button`
  border: 2px solid #fc541b;
  color: #fc541b;
  width: 35px;
  height: 35px;
`;

const Quantity = styled.div`
  border: 2px solid #a9a9a9;
  width: 100px;
  text-align: center;
  line-height: 30px;
`;

const PaidBtn = styled.button`
  background-color: #fc541b;
  color: #fff;
  width: 100%;
  padding: 5px;
`;

const ProductList = styled.div`
  border-bottom: 1px solid #f2f2f2;
  display: block !important;
`;

const WrapperProductList = styled.div`
  width: 100%;

  @media (min-width: 768px) {
    width: 70%;
    margin-right: 20px;
  }
`;

const WrapperTotal = styled.div`
  width: 100%;

  @media (min-width: 768px) {
    width: 30%;
  }
`;

const SummaryTools = styled.div``;

const HideMB = styled.div`
  @media (min-width: 768px) {
    display: none;
  }
`;

const HideDesktop = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const Cart = () => {
  const router = new useRouter();
  const [cart, setCart] = useState();
  const [componentKey, setComponentKey] = useState(0);
  const [subTotal, setSubTotal] = useState();

  useEffect(() => {
    getCart();
  }, []);

  const AddQuantity = (idx) => {
    cart.cart[idx].quantity = cart.cart[idx].quantity + 1;
    const allPrice = cart.cart.map(
      (data) => data.productId[0].price * data.quantity
    );
    const sumPrice = allPrice.reduce((next, prev) => next + prev, 0);
    setSubTotal(sumPrice);
    setComponentKey(componentKey + 1);
  };

  const decreaseQuantity = (idx) => {
    cart.cart[idx].quantity = cart.cart[idx].quantity - 1;
    const allPrice = cart.cart.map(
      (data) => data.productId[0].price * data.quantity
    );
    const sumPrice = allPrice.reduce((next, prev) => next + prev, 0);
    setSubTotal(sumPrice);
    setComponentKey(componentKey + 1);
  };

  const updateCart = async () => {
    const request = {
      token: sessionStorage.getItem("token"),
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/cart/update`,
      data: {
        cart: [],
      },
    };
    await axiosFetchAPI(request);
    router.push('/checkout')
  };

  const deleteProduct = async (id) => {
    const ownCart = await getCart();
    const findProduct = ownCart.cart
      .filter((data) => data.productId[0]._id === id)
      .map((data) => ({
        productId: data.productId[0]._id,
        quantity: data.quantity,
      }));
    const anotherProduct = ownCart.cart
      .filter((data) => data.productId[0]._id !== id)
      .map((data) => ({
        productId: data.productId[0]._id,
        quantity: data.quantity,
      }));
    const updateCart = [...anotherProduct];
    const request = {
      token: sessionStorage.getItem('token'),
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/cart/update`,
      data: {
        cart: updateCart
      },
    };
    await axiosFetchAPI(request);
    getCart();
  };

  const getCart = async () => {
    const request = {
      token: sessionStorage.getItem("token"),
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/cart/get`,
    };
    const resAPI = await axiosFetchAPI(request);
    const { status, data } = resAPI;
    if (status === 0) {
      setCart(data);
      const allPrice = data.cart.map(
        (data) => data.productId[0].price * data.quantity
      );
      const sumPrice = allPrice.reduce((next, prev) => next + prev, 0);
      setSubTotal(sumPrice);
      return resAPI.data;
    }
  };

  return (
    <Container>
      <Wrapper>
        <div className='breadcrumb flex mb-4'>
          <BreadcrumbText>
            <Link href='/store'>Home</Link>
          </BreadcrumbText>
          <div>
            <BsChevronCompactRight size={20} />
          </div>
          <BreadcrumbName className='pName'>Cart</BreadcrumbName>
        </div>
        <div className='md:flex'>
          <WrapperProductList>
            {cart &&
              cart.cart.map((data, idx) => (
                <ProductList key={idx} className='mb-3'>
                  <div className='flex'>
                    <WrapperImg>
                      <Image
                        src={data.productId[0].banner}
                        alt={data.productId[0].name}
                        width={350}
                        height={350}
                      />
                    </WrapperImg>
                    <Content className='md:mt-2'>
                      <div className='flex justify-between'>
                        <div>
                          <h3>{data.productId[0].name}</h3>
                          <HideMB>
                            <p>
                              ฿
                              {Number(data.productId[0].price).toLocaleString()}
                            </p>
                          </HideMB>
                        </div>
                        <HideDesktop>
                          <h3>
                            ฿{Number(data.productId[0].price).toLocaleString()}
                          </h3>
                        </HideDesktop>
                      </div>
                      <SummaryTools className='my-3'>
                        <div className='flex mt-2 justify-center md:justify-start'>
                          <div className='mr-2'>Quantity</div>
                          <div>
                            <ToolsBtn onClick={() => decreaseQuantity(idx)}>
                              -
                            </ToolsBtn>
                          </div>
                          <Quantity className='mx-2' key={componentKey}>
                            {data.quantity}
                          </Quantity>
                          <div>
                            <ToolsBtn onClick={() => AddQuantity(idx)}>
                              +
                            </ToolsBtn>
                          </div>
                        </div>
                        <div>
                          <button
                            onClick={() => deleteProduct(data.productId[0]._id)}
                          >
                            <BsCartX />
                          </button>
                        </div>
                      </SummaryTools>
                    </Content>
                  </div>
                </ProductList>
              ))}
          </WrapperProductList>
          <WrapperTotal className='mb-5'>
            <h1 className='mb-3'>Summary</h1>
            <div className='flex justify-between'>
              <div className='mb-2'>Subtotal</div>
              <div key={componentKey}>฿{Number(subTotal).toLocaleString()}</div>
            </div>
            <div className='flex justify-between mb-2'>
              <div>Estimate Delivery</div>
              <div>200</div>
            </div>
            <hr />
            <div className='flex justify-between mt-2'>
              <div className='mb-3'>Total</div>
              <div key={componentKey}>฿{(subTotal + 200).toLocaleString()}</div>
            </div>
            <PaidBtn onClick={updateCart}>Checkout</PaidBtn>
          </WrapperTotal>
        </div>
      </Wrapper>
    </Container>
  );
};

Cart.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

export default Cart;
