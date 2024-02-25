import React, { useState, useRef } from "react";

function ProductInput({ setShoplistContent }) {
    const [productData, setProductData] = useState({ productName: "", productQuantity: 0, productPrice: 0 });
    const productInput = useRef();

    function addInput() {
        setShoplistContent(prevContent => { return [...prevContent, productData] });
        setProductData({ productName: "", productQuantity: 0, productPrice: 0 });
        productInput.current.focus();
    }

    const handleProductInfo = (event) => {
        const { value, name } = event.target;
        setProductData((prevProduct) => {
            return {
                ...prevProduct,
                [name]: value
            }
        });
    }

    return (
        <>
            <label htmlFor="">Product Name</label>
            <input type="text" name="productName" value={productData.productName} onChange={handleProductInfo} ref={productInput} />
            <label htmlFor="">Quantity</label>
            <input type="number" name="productQuantity" value={productData.productQuantity} onChange={handleProductInfo} />
            <label htmlFor="">Price</label>
            <input type="number" name="productPrice" value={productData.productPrice} onChange={handleProductInfo} />
            <button type="button" onClick={addInput}>Add product</button>
        </>
    );
}

export default ProductInput;