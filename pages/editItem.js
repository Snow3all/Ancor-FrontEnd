import { useEffect, useState } from "react";
import AdminLayout from "../layouts/Admin";
import styled from "styled-components";
import { axiosFetchAPI } from "../lib/axios";
import { BsFillCloudUploadFill } from "react-icons/bs";
import S3 from "aws-sdk/clients/s3";
import { useRouter } from "next/router";
import Image from "next/image";

const WrapperBox = styled.div`
  padding: 10px;
`;

const Input = styled.input`
  border: 1px solid #d9d9d9;
  width: 100%;
  padding: 2px 5px;
`;

const TextArea = styled.textarea`
  border: 1px solid #d9d9d9;
  width: 100%;
  height: auto;
  padding: 2px 5px;
`;

const Btn = styled.button`
  background-color: #fc541b;
  color: #fff;
  width: 100%;
  padding: 5px 5px;
`;

const UploadBtn = styled.label`
  position: relative;
  color: #fc541b;
  padding: 5px 15px;
  border: 1px solid #fc541b;
  display: inline-flex;
  height: 100%;
`;

const SVG = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const AddItem = () => {
  const router = useRouter();
  const [banner, setBanner] = useState();
  const [bannerUrl, setBannerUrl] = useState();
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [quantity, setQuantity] = useState();
  const [price, setPrice] = useState();
  const [fileName, setFileName] = useState();
  const [id, setId] = useState();

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    try {
      const queryParam = router.asPath.split("?t=")[1];
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
        setQuantity(data.stock);
        setPrice(data.price);
        setBannerUrl(data.banner);
      }
    } catch (e) {
      console.log("e: ", e);
    }
  };

  const updateProduct = async () => {
    const request = {
      token: sessionStorage.getItem("token"),
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/product/edit`,
      data: {
        id: id,
        name: name,
        description: description,
        price: Number(price),
        stock: Number(quantity),
        banner: bannerUrl,
      },
    };
    const resAPI = await axiosFetchAPI(request);
    const { status } = resAPI;
    if (status === 0) {
      router.push('/management');
    }
  };

  const upload = async (e) => {
    const s3 = new S3({
      region: "ap-southeast-1",
      accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY,
      secretAccessKey: process.env.NEXT_PUBLIC_SECRET_KEY,
    });
    const imgLocation = e.target.files[0];
    if (banner) {
      try {
        const deleteProvisos = { Bucket: "snow3all", Key: banner };
        const deleteImg = s3.deleteObject(deleteProvisos);
        deleteImg.on("httpUploadProgress", (p) => {
          console.log(p.loaded / p.total);
        });
        await deleteImg.promise();
      } catch (e) {
        console.log("e: ", e);
      }
    }
    const params = {
      Bucket: "snow3all",
      Key: imgLocation.name,
      Body: imgLocation,
    };
    try {
      const upload = s3.upload(params);
      upload.on("httpUploadProgress", (p) => {
        console.log(p.loaded / p.total);
      });
      const url = await upload.promise();
      setFileName(e.target.files[0].name);
      setBanner(url.key);
      setBannerUrl(url.Location);
    } catch (err) {
      console.error("err", err);
    }
  };

  return (
    <WrapperBox>
      <h1 className='text-center'>Add Item</h1>
      <div>
        <div>Image</div>
        <Image
          className="mt-2"
          src={bannerUrl}
          alt={name}
          width={100}
          height={100}
        />
        <div className="mt-2">Change Image</div>
        <div className='mt-2'>
          <UploadBtn>
            <div className='relative w-7'>
              <SVG className='mr-2'>
                <BsFillCloudUploadFill size={20} />
              </SVG>
            </div>
            <div>Upload</div>
            <input type='file' hidden onChange={(e) => upload(e)} />
          </UploadBtn>
          <div className='my-2'>File name: {fileName}</div>
        </div>
        <div>
          <label>Name</label>
          <div>
            <Input type='text' onChange={(e) => setName(e.target.value)} placeholder={name}/>
          </div>
        </div>
        <div>
          <label>Description</label>
          <div>
            <TextArea
              type='text'
              onChange={(e) => setDescription(e.target.value)}
              placeholder={description}
            />
          </div>
        </div>
        <div>
          <label>Quantity</label>
          <div>
            <Input type='text' onChange={(e) => setQuantity(e.target.value)} placeholder={quantity}/>
          </div>
        </div>
        <div>
          <label>Price (THB)</label>
          <div>
            <Input type='text' onChange={(e) => setPrice(e.target.value)} placeholder={price}/>
          </div>
        </div>
        <div className='mt-3'>
          <Btn onClick={updateProduct}>Save</Btn>
        </div>
      </div>
    </WrapperBox>
  );
};

AddItem.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default AddItem;
