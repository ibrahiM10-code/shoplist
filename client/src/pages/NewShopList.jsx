import React, { useRef, useState } from "react";
import ProductInput from "../components/ProductInput";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LOCALHOST, APIRENDER } from "../apiUrls";

function NewShopList() {
  const [shoplistContent, setShoplistContent] = useState([]);
  const navigate = useNavigate();
  const shoplistName = useRef(null);

  const createShoplistData = (
    shoplistName,
    productsArray,
    quantitiesArray,
    pricesArray,
    subtotal
  ) => {
    const shoplistData = {
      name: shoplistName.current.value,
      products: productsArray,
      quantity: quantitiesArray,
      price: pricesArray,
      subTotal: subtotal,
    };
    return shoplistData;
  };

  const sendShoplistForm = async (event) => {
    event.preventDefault();
    try {
      let quantitiesArray = [];
      let pricesArray = [];
      let productsArray = [];
      let totalsArray = [];
      shoplistContent.map((content) => {
        totalsArray.push(content.productQuantity * content.productPrice);
        productsArray.push(content.productName);
        quantitiesArray.push(content.productQuantity);
        pricesArray.push(content.productPrice);
        return 1;
      });
      const total = totalsArray.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);
      const data = createShoplistData(
        shoplistName,
        productsArray,
        quantitiesArray,
        pricesArray,
        total
      );
      const response = await axios.post(`${LOCALHOST}/add-shoplist`, data);

      if (response.status === 201) {
        navigate(`/shoplist/${data.name}`);
      } else {
        navigate("*");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="new-shoplist-form-container container-sm">
      <form className="new-shoplist-form" onSubmit={sendShoplistForm}>
        <label htmlFor="">Shoplist's Name</label>
        <input type="text" ref={shoplistName} />
        <ProductInput setShoplistContent={setShoplistContent} />
        <button type="submit">Create Shoplist</button>
      </form>
    </div>
  );
}

export default NewShopList;
