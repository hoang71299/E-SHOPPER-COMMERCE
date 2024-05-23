import axios from "axios";
import { Button, Modal } from "bootstrap";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Zoom from "./Zoom/Zoom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartContext } from "./Cart/CartContext";
function Home() {
  const token = localStorage.getItem("token") || "";
  const auth = JSON.parse(localStorage.getItem("auth"));
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  // const cart = useContext(CartContext);
  const [cart ,setCart ]=useState(useContext(CartContext))
  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);
  useEffect(() => {
    axios.get("http://localhost:8000/api/product").then((res) => {
      setData(res.data.data);
    });
  }, []);
  const handleCart = (item) => {
    // let cart = JSON.parse(localStorage.getItem("cart") || "{}");
    if (cart[item.id]) {
      cart[item.id] += 1;
    } else {
      cart[item.id] = 1;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  };
  // const handleWishlist = (item)=>{
  //   let cart = JSON.parse(localStorage.getItem("cart") || "{}");
  //   if(cart[item.id]){
  //     cart[item.id] ={
  //       ...item,qty:1
  //     }
  //   }else{
  //   }
  // }
  return (
    <div className="col-sm-9 padding-right">
      <div className="features_items">
        {/*features_items*/}
        <h2 className="title text-center">Features Items</h2>

        {data.slice(0, 6).map((item) => (
          <div key={item.id} className="col-sm-4">
            <div id="product1" className="product-image-wrapper">
              <div className="single-products">
                <div className="productinfo text-center">
                  <img
                    src={`http://127.0.0.1:8000/upload/product/${auth?.id}/${
                      JSON.parse(item.image)[0]
                    }`}
                    alt=""
                  />
                  <h2>${item.price}</h2>
                  <p>{item.name}n</p>
                  <a href="#" className="btn btn-default add-to-cart">
                    <i className="fa fa-shopping-cart" />
                    Add to cart
                  </a>
                </div>
                <div className="product-overlay">
                  <div className="overlay-content">
                    <h2>${item.price}</h2>
                    <p>{item.name}</p>
                    {token === "" ? (
                      <button
                        onClick={() => toast.error("vui lòng đăng nhập")}
                        className="btn btn-default add-to-cart"
                      >
                        Add to cart
                      </button>
                    ) : (
                      <Link
                        onClick={() => handleCart(item)}
                        to="#"
                        className="btn btn-default add-to-cart"
                      >
                        <i className="fa fa-shopping-cart" />
                        Add to cart
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              <div className="choose">
                <ul className="nav nav-pills nav-justified">
                  <li>
                    <Link  href="#">
                      <i className="fa fa-plus-square" />
                      Add to wishlist
                    </Link>
                  </li>
                  <li>
                    <Link to={`/product-detail/${item.id}`}>
                      <i className="fa fa-plus-square" />
                      Product detail
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <ToastContainer />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
