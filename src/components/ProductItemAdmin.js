

const ProductItemAdmin = props => {
  console.log('////////', product)
  const { product } = props;
  console.log('////////', product)

  return (
    <div className=" column is-half">
      <div className="box">
        <div className="media">
          <div className="media-left">
            <figure className="image is-64x64">
              <img
                src="https://bulma.io/images/placeholders/128x128.png"
                alt="product"
              />
            </figure>
          </div>
          <div className="media-content">
            <b style={{ textTransform: "capitalize" }}>
              {product.name}{" "}
              <span className="tag is-primary">${product.price}</span>
            </b>
            <div>{product.shortDesc}</div>

            {product.stock > 0 ? (
              <small>{product.stock + " Disponible"}</small>
            ) : (
              <small className="has-text-danger">En rupture de stock</small>
            )}
            <div className="is-clearfix">
              <button
                className="button is-small is-outlined is-primary   is-pulled-right"
                onClick={() =>
                  props.addToCart({
                    id: product.name,
                    product,
                    amount: 1
                  })
                }
              >
                Ajouter au panier              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItemAdmin;
