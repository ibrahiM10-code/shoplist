import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";
import axios from "axios";
import { LOCALHOST, APIRENDER } from "../apiUrls";

function ShopList() {
  const [shoplistData, setShoplistData] = useState([]);
  const [productTotal, setProductTotal] = useState([]); // state for every product's total.
  const { name: shoplistName } = useParams();

  // Loads data of the selected or recent shoplist created.
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`${LOCALHOST}/shoplist/${shoplistName}`);
        const data = await response.json();
        setShoplistData(data[0]);
      } catch (error) {
        console.error(error.message);
      }
    };
    loadData();
  }, [shoplistName]);

  // Updates the total's of a product whenever it's price or quantity is modified.
  useEffect(() => {
    const productTotals = () => {
      if (shoplistData.quantity && shoplistData.price) {
        const priceArray = shoplistData.price;
        const quantityArray = shoplistData.quantity;
        const totals = [];
        for (let index = 0; index < priceArray.length; index++) {
          totals.push(priceArray[index] * quantityArray[index]);
        }
        setProductTotal(totals);
      }
    };
    productTotals();
  }, [shoplistData.quantity, shoplistData.price]);

  // Removes a product of a shoplist from the database and the state.
  const removeProduct = async (productIndex) => {
    try {
      const response = await axios.put(
        `${LOCALHOST}/shoplist/${shoplistName}/${productIndex}`
      );
      if (response.status === 200) {
        console.log(response);
        setShoplistData((prevData) => {
          const updatedProducts = [...prevData.products];
          updatedProducts.splice(productIndex, 1);

          const updatedQuantity = [...prevData.quantity];
          updatedQuantity.splice(productIndex, 1);

          const updatedPrice = [...prevData.price];
          updatedPrice.splice(productIndex, 1);

          return {
            ...prevData,
            products: updatedProducts,
            quantity: updatedQuantity,
            price: updatedPrice,
          };
        });
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Updates the shoplist in the database and state when the button "Save changes" is clicked.
  const updateShoplist = async () => {
    try {
      const totals = productTotal;
      const shoplistTotal = totals.reduce((acc, curr) => acc + curr, 0);
      const data = {
        quantity: shoplistData.quantity,
        price: shoplistData.price,
        subTotal: shoplistTotal,
      };
      const response = await axios.put(
        `${LOCALHOST}/update-shoplist/${shoplistData._id}`,
        data
      );

      if (response.status === 200) {
        console.log(response);
        setShoplistData((prevData) => ({
          ...prevData,
          subTotal: shoplistTotal,
        }));
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Restores the quantity of a product and updates the state with it.
  const handleQuantityChanges = (event, index) => {
    const currentQuantity = [...shoplistData.quantity];
    currentQuantity[index] = parseInt(event.target.value);
    setShoplistData((prevData) => ({
      ...prevData,
      quantity: currentQuantity,
    }));
  };

  // Restores the price of a product and updates the state with it.
  const handlePriceChanges = (event, index) => {
    const currentPrice = [...shoplistData.price];
    currentPrice[index] = parseInt(event.target.value);
    setShoplistData((prevData) => ({
      ...prevData,
      price: currentPrice,
    }));
  };

  return (
    <div className="container-sm table-responsive-sm shoplist-content-container">
      <h1 className="text-center">"{shoplistName}"</h1>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Product total</th>
          </tr>
        </thead>
        <tbody>
          {shoplistData && shoplistData.products ? (
            shoplistData.products.map((product, index) => (
              <tr key={index}>
                <td>{product}</td>
                <td>
                  <input
                    type="number"
                    value={
                      shoplistData.quantity && shoplistData.quantity[index]
                    }
                    onChange={(event) => handleQuantityChanges(event, index)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={shoplistData.price && shoplistData.price[index]}
                    onChange={(event) => handlePriceChanges(event, index)}
                  />
                </td>
                <td>
                  {isNaN(productTotal[index])
                    ? "Loading"
                    : "$" + productTotal[index]}
                </td>
                <td>
                  <button
                    className="remove-product-btn"
                    onClick={() => removeProduct(index)}
                  >
                    <FaRegTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Loading...</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="bottom-content">
        <h5 className="mb-3">Total: ${shoplistData.subTotal}</h5>
        <button type="submit" onClick={updateShoplist}>
          Save changes
        </button>
      </div>
    </div>
  );
}

export default ShopList;
