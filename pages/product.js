import DefaultLayout from "../layouts/Default";
import Image from "next/image";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { axiosFetchAPI } from "../lib/axios";
import { useRouter } from "next/router";
import { BsChevronCompactRight } from "react-icons/bs";
import Link from "next/link";

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
  width: 40%;
  max-height: 500px;

  @media (max-width: 768px) {
    width: 100%;
    display: flex;
    justify-content: center;
  }
`;

const Content = styled.div`
  width: 60%;
  padding: 0px 20px;
  max-height: 500px;

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 20px;
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

const AddBtn = styled.button`
  background-color: #fc541b;
  color: #fff;
  width: 100%;
  padding: 5px;
`;

const Product = () => {
  const router = useRouter();
  const [bannerUrl, setBannerUrl] = useState();
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState();
  const [id, setId] = useState();

  useEffect(() => {
    getProduct();
  }, []);

  useEffect(() => {
    if(quantity < 0) {
      setQuantity(0);
    }
  }, [quantity])

  const getProduct = async () => {
    try {
      const queryParam = router.asPath.split("?%t=")[1];
      const request = {
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/product/getProduct`,
        data: {
          id: queryParam,
        },
      };
      const resAPI = await axiosFetchAPI(request);
      const { status, data } = resAPI;
      if (status === 0) {
        setId(data._id);
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setBannerUrl(data.banner);
      }
    } catch (e) {
      console.log("e: ", e);
    }
  };

  const AddQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(quantity - 1);
  };

  const updateCart = async () => {
    const ownCart = await getCart();
    const findProduct = ownCart.cart
      .filter((data) => data.productId[0]._id === id)
      .map((data) => ({
        productId: data.productId[0]._id,
        quantity: quantity,
      }));
    const anotherProduct = ownCart.cart
      .filter((data) => data.productId[0]._id !== id)
      .map((data) => ({
        productId: data.productId[0]._id,
        quantity: data.quantity,
      }));
    const addNewProduct = {
      productId: id,
      quantity: quantity,
    }
    const updateCart = [...findProduct, ...anotherProduct, addNewProduct];
    const request = {
      token: sessionStorage.getItem('token'),
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/cart/update`,
      data: {
        cart: updateCart
      },
    };
    await axiosFetchAPI(request);
  };

  const getCart = async () => {
    const request = {
      token: sessionStorage.getItem("token"),
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/cart/get`,
    };
    const resAPI = await axiosFetchAPI(request);
    return resAPI.data;
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
          <BreadcrumbName className='pName'>{name}</BreadcrumbName>
        </div>
        <div className='md:flex'>
          <WrapperImg>
            <Image src={bannerUrl} alt={name} width={500} height={500} />
          </WrapperImg>
          <Content>
            <div>
              <h3>{name}</h3>
            </div>
            <div className='my-2'>
              <h1>฿{Number(price).toLocaleString()}</h1>
            </div>
            <div>{description}</div>
            <div className='mt-3'>
              <div>Quantity</div>
              <div className='flex mt-2 justify-center md:justify-start'>
                <div>
                  <ToolsBtn onClick={decreaseQuantity}>-</ToolsBtn>
                </div>
                <Quantity className='mx-2'>{quantity}</Quantity>
                <div>
                  <ToolsBtn onClick={AddQuantity}>+</ToolsBtn>
                </div>
              </div>
            </div>
            <div className='mt-2'>
              <AddBtn onClick={updateCart}>Add to cart</AddBtn>
            </div>
          </Content>
        </div>
      </Wrapper>
    </Container>
  );
};

Product.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

export default Product;
