import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Head from "./components/Layout/Head";
import MenuLeft from "./components/Layout/MenuLeft";
import Footer from "./components/Layout/Footer";
import MenuAcc from "./components/Layout/MenuAcc";
import { CartContext } from "./components/Cart/CartContext";
import Cart from "./components/Cart/Cart";

function App(props) {
  const location = useLocation();
  const isCartPath = location.pathname.includes("cart");
  const isAccountRelatedPath =
    location.pathname.includes("account") ||
    location.pathname.includes("my-product") ||
    location.pathname.includes("create-product") ||
    location.pathname.includes("update-product");
  let local =JSON.parse(localStorage.getItem("cart") || "{}")
  // console.log(local)
  return (
    <>
      <CartContext.Provider value={local}>
        <Head />
        <section>
          <div className="container">
            {isCartPath ? (
              // Nếu pathname là 'cart', chỉ hiển thị props.children
              // props.children
              <Cart/>
            ) : (
              <div className="row">
                {isAccountRelatedPath ? <MenuAcc /> : <MenuLeft />}
                {props.children}
              </div>
            )}
          </div>
        </section>
        <Footer />
      </CartContext.Provider>
    </>
  );
}

export default App;
