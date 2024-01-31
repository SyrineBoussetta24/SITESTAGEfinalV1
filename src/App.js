import React, { Component } from "react";
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";
import Login from "./components/Login";
import ProductList from "./components/ProductList";
import ProductCatList from "./components/ProductCatList";
import ProductListAdmin from "./components/ProductListAdmin";
import AddProduct from "./components/AddProduct";
import AddCategorie from "./components/AddCategorie";
import ProductListByCat from "./components/ProductListByCat";
import Cart from "./components/Cart";
import {data, fetchData} from "./Data";
import Context from "./Context";
import "./index.css";
import Signup from "./components/signup";
import CategoryListAdmin from "./components/CategoryListAdmin";
import ModifierInstrument from "./components/ModifierInstrument";
import modifierCategorie from "./components/modifierCategorie";
import ProductView from "./components/ProductView" ;
import Checkout from "./components/checkout";


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      cart: {},
      products: [],
      categories: [],
      cart_num: 0
    };

    this.routerRef = React.createRef();
  }
  login = (usn, pwd) => {
    let user = data.users[0].users.find(u => u.username === usn && u.password === pwd);
    if (user) {
      this.setState({ user });
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    }
    return false;
  };
  signup = (firstName, lastName, email, password) => {
    
    const newUser = {
      firstName,
      lastName,
      email,
      password, 
      accessLevel: 0, 
    };
  
    this.setState({ user: newUser });
  
    localStorage.setItem("user", JSON.stringify(newUser));
  
    return true; 
  };
  
  logout = e => {
    e.preventDefault();
    this.setState({ user: null });
    localStorage.removeItem("user");
  };

  addProduct = (product, callback) => {
    let products = this.state.products.slice();
    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));
    this.setState({ products }, () => callback && callback());
  };

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
        // If successful, update the local state and storage
        this.updateCartCount(1)
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
  

  checkout = () => {
    if (!this.state.user) {
      this.routerRef.current.history.push("/login");
      return;
    }
    const cart = this.state.cart;
    const products = this.state.products.map(p => {
      if (cart[p.name]) {
        p.stock = p.stock - cart[p.name].amount;
      }
      return p;
    });
    this.setState({ products });
    this.clearCart();
  };

  removeFromCart = (cartItemId, userId) => {
    // Prepare the request payload
    const requestBody = {
        userId: userId,
        idIns: cartItemId,
    };

    // Make a POST request
    fetch('http://127.0.0.1:8086/api/supprimer-panier', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Add any other headers if needed
        },
        body: JSON.stringify(requestBody),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Handle the response data as needed
        let cart = this.state.cart;
        delete cart[cartItemId];
        localStorage.setItem('cart', JSON.stringify(cart));
        this.setState({ cart });

        // Add the following lines
        //this.props.history.push('/cart');
        
        window.location.reload();
    })
    .catch(error => {
        // Handle errors
        console.error('There was a problem with the fetch operation:', error);
    });
};



clearCart = (userId) => {
  // Assuming you have a server endpoint for clearCart
  const apiUrl = 'http://127.0.0.1:8086/api/reset-panier';

  // Create the request body with the userId
  const requestBody = {
    userId: userId,
  };

  // Make the POST API call
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add any other headers if needed
    },
    body: JSON.stringify(requestBody),
  })
    .then(response => response.json())
    .then(data => {
      // Assuming the server responds with updated cart data
      localStorage.setItem("cart", JSON.stringify(data));
      this.setState({ cart: data });
      window.location.reload();
    })
    .catch(error => {
      // Handle errors if any
      console.error('Error during clearCart API call:', error);
    });
};

