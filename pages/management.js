import { useEffect, useState } from "react";
import AdminLayout from "../layouts/Admin";
import styled from "styled-components";
import { axiosFetchAPI } from "../lib/axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

const WrapperBox = styled.div`
  padding: 10px;
  overflow: hidden;
  width: calc(100% - 20px);
  overflow-x: scroll;
  margin: 0 auto;

  @media (min-width: 768px) {
    width: 85%;
    margin: 0 auto;
  }
`;

const Input = styled.input`
  border: 1px solid #d9d9d9;
  width: 100%;
  padding: 2px 5px;
`;

const AddBtn = styled.button`
  background-color: #fc541b;
  color: #fff;
  width: 100%;
  padding: 5px 20px;
`;

const Table = styled.table`
  width: 100%;
  min-width: 300px;
  overflow-x: scroll;

  @media (max-width: 769px) {
    display: none;
  }

  thead {
    background-color: #f2f2f2;
    height: 60px;
  }

  td {
    padding: 20px 10px 20px 10px;
    overflow: hidden;
    border-bottom: 1px solid #f2f2f2;
  }

  .image {
    width: 150px;
    padding: 20px 0px 20px 0px !important;
  }

  .inside {
    padding: 0 20px 0 20px;
  }

  .stock {
    width: 90px;
  }

  .price {
    width: 150px;
  }

  .action {
    width: 150px;
  }

  .description {
    max-width: 300px;
  }
`;

const DeleteItem = styled.button`
  color: #fc541b;
`;

const WrapperSmImg = styled.div`
  width: 30%;
`;

const WrapperContent = styled.div`
  width: 70%;
`;

const ContentDescription = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  color: #8c8c8c;
`;

const DescripText = styled.div`
  height: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const ProductList = styled.div`
  @media (min-width: 768px) {
    display: none;
  }
`;

const ProductContent = styled.div`
  border-bottom: 1px solid #f2f2f2;
`;

const Management = () => {
  const router = useRouter();

  useEffect(() => {
    fetchProductList();
  }, []);

  const [productList, setProductList] = useState();

  const fetchProductList = async () => {
    const request = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/product/get`,
    };
    const resAPI = await axiosFetchAPI(request);
    const { status, data } = resAPI;
    if (status === 0) {
      await setProductList(data);
    }
  };

  const deleteProduct = async (product) => {
    try {
      const request = {
        token: sessionStorage.getItem("token"),
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/product/delete`,
        data: {
          id: product._id,
        },
      };
      const resAPI = await axiosFetchAPI(request);
      const { status } = resAPI;
      if (status === 0) {
        fetchProductList();
      }
    } catch (e) {
      console.log("e: ", e);
    }
  };

  return (
    <WrapperBox>
      <div className='flex justify-between'>
        <div className='mt-3 font-bold'>Stock</div>
        <div className='mt-3'>
          <AddBtn onClick={() => router.push('/addItem')}>
            + ADD
          </AddBtn>
        </div>
      </div>
      <Table className='mt-5'>
        <thead>
          <tr>
            <td className='text-center'>Image</td>
            <td className='text-center'>Name</td>
            <td className='text-center'>Description</td>
            <td className='text-center'>Quantity</td>
            <td className='text-left'>Price</td>
            <td className='text-center'>Action</td>
          </tr>
        </thead>
        <tbody>
          {productList &&
            productList.map((product, idx) => (
              <tr key={`${idx}_${product.name}`} className='py-3'>
                <td className='image'>
                  <Image
                    src={product.banner}
                    alt={product.name}
                    width={150}
                    height={150}
                  />
                </td>
                <td className='text-left inside'>{product.name}</td>
                <td className='text-left inside description'>
                  <DescripText>{product.description}</DescripText>
                </td>
                <td className='text-right inside stock'>{product.stock}</td>
                <td className='text-left inside price'>
                  ฿{product.price.toFixed(2)}
                </td>
                <td className='action inside'>
                  <div className='flex justify-center'>
                    <button className='mr-2' onClick={() => router.push(`/editItem?t=${product._id}`)}>
                      <AiFillEdit size={25} />
                    </button>
                    <DeleteItem onClick={() => deleteProduct(product)}>
                      <AiFillDelete size={25} />
                    </DeleteItem>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <ProductList className='mt-3'>
        {productList &&
          productList.map((product, idx) => (
            <ProductContent className='flex mt-5' key={`${product.name}_${idx}`}>
              <WrapperSmImg>
                <Image
                  src={product.banner}
                  alt={product.name}
                  width={100}
                  height={100}
                />
              </WrapperSmImg>
              <WrapperContent>
                <div className="font-medium mb-2">{product.name}</div>
                <ContentDescription className="mb-2">{product.description}</ContentDescription>
                <div className="font-medium mb-2">Quantity: {product.stock}</div>
                <div className="font-medium mb-2">Price: ฿{product.price.toFixed(2)}</div>
                <div className="mb-4">
                  <div className='flex justify-start'>
                    <button className='mr-2' onClick={() => router.push(`/editItem?t=${product._id}`)}>
                      <AiFillEdit size={25} />
                    </button>
                    <DeleteItem onClick={() => deleteProduct(product)}>
                      <AiFillDelete size={25} />
                    </DeleteItem>
                  </div>
                </div>
              </WrapperContent>
            </ProductContent>
          ))}
      </ProductList>
    </WrapperBox>
  );
};

Management.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default Management;
