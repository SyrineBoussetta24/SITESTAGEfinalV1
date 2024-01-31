import React, { useState } from "react";
import "./signup.css";

export default function Checkout() {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    total: "",
  });

  const handleInputChange = (event) => {
    event.preventDefault();

    const { name, value } = event.target;
    setValues((values) => ({
      ...values,
      [name]: value,
    }));
  };

  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      values.firstName &&
      values.lastName &&
      values.email &&
      values.phoneNumber &&
      values.password &&
      values.address
    ) {
      setValid(true);
      try {
        const response = await fetch('http://127.0.0.1:8086/api/creation-user', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nom: values.firstName,
            prenom: values.lastName,
            mail: values.email,
            tel: values.phoneNumber,
            mdp: values.password,
            total: values.total,
          }),
        });

        if (response.ok) {
          setSubmitted(true);
          this.props.history.push('/login');
          window.location.reload();
        } else {
          console.error("erreur de paiement ", response.statusText);
        }
      } catch (error) {
        console.error("erreur d'enregistrement des données ", error.message);
      }
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div className="form-container">
      <form className="register-form" onSubmit={handleSubmit}>
        {submitted && valid && (
          <div className="success-message">
            <h3>
              {" "}
              Welcome {values.firstName} {values.lastName}{" "}
            </h3>
            <div>Votre paiement a réussi !</div>
          </div>
        )}
        {!valid && (
           
          <div>
            <p className="pay">Paiement</p>
            <label className="label">Prénom: </label>
            <input
              className="form-field"
              type="text"
              placeholder="Enter your first name"
              name="firstName"
              value={values.firstName}
              onChange={handleInputChange}
            />
          </div>
        )}

        {submitted && !values.firstName && (
          <span id="first-name-error">Please enter a first name</span>
        )}

        {!valid && (
          <div>
            <label className="label">Nom: </label>
            <input
              className="form-field"
              type="text"
              placeholder="Enter your last name"
              name="lastName"
              value={values.lastName}
              onChange={handleInputChange}
            />
          </div>
        )}

        {submitted && !values.lastName && (
          <span id="last-name-error">Please enter a last name</span>
        )}

        {!valid && (
          <div>
            <label className="label">Email: </label>
            <input
              className="form-field"
              type="email"
              placeholder="Enter your email"
              name="email"
              value={values.email}
              onChange={handleInputChange}
            />
          </div>
        )}

        {submitted && !values.email && (
          <span id="email-error">Please enter an email address</span>
        )}

        {!valid && (
          <div>
            <label className="label">Numéro de téléphone : </label>
            <input
              className="form-field"
              type="text"
              placeholder="Enter your phone number"
              name="phoneNumber"
              value={values.phoneNumber}
              onChange={handleInputChange}
            />
          </div>
        )}

        {submitted && !values.phoneNumber && (
          <span id="phone-number-error">Please enter a phone number</span>
        )}

        {!valid && (
          <div>
            <label className="label">Mot de passe : </label>
            <input
              className="form-field"
              type="password"
              placeholder="Enter your password"
              name="password"
              value={values.password}
              onChange={handleInputChange}
            />
          </div>
        )}

        {submitted && !values.password && (
          <span id="password-error">Please enter a password</span>
        )}

        {!valid && (
          <div>
            <label className="label">Total à payer : </label>
            <input
              className="form-field"
              type="text"
              placeholder=" "
              name="total"
              value={values.total}
              onChange={handleInputChange}
            />
          </div>
        )}

        {submitted && !values.total && (
          <span id="address-error"> </span>
        )}

        {!valid && (
          <button  type="submit" className="button is-primary is-outlined is-pulled-right">
            payer
          </button>
        )}
      </form>
    </div>
  );
}