updateCartCount = (newCount) => {
  // Make a POST request to your API with the new count and user ID
  fetch(`http://127.0.0.1:8086/api/read-cart-num`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: this.state.user.usersid, // Assuming userId is available in state
    }),
  })
  .then(response => response.json())
  .then(data => {
    // Update the state with the cart count from the API response
    this.setState(prevState => ({
      user: {
        ...prevState.user,
        cart: data.cart_num,
      }
    }), () => {
      // Access the element with id "B66" and modify its content with the new cart count
      const element = document.getElementById("B66");
      if (element) {
        element.textContent = data.num;
      }
    });
  })
  .catch(error => {
    console.error('Error updating cart count:', error);
  });
};



  async componentDidMount() {
    try 
    { 
        await fetchData();
        let products = localStorage.getItem("products");
        let cart = localStorage.getItem("cart");
        let user = localStorage.getItem("user");
        let categories = localStorage.getItem("categories")
        console.log(data)
        console.log(user)
        console.log('*', data.initProducts[0].initProducts)
        products = products ? JSON.parse(products) : data.initProducts[0].initProducts;
        products = data.initProducts[0].initProducts;
        categories = data.categories[0].cats;
        console.log(categories)
        cart = cart ? JSON.parse(cart) : {};
        user = user ? JSON.parse(user) : null;
        console.log(user)
        this.setState({ categories, products, user, cart });
        this.updateCartCount(0)
    }
    catch (error) {
      console.error('Error during component mount:', error);
    }
  }

  render() {
    return (
      <Context.Provider
        value={{
          ...this.state,
          removeFromCart: this.removeFromCart,
          addToCart: this.addToCart,
          login: this.login,
          signup:this.signup,
          addProduct: this.addProduct,
          addCategorie :this.addCategorie,
          clearCart: this.clearCart,
          checkout: this.checkout
        }}
      >
        <Router ref={this.routerRef}>
          <div className="App">
            <nav
              className="navbar container"
              role="navigation"
              aria-label="main navigation"
            >
              <div className="navbar-brand">
                <b className="navbar-item is-size-4 ">E-Commerce</b>

                <a
                  href="/"
                  role="button"
                  className="navbar-burger burger"
                  aria-label="menu"
                  aria-expanded="false"
                  data-target="navbarBasicExample"
                  onClick={e => {
                    e.preventDefault();
                    this.setState({ showMenu: !this.state.showMenu });
                  }}
                >
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                </a>
              </div>
              <div
                className={`navbar-menu ${
                  this.state.showMenu ? "is-active" : ""
                }`}
              >
                <div className="navbar-item has-dropdown is-hoverable">
                  <p  className="navbar-link">  Instruments </p>
                  <div className="navbar-dropdown">
                    <Link to="/products" className="navbar-item">
                      Liste Instruments
                    </Link>
                    
                    {this.state.user && this.state.user.accessLevel < 1 && (
                      <Link to="/add-product" className="navbar-item">
                        Ajouter Instrument
                      </Link>
                    )}
                    </div>
                  </div>

                  {this.state.user && this.state.user.accessLevel <1  && (
                  <div className="navbar-item has-dropdown is-hoverable">
                  <p  className="navbar-link">  Categories </p>
                  <div className="navbar-dropdown">
                  
                    <Link to="/categorieListAdmin" className="navbar-item">
                      Liste Categories
                    </Link>
                  <Link to="/add-categorie" className="navbar-item">
                  Ajouter Categorie
                  </Link>
                </div>
                </div>
                )}
                 {this.state.user && this.state.user.accessLevel > 0 && (
                <Link to="/cart" className="navbar-item">
                  Panier
                  <span
                    id="B66"
                    className="tag is-primary"
                    style={{ marginLeft: "5px" }}
                  >
                   
                  </span>
                </Link>)}
                
                {!this.state.user ? (
                  <Link to="/login" className="navbar-item">
                    se connecter
                  </Link>
                ) : (
                  <a href="/" className="navbar-item" onClick={this.logout}>
                    Se déconnecter
                  </a>
                )}
                <Link to="/signup" className="navbar-item">
                    S'inscrire
                  </Link>
              </div>
            </nav>
            <Switch>
            
            {this.state.user && this.state.user.accessLevel > 0 && (
              <Route exact path="/" component={ProductCatList} />)}
              {this.state.user && this.state.user.accessLevel <= 0 && (
              <Route exact path="/" component={ProductListAdmin} />)}
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/checkout" component={Checkout} /> 
 
              <Route exact path="/cart" component={Cart} />
              <Route exact path="/add-product" component={AddProduct} />
              <Route exact path="/products-cat" component={ProductListByCat} />
              <Route path="/" exact component={ProductListAdmin} />
              <Route path="/ModifierInstrument" component={ModifierInstrument} />
              <Route exact path="/add-categorie" component={AddCategorie} />
              {this.state.user && this.state.user.accessLevel > 0 && (
              <Route exact path="/products" component={ProductList} />)}
              {this.state.user && this.state.user.accessLevel <= 0  && (
              <Route exact path="/products" component={ProductListAdmin} />)}
                <Route path="/categorieListAdmin" component={CategoryListAdmin} />
                <Route path="/ModifierCategorie" component={modifierCategorie} />
                <Route path="/product-details" component={ProductView} />

            </Switch>
          </div>
        </Router>
      </Context.Provider>
    );
  }
}
