import React, { Fragment, useState, useEffect } from "react";
import ProductItem from "./ProductItem";
import withContext from "../withContext";
import "../index.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const ProductListByCat = (props) => {
  const { state } = props.location;
  const { catId, clientID } = state;
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch products from the API endpoint with catId in the body
    fetchProducts(catId);
  }, [catId]); // Added catId as a dependency

  const fetchProducts = async (catId) => {
    try {
      const response = await fetch("http://127.0.0.1:8086/api/load-instrument-cat", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ catId: catId })
      });
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data.initProducts); // Set the fetched products in state
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts =
    searchQuery === ""
      ? products
      : products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

  return (
    <Fragment>
      <div className="hero qss">
        <div className="hero-body container">
          <div className="field has-addons">
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="container">
        <div className="column columns is-multiline">
          {filteredProducts && filteredProducts.length ? (
            filteredProducts.map((product, index) => (
              <ProductItem
                user={clientID}
                product={product}
                key={index}
                addToCart={props.context.addToCart}
              />
            ))
          ) : (
            <div className="column">
              <span className="title has-text-grey-light">
              Aucun produit trouvé !              </span>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default withContext(ProductListByCat);
