import React from "react";

const CartItem = props => {
  const { cartItem, cartKey, userId } = props;
  const { product, amount } = cartItem;
  console.log('/*/*/*', cartItem, userId)
  return (
    <div className=" column is-half">
      <div className="box">
        <div className="media">
          <div className="media-left">
            <figure className="image is-64x64">
              <img
                src={`http://127.0.0.1:8086/static/${cartItem.IDInstrument}.png`}
                alt="product"
              />
            </figure>
          </div>
          <div className="media-content">
            <b style={{ textTransform: "capitalize" }}>
              {cartItem.name}{" "}
              <span className="tag is-primary">{cartItem.price} TND</span>
            </b>
            <div>{cartItem.shortDesc}</div>
            <small>{`${cartItem.qte} dans le panier`}</small>
          </div>
          <div
            className="media-right"
            onClick={() => props.removeFromCart(cartItem.IDInstrument, userId)}
          >
            <span className="delete is-large"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
