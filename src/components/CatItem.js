import React from "react";
import { Link } from "react-router-dom";

const CatItem = props => {
  const { category, user } = props;
  console.log('/////////', user)
  return (

    <Link to={{ pathname: "/products-cat", state: {catId:category.IDCategorie ,clientID: user.usersid}}} className=" column is-half">
      <div className="box">
        <div className="media">
          <div className="media-left">
             <figure className="image is-64x64">
              <img
                src={`http://127.0.0.1:8086/static/${category.IDCategorie}-cat.png`}
                alt="product"
              />
            </figure>
          </div>
          <div className="media-content">
            <b style={{ textTransform: "capitalize" }}>
              {category.Nom}{" "}
            </b>

            
            <div className="is-clearfix">
              
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CatItem;
