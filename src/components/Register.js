import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function Register(props) {
  return (
    <main className="main">
      <Header>
        <Link to="./signin" className="header__link">
          Entrar
        </Link>
      </Header>
      <h2 className="form__title">Inscrever-se</h2>
      <form className="form">
        <input
          className="form__input"
          type="email"
          placeholder="E-mail"
          required
        />
        <span className="form__error"></span>
        <input
          className="form__input"
          type="password"
          placeholder="Password"
          required
          minLength="8"
        />
        <span className="form__error"></span>
        <button className="form__button" type="submit" aria-labe="Sign Up">
          Sign up
        </button>
        <Link exact to="/signin" className="form__link">
          Já é um membro? Faça o login aqui!{' '}
        </Link>
      </form>
      <Footer />
    </main>
  );
}

export default Register;
