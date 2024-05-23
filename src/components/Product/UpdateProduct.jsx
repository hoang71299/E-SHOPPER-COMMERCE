import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./style.css";
import Error from "../Error";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function UpdateProduct() {
  const token = localStorage.getItem("token") || "";
  const auth = JSON.parse(localStorage.getItem("auth"));
  const [category, setCategory] = useState([]);
  const [brand, setBrand] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  const defaultInput = {
    name: "",
    price: "",
    category: "",
    brand: "",
    company: "",
    detail: "",
    status: 0,
    sale: 0,
  };
  const [input, setInput] = useState(defaultInput);
  const [image,setImage] = useState([])
  const inputFile = useRef(null)
  const [avatar?,setAvatar] = useState([])
  const [error,setError] = useState({})
  const [avatarCheckBox, setAvatarCheckBox] = useState([]);
  const fetchCategory = () => {
    axios.get(`http://127.0.0.1:8000/api/category-brand`).then((res) => {
      setCategory(res.data.category);
      setBrand(res.data.brand);
    });
  };
  const fetchProduct = () => {
    const options = {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    };
    axios
      .get(`http://127.0.0.1:8000/api/user/product/${params.id}`, options)
      .then((res) => {
        console.log(res)
        setInput({
          name: res.data.data.name,
          price: res.data.data.price,
          category: res.data.data.id_category,
          brand: res.data.data.id_brand,
          sale: res.data.data.sale,
          status: res.data.data.status,
          company: res.data.data.company_profile,
          detail: res.data.data.detail,
        });
        setImage(res.data.data.image)
        setAvatarCheckBox([])
        // console.log(res.data.data);
      });
  };
  useEffect(() => {
    if (token === "") {
      navigate("/");
    } else {
      fetchCategory();
      fetchProduct();
    }
  }, []);
  console.log(input)

  const handleChange=(e)=>{
    console.log(e.target.value)
    const name = e.target.name;
    const value = e.target.value
    setInput(state =>({...state,[name]:value}))
  }
  // const handleFile = (e) => {
  //   const files = Array.from(e.target.files);
  //   setAvatar(prevAvatar => [...prevAvatar, ...files]);
  // };
  const handleFile = (e) => {
    const files = e.target.files;
    setAvatar([...avatar, ...files]);
  };
  const handleCheckboxChange = (e, item) => {
    setAvatarCheckBox((prev) =>
      e.target.checked ? [...prev, item] : prev.filter((itemToRemove) => itemToRemove !== item)
    );
  };
 
  const handleForm = (e) => {
    e.preventDefault();
    let errorSubmit = {};
    let flag = true;
    let allowedExtensions = ["png", "jpg", "jpeg", "PNG", "JPG"];

    const newImage = image.filter((x)=> !avatarCheckBox.find(y => y==x))
    if (avatar.length + newImage.length  > 3) {
      errorSubmit.countFile = "Tổng số hình ảnh không được vượt quá 3";
      flag = false;
    }
    if(avatar.length == 0){
      errorSubmit.file = "vui lòng nhập file";
      flag = false;
    }else {
      for (let i = 0; i < avatar.length; i++) {
        const file = avatar[i];
        if (file.size > 1024 * 1024) {
          errorSubmit.size = "dung lượng ảnh quá lớn";
          avatar[i] = null
          flag = false;
        }
        var fileName = file.name || "";
        var fileExtension = fileName.split(".").pop() || "";
        if (!allowedExtensions.includes(fileExtension)) {
          errorSubmit.type = "không hổ trợ định dạng này.vui lòng chọn định dạng jpg,png,jpg";
          avatar[i] = null
          flag = false;
        }
      }
      const newAvatar = avatar.filter(x => x != null)
      setAvatar(newAvatar)
    }
    // console.log(avatar)
    if (flag) {
      setError({});
      const { name, price, category, brand, company, detail, status, sale } = input;
      let formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('brand', brand);
      formData.append('company', company);
      formData.append('detail', detail);
      formData.append('status', status);
      formData.append('sale', sale);
      avatar.forEach((file) => {
        formData.append("file[]", file);
      });
      avatarCheckBox.forEach((item) => {
        formData.append("avatarCheckBox[]", item);
      });
  
      const options = {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      };
      axios
        .post(`http://localhost:8000/api/user/product/update/${params.id}`, formData, options)
        .then((res) => {
          if (res.data.errors) {
            setError(res.data.errors);
          } else {
            toast.success("Product updated successfully");
            inputFile.current.value = "";
            fetchProduct()
            setAvatar([])
          }
        })
        .catch((error) => console.log(error));
    } else {
      setError(errorSubmit);
    }
  };
  // console.log(image)
  console.log("ok");
  // console.log(avatarCheckBox)
  return (
    <div className="col-sm-9">
      <div className="blog-post-area">
        <h2 className="title text-center">Update Product</h2>
        <div className="signup-form">
          {/*sign up form*/}
          <h2>Update product!</h2>
          <Error error={error} />
          <form onSubmit={handleForm} encType="multipart/form-data">
            <input onChange={handleChange} value={input.name} name="name" type="text" placeholder="Name" />
            <input
              onChange={handleChange}
              value={input.price}
              name="price"
              type="number"
              placeholder="Price"
            />
            <select onChange={handleChange} value={input.category} name="category">
              <option value="">Please choose category</option>
              {category.length > 0 &&
                category.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.category}
                  </option>
                ))}
            </select>
            <select onChange={handleChange} value={input.brand} name="brand">
              <option value="">Please choose brand</option>
              {brand.length > 0 &&
                brand.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.brand}
                  </option>
                ))}
            </select>
            <select onChange={handleChange} value={input.status} name="status">
              <option value="0">sale</option>
              <option value="1">new</option>
            </select>
            {parseInt(input.status) === 0 && (
              <div  className="row">
                <div className="col-sm-8 col-lg-4">
                  <input onChange={handleChange} value={input.sale}   name="sale" min={1} max={90} type="number" />
                </div>
                <div className="col-sm-4 col-lg-2">
                  <span className="h3">%</span>
                </div>
              </div>
            )}
            <input onChange={handleChange} value={input.company} name="company" type="text" placeholder="Company profile" />
            <input ref={inputFile} onChange={handleFile} type="file" multiple  />
            {image.length>0 && image.map((item,index)=>(
              <div className="update-image" style={{marginRight:"20px"}} key={index}>
                <img
                  style={{ width: "120px", height: "120px" }}
                  src={`http://localhost:8000/upload/product/${auth.id}/${item}`}
                  alt=""
                />
                <input checked={avatarCheckBox.find(x => x == item )}  onChange={(e)=>handleCheckboxChange(e,item)} className="checkbox" type="checkbox" />
              </div>
            ))}
            <textarea  onChange={handleChange} value={input.detail} name="detail" placeholder="detail"></textarea>
            <button
              type="submit"
              style={{ marginBottom: "20px" }}
              className="btn btn-lg btn-default"
            >
              Update
            </button>
            <ToastContainer />
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateProduct;
