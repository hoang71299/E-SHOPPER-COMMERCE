import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Error from "../Error";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function CreateProduct() {
  const token = localStorage.getItem("token") || "";
  const navigate = useNavigate();
  const params = useParams()
  const defaultInput = {
    'name':'',
    'price':'',
    'category':'',
    'brand':'',
    'company':'',
    'detail':'',
    'status': 0,
    'sale': 0,
  }
  const inputFile = useRef(null)
  const [input,setInput] = useState(defaultInput)
  const [category,setCategory] = useState([]);
  const [brand,setBrand] = useState([]);
  const [avatar,setAvatar] = useState([])
  const [error,setError] = useState({})
  
  useEffect(() => {
    if (token === "") {
      navigate("/");
    } else {
      axios.get(`http://127.0.0.1:8000/api/category-brand`)
        .then(res =>{
          setCategory(res.data.category)
          setBrand(res.data.brand)
        })
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput(prevInput => ({...prevInput, [name]: value}));
  }

  // const handleFile = (e) => {
  //   const files = Array.from(e.target.files);
  //   setAvatar(prevAvatar => [...prevAvatar, ...files]);
  // };
  const handleFile = (e) => {
    const files = e.target.files;
    setAvatar([...avatar, ...files]);
  };
  // console.log(avatar)
  const handleForm = (e) => {
    e.preventDefault();
    // console.log(avatar);
    let errorSubmit = {};
    let flag = true;
    let allowedExtensions = ["png", "jpg", "jpeg", "PNG", "JPG"];
    
    if(input.name === ""){
      errorSubmit.name = "vui lòng nhập name";
      flag = false;
    }
    if(input.price === ""){
      errorSubmit.price = "vui lòng chon giá";
      flag = false;
    }
    if(input.category === ""){
      errorSubmit.category = "vui lòng nhập danh mục";
      flag = false;
    }
    if(input.brand === ""){
      errorSubmit.brand = "vui lòng nhập hãng ";
      flag = false;
    }
    if(input.sale === ""){
      errorSubmit.sale = "vui lòng nhập giảm giá ";
      flag = false;
    }
    if(input.company === ""){
      errorSubmit.company = "vui lòng nhập công ty";
      flag = false;
    }
    if(input.detail === ""){
      errorSubmit.detail = "vui lòng nhập chi tiết";
      flag = false;
    }
    if(avatar.length == 0){
      errorSubmit.file = "vui lòng nhập file";
      flag = false;
    }else if (avatar.length > 3) {
      errorSubmit.file = "bạn chỉ được chọn 3 ảnh thôi vui lòng chọn hình lại";
      inputFile.current.value = "";
      setAvatar([])
      flag = false;
    } else {
      for (let i = 0; i < avatar.length; i++) {
        const file = avatar[i];
        if (file.size > 1024 * 1024) {
          errorSubmit.size = "dung lượng ảnh quá lớn";
          setAvatar([])
          inputFile.current.value = "";
          flag = false;
        }
        var fileName = file.name || "";
        var fileExtension = fileName.split(".").pop() || "";
        if (!allowedExtensions.includes(fileExtension)) {
          errorSubmit.type = "không hổ trợ định dạng này.vui lòng chọn định dạng jpg,png,jpg";
          setAvatar([])
          inputFile.current.value = "";
          flag = false;
        }
      }
      // const newAvatar = avatar.filter(x => x != null)
      // setAvatar(newAvatar)
    }

    if(flag){
      setError("");
      const { name, price, category, brand, company, detail, status, sale } = input;
      const options = {
        headers: {
          'Authorization': "Bearer " + token,
          "Content-Type": "multipart/form-data",
          'Accept': "application/json",
        },
      };
      let formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('brand', brand);
      formData.append('company', company);
      formData.append('detail', detail);
      formData.append('status', status);
      formData.append('sale', sale);
      // avatar.forEach((file, index) => {
      //   formData.append('file[]', file, file.name);
      // });
      avatar.forEach((file) => {
        formData.append("file[]", file);
      });

      axios.post("http://127.0.0.1:8000/api/user/product/add", formData, options)
        .then(res => {
          if (res.data.errors) {
            setError(res.data.errors);
          } else {
            toast.success("Product added successfully");
            setInput(defaultInput);
            inputFile.current.value = "";
            setAvatar([]);
          }
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      setError(errorSubmit);
    }
  }
  // console.log(avatar);
  return (
    <>
      <div className="col-sm-9" style={{marginBottom:"30px"}}>
        <div className="blog-post-area">
          <h2 className="title text-center">Create product</h2>
          <div className="signup-form">
            <h2>Create new product</h2>
            <Error error={error} />
            <form encType="multipart/form-data" onSubmit={handleForm}>
              <input onChange={handleChange} value={input.name} name="name" type="text" placeholder="Name" />
              <input onChange={handleChange} value={input.price} name="price" type="number" placeholder="Price" />
              <select onChange={handleChange} value={input.category} name="category">
                <option value="">Please choose category</option>
                {category.length > 0 && category.map(item => (
                  <option key={item.id} value={item.id}>{item.category}</option>
                ))}
              </select>
              <select value={input.brand} onChange={handleChange} name="brand">
                <option value="">Please choose brand</option>
                {brand.length > 0 && brand.map(item => (
                  <option key={item.id} value={item.id}>{item.brand}</option>
                ))}
              </select>
              <select value={input.status} onChange={handleChange} name="status">
                <option value="0">sale</option>
                <option value="1">new</option>
              </select>
              {parseInt(input.status) === 0 && (
                <div className="row">
                  <div className="col-sm-8 col-lg-4">
                    <input onChange={handleChange} value={input.sale} name="sale" min={1} max={90} type="number" placeholder="Sale" />
                  </div>
                  <div className="col-sm-4 col-lg-2">
                    <span className="h3">%</span>
                  </div>
                </div>
              )}
              <input onChange={handleChange} value={input.company} name="company" type="text" placeholder="Company profile" />
              <input ref={inputFile} onChange={handleFile} type="file" multiple  />
              <textarea value={input.detail} onChange={handleChange} name="detail" placeholder="Detail"></textarea>
              <button type="submit" className="btn btn-default">Create</button>
            </form>
          </div>
          <ToastContainer />
        </div>
      </div>
    </>
  );
}
