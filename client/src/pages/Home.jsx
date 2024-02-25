import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import axios from "axios";

function Home() {
    const [shoplists, setShoplists] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getShoplists = async () => {
            try {
                const response = await fetch("http://localhost:3001/api/shoplists");
                const data = await response.json();
                if (response.status === 404) {
                    setShoplists([]);
                } else {
                    setShoplists(data);
                }
            } catch (error) {
                console.error(error.message);
            }
        }
        getShoplists();
    }, []);

    const deleteShoplist = async (shoplistId) => {
        try {
            const response = await axios.delete("http://localhost:3001/api/delete-shoplist/" + shoplistId);
            if (response.status === 200) {
                console.log(response);
                setShoplists(prevShoplist => {
                    return [...prevShoplist]
                })
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <div className="container-sm text-center home-container" style={{ width: "60%" }}>
            <h1>Add shoplist</h1>
            {shoplists.length === 0 ? "No shoplists in the database yet." : (shoplists.map((shoplist, index) => {
                return (
                    <div className="shoplist-wrapper" key={index}>
                        <Link to={`/shoplist/${shoplist.name}`} className="shoplist-link">{shoplist.name}</Link>
                        <button className="ms-4" onClick={() => deleteShoplist(shoplist._id)}><FaRegTrashAlt /></button>
                    </div>
                )
            }))}
            <br />
            <button onClick={() => navigate("/create-shoplist")}><IoIosAddCircle /></button>
        </div>
    );
}

export default Home;