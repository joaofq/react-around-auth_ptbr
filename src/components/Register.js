import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function Register(props) {
  return (
    <main className="main">
      <Header />
      <h2 className="register__title">Inscrever-se</h2>
      <form className="register__form">
        <input
          className="register__form_input"
          type="email"
          placeholder="E-mail"
          required
        />
        <span className="form__error"></span>
        <input
          className="register__form_input"
          type="password"
          placeholder="Password"
          required
          minLength="8"
        />
        <span className="form__error"></span>
        <button
          className="register__form_button"
          type="submit"
          aria-labe="Sign Up"
        >
          Sign up
        </button>
        <Link exact to="/signin" className="register__form_link">
          Already a member? Log in here!
        </Link>
      </form>
      <Footer />
    </main>
  );
}

export default Register;
