import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../Cart/CartContext";
function Cart({setUpd}) {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token") || "";
  const auth = JSON.parse(localStorage.getItem("auth") || "{}");
  const navigate = useNavigate();
  const [cart ,setCart ]=useState(useContext(CartContext));
  // const cart = useContext(CartContext);
  const [total, setTotal] = useState(0);
  const fetchProduct = () => {
    axios
      .post("http://localhost:8000/api/product/cart", cart)
      .then((res) => {
        console.log(res.data.data)
        setData(res.data.data);
        calculateTotal(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const calculateTotal = (items) => {
    let total = 0;
    items.forEach((item) => {
      total += item.price * (cart[item.id] || 0);
    });
    setTotal(total);
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      fetchProduct();
    }
  }, []);

  const handlePlus = (item, event) => {
    event.preventDefault()
    const updatedCart = { ...cart };
    updatedCart[item.id] = (updatedCart[item.id] || 0) + 1;
    
    
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    console.log(cart);
    const newData = data.map((value) => {
      if (value.id === item.id) {
        return { ...value, qty: value.qty + 1 };
      }
      return value;
    });
    setData(newData);
    calculateTotal(newData);
  };
  const handleMinus = (item, event) => {
    const updatedCart = { ...cart };
    event.preventDefault();
    updatedCart[item.id] = updatedCart[item.id] - 1;
    if (updatedCart[item.id] < 1 || updatedCart[item.id] == null) {
      delete updatedCart[item.id];
    }
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    let newData = data.map((value,index)=>{
      if(value.id === item.id){
        
        return {...value,qty:value.qty - 1}
      }
      return value
    }).filter((value)=>value.qty !== 0)  
    setData(newData) 
    calculateTotal(newData);
    
    
  };

  const handleRemove = (item, event) => {
    const updatedCart = { ...cart };
    event.preventDefault();
    delete updatedCart[item.id];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    let newData = data.filter((value,index)=>{
      if(value.id === item.id){
        return false
      }
      return true
    })   
    setData(newData) 
    calculateTotal(newData);
  };

  // console.log(cart);
  return (
    <>
      <section id="cart_items">
        <div className="container">
          <div className="breadcrumbs">
            <ol className="breadcrumb">
              <li>
                <a href="#">Home</a>
              </li>
              <li className="active">Shopping Cart</li>
            </ol>
          </div>
          <div className="table-responsive cart_info">
            <table className="table table-condensed">
              <thead>
                <tr className="cart_menu">
                  <td className="image">Item</td>
                  <td className="description" />
                  <td className="price">Price</td>
                  <td className="quantity">Quantity</td>
                  <td className="total">Total</td>
                  <td />
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td className="cart_product">
                      <a href>
                        <img
                          src={`http://localhost:8000/upload/product/${
                            auth.id
                          }/small_${JSON.parse(item.image)[0]}`}
                          alt=""
                        />
                      </a>
                    </td>
                    <td className="cart_description">
                      <h4>
                        <a href>{item.name}</a>
                      </h4>
                      <p>Web ID: {item.id}</p>
                    </td>
                    <td className="cart_price">
                      <p>${item.price}</p>
                    </td>
                    <td className="cart_quantity">
                      <div className="cart_quantity_button">
                        <Link
                          style={{ cursor: "pointer" }}
                          onClick={(event) => handlePlus(item, event)}
                          className="cart_quantity_up"
                          href="#"
                        >
                          +
                        </Link>
                        <input
                          className="cart_quantity_input"
                          type="text"
                          name="quantity"
                          value={ item.qty }
                          autoComplete="off"
                          size={2}
                        />
                        <Link
                          onClick={(event) => handleMinus(item, event)}
                          className="cart_quantity_down"
                          href
                        >
                          -
                        </Link>
                      </div>
                    </td>
                    <td className="cart_total">
                      <p className="cart_total_price">
                        ${item.qty * item.price}
                      </p>
                    </td>
                    <td className="cart_delete">
                      <a
                        onClick={(event) => handleRemove(item, event)}
                        className="cart_quantity_delete"
                        href
                      >
                        <i className="fa fa-times" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section id="do_action">
        <div className="container">
          <div className="heading">
            <h3>What would you like to do next?</h3>
            <p>
              Choose if you have a discount code or reward points you want to
              use or would like to estimate your delivery cost.
            </p>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <div className="chose_area">
                <ul className="user_option">
                  <li>
                    <input type="checkbox" />
                    <label>Use Coupon Code</label>
                  </li>
                  <li>
                    <input type="checkbox" />
                    <label>Use Gift Voucher</label>
                  </li>
                  <li>
                    <input type="checkbox" />
                    <label>Estimate Shipping &amp; Taxes</label>
                  </li>
                </ul>
                <ul className="user_info">
                  <li className="single_field">
                    <label>Country:</label>
                    <select>
                      <option>United States</option>
                      <option>Bangladesh</option>
                      <option>UK</option>
                      <option>India</option>
                      <option>Pakistan</option>
                      <option>Ucrane</option>
                      <option>Canada</option>
                      <option>Dubai</option>
                    </select>
                  </li>
                  <li className="single_field">
                    <label>Region / State:</label>
                    <select>
                      <option>Select</option>
                      <option>Dhaka</option>
                      <option>London</option>
                      <option>Dillih</option>
                      <option>Lahore</option>
                      <option>Alaska</option>
                      <option>Canada</option>
                      <option>Dubai</option>
                    </select>
                  </li>
                  <li className="single_field zip-field">
                    <label>Zip Code:</label>
                    <input type="text" />
                  </li>
                </ul>
                <a className="btn btn-default update" href>
                  Get Quotes
                </a>
                <a className="btn btn-default check_out" href>
                  Continue
                </a>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="total_area">
                <ul>
                  <li>
                    Cart Sub Total <span>$59</span>
                  </li>
                  <li>
                    Eco Tax <span>$2</span>
                  </li>
                  <li>
                    Shipping Cost <span>Free</span>
                  </li>
                  <li>
                    Total <span>${total}</span>
                  </li>
                </ul>
                <a className="btn btn-default update" href>
                  Update
                </a>
                <a className="btn btn-default check_out" href>
                  Check Out
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Cart;
