import DefaultLayout from "../layouts/Default";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import Image from "next/image";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { axiosFetchAPI } from "../lib/axios";
import { useRouter } from "next/router";

const Container = styled.div`
  margin-bottom: 50px;
`;

const Wrapper = styled.div`
  width: 80%;
  margin: 20px auto;
  padding: 0 !important;
`;

const Card = styled.div`
  border: 1px solid #f2f2f2;
  max-height: 350px;
`;

const Select = styled.select`
  padding: 3px 5px;
  border: 1px solid #f2f2f2;
`;

const Store = () => {
  const router = useRouter();

  useEffect(() => {
    fetchProductList();
  }, []);

  const [componentKey, setComponentKey] = useState(0);

  const [productList, setProductList] = useState();

  const fetchProductList = async () => {
    const request = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/product/get`,
    };
    const resAPI = await axiosFetchAPI(request);
    const { status, data } = resAPI;
    if (status === 0) {
      await setProductList(data.sort((a, b) => b.price - a.price));
    }
  };

  const handleSort = (e) => {
    if(Number(e.target.value) === 1) {
      setProductList(productList.sort((a, b) => b.price - a.price));
      setComponentKey(componentKey + 1);
    } else {
      setProductList(productList.sort((a, b) => a.price - b.price));
      setComponentKey(componentKey + 1);
    }
  }

  const showProduct = (id) => {
    router.push(`/product?%t=${id}`);
  }
  return (
    <Container>
      <Wrapper className='p-5'>
        <Swiper pagination={true} modules={[Pagination]} className='mySwiper'>
          <SwiperSlide>
            <Image
              src={"/assets/Banner.png"}
              alt={"logo"}
              width={1968}
              height={862}
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src={"/assets/Banner.png"}
              alt={"logo"}
              width={1968}
              height={862}
            />
          </SwiperSlide>
        </Swiper>
      </Wrapper>
      <Wrapper>
        <h1 className='text-center'>NEW ARRIVALS</h1>
        <div>
          <div className='flex justify-end mb-4'>
            <div className="mr-2">Sort By</div>
            <div>
              <div className='select'>
                <Select onChange={(e) => handleSort(e)}>
                  <option value={1}>Price: High - Low</option>
                  <option value={2}>Price: Low - High</option>
                </Select>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3' key={componentKey}>
            {productList &&
              productList.map((product, idx) => (
                <Card key={idx} onClick={() => showProduct(product._id)}>
                  <div>
                    <Image
                      src={product.banner}
                      alt={product.name}
                      width={500}
                      height={500}
                    />
                  </div>
                  <div className='p-3'>
                    <div>{product.name}</div>
                    <div>
                      ฿{parseFloat(product.price.toFixed(2)).toLocaleString()}
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </Wrapper>
    </Container>
  );
};

Store.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

export default Store;
