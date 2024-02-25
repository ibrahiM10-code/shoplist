import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import ShopList from "../pages/ShopList";
import NewShopList from "../pages/NewShopList";
import ErrorDisplay from "../pages/ErrorDisplay";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-shoplist" element={<NewShopList />} />
        <Route path="/shoplist/:name" element={<ShopList />} />
        <Route path="*" element={<ErrorDisplay />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
