import React, { Component } from "react";
import { useProductView } from "./useProductView";
import RatingStars from './RatingStars';
import './RatingStars.css'; // You can style your stars in a separate CSS file
import { FaShoppingCart } from 'react-icons/fa';


import {
  Row,
  Col,
  Card,
  Label,
  Input,
  Button,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  FormGroup,
  CardSubtitle,
} from "reactstrap";

const initState = {
  instrumentId: 0,
  instNom: "",
  instStock: 0,
  instPrix: 0.0,
  instDesc: "",
  instShortDesc: "",
  reviews: [],
  clientID: 0
};

class ProductView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initState,
      newReview: {
        rating: 0,
        comment: "",
        clientID: 0,
      },
    };
  }

  componentDidMount() {
    // Access the product from the location state
    const { state } = this.props.location;
    console.log('##', state.clientID)
    this.setState({
      instrumentId: state.IDInstrument,
      instNom: state.Nom,
      instStock: state.Stock,
      instPrix: state.Prix,
      instDesc: state.Desc,
      instShortDesc: state.shortDesc,
      clientID: state.clientID
    });
    console.log(state.instrumentId);

    this.getReviewsAPI(state.IDInstrument);
  }


  addToCart = async (cartItem) => {
    try {
      console.log('****----', cartItem.uid)
      // Make a POST request to the API endpoint
      const response = await fetch('http://127.0.0.1:8086/api/ajout-panier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers if required
        },
        body: JSON.stringify({
          productId: cartItem.id,
          userId: cartItem.uid,
          amount: cartItem.amount,
        }),
      });

      // Check if the request was successful (status code 200)
      if (response.ok) {
        this.props.history.push('/cart');
        window.location.reload();
        // If successful, update the local state and storage
        let cart = this.state.cart;
        if (cart[cartItem.id]) {
          cart[cartItem.id].amount += cartItem.amount;
        } else {
          cart[cartItem.id] = cartItem;
        }
        if (cart[cartItem.id].amount > cart[cartItem.id].product.stock) {
          cart[cartItem.id].amount = cart[cartItem.id].product.stock;
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        this.setState({ cart });
        
      } else {
        // Handle error cases if needed
        console.error('Failed to add item to the cart');
      }
    } catch (error) {
      console.error('Error adding item to the cart:', error);
    }
  };

  getReviewsAPI = (x) => {
  const { instrumentId } = this.state;
  const apiUrl = "http://127.0.0.1:8086/api/get-reviews";
  fetch(apiUrl, {
       method: "POST",
      headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ IDInstrument: x }),
     })
       .then(response => response.json())
       .then(data => {
         console.log("API Response:", data);
         this.setState({
           reviews: data.liste
         })
       })
       .catch(error => {
         console.error("API Error:", error);
       });
   };

  renderStarRating(rating) {
    const maxStars = 5;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = maxStars - fullStars - (halfStar ? 1 : 0);

    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i}>&#9733;</span>); 
    }

    if (halfStar) {
      stars.push(<span key="half">&#9734;&#9733;</span>);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`}>&#9734;</span>); 
    }

    return stars;
  }

  renderReviews() {
    const { reviews } = this.state;

    if (!reviews || reviews.length === 0) {
      return null; 
    }

    return reviews.map((review, index) => (
      <div key={index}>
        <hr /> {}

        <CardSubtitle>
          <strong>Rating: {this.renderStarRating(review[0])}</strong>
        </CardSubtitle>
        <CardText>{review[1]}</CardText>
        <CardSubtitle>
          <em>{new Date(review[2]).toUTCString()}</em>
        </CardSubtitle>
        <CardSubtitle>
          <strong>Client: {review[3]}</strong>
        </CardSubtitle>
      </div>
    ));
  }

  // Handle input changes in the review form
  handleReviewChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      newReview: {
        ...prevState.newReview,
        [name]: value,
      },
    }));
  };

  // Handle form 
  handleReviewSubmit = (e) => {
    e.preventDefault();
    // You can add additional validation here if needed
    const { newReview } = this.state;
    const { instrumentId } = this.props.location.state;

    // Make an API call to submit the review
    // You might want to extract this logic into a separate function
    // and handle the API call in a more modular way
    fetch("http://127.0.0.1:8086/api/submit-review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        IDInstrument: instrumentId,
        rating: newReview.rating,
        comment: newReview.comment,
        clientName: newReview.clientName,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Avis soumis avec succès :", data);
        // You might want to update the state to refresh the reviews
        // this.getReviewsAPI(instrumentId); // Commented out the API call since you requested it without the review API
        // Optionally, you can reset the form
        this.setState({
          newReview: {
            rating: 0,
            comment: "",
            clientName: "",
          },
        });
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi de l'avis :", error);
        // Handle errors
      });
  };

  render() {
    const { instrumentId, instNom, instStock, instPrix, instDesc, instShortDesc, reviews, newReview, clientID  } = this.state;
    return (
      
        <Card className="product-details">
          <table className="table">
          
            <tr>
            <td className="fixed-width">
            <Col sm="12" md="4">
                <div className="box is-small1 d-flex justify-content-center align-items-center">
                    <CardImg
                        className="image is-600x600"
                        src={`http://127.0.0.1:8086/static/${instrumentId}.png`}
                        alt=""
                        style={{ maxWidth: '100%', maxHeight: '100%' }} // Ensures the image fits inside the box
                    />
                </div>
            </Col>
        </td>
              <td>
                <Col sm="12" md="8" >
                  <CardBody>
                    <CardTitle className="stock-subtitle"><strong className="is-size-2">{instNom}</strong></CardTitle>
                    <CardText className="stock-subtitle"><strong>{instShortDesc}</strong></CardText>
                    <div className="limited-width"><CardText>{instDesc}</CardText></div>
                    <CardSubtitle className="stock-subtitle">
                      <strong >Prix: {instPrix} TND</strong>
                    </CardSubtitle>
                    <CardSubtitle className="stock-subtitle">
                      <strong>stock: {instStock}</strong>
                    </CardSubtitle>
                    <Button className="button is-primary is-outlined" 
                      onClick={() => this.addToCart({ id: instrumentId, uid: clientID, amount: 1 })}>
                      <FaShoppingCart style={{ marginRight: '5px' }} /> Ajouter au panier
                    </Button>
                  </CardBody>
                </Col>
              </td>
            </tr>
            <tr>
              <td className="fixed-width" >
                
              <RatingStars onRatingChange={(newRating) => console.log('New Rating:', newRating)} clientId={{clientID}} instId={instrumentId}/>
              
              </td>
              <td colSpan="2">
              <div className="rating">
                {this.renderReviews()}
                </div>
            <hr /></td>
            </tr>
            
            </table>
        </Card>
      
    );
  }
}

export default ProductView;
