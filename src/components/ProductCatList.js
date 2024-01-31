import React, { Fragment, useState } from "react";
import ProductItem from "./ProductItem";
import CatItem from "./CatItem";
import withContext from "../withContext";
import "../index.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const ProductCatList = (props) => {
  const { products, user, categories } = props.context;
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts =
    searchQuery === ""
      ? products
      : products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    
    const filteredCategories =
        searchQuery === ""
        ? categories
        : categories.filter((category) =>
            category.Nom.toLowerCase().includes(searchQuery.toLowerCase())
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
                placeholder="rechercher"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
      </div>
      <br />
      <p className="cat">Nouveau arrivage </p>
      <div className="container">
        <div className="column columns is-multiline">
          {filteredProducts && filteredProducts.length ? (
            filteredProducts.map((product, index) => (
              <ProductItem
                user={user}
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
      
          <p className="cat">Categories </p>
        <br />
        <div className="container">
        <div className="column columns is-multiline">
        {filteredCategories && filteredCategories.length ? (
                    filteredCategories.map((category, index) => (
              <CatItem
                user={user}
                category={category}
                key={index}
              />
            ))
          ) : (
            <div className="column">
              <span className="title has-text-grey-light">
              Aucune catégorie trouvée !              </span>
            </div>
          )}
        </div>
        </div>
    </Fragment>
  );
};

export default withContext(ProductCatList);
