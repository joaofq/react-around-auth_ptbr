import React from 'react';
import PopupWithForm from './PopupWithForm';

function InfoTooltip(props) {
  console.log('abrepopup');

  return (
    <PopupWithForm
      name="login"
      isOpen={props.isOpen}
      onClose={props.onClose}
      action={`Login ${props.valid ? 'success' : 'Failure'}`}
      button="info-tooltip"
    >
      <div
        className={`popup__icon ${
          props.valid ? 'success-icon' : 'falure-icon'
        }`}
      ></div>
      <p className="popup__text">
        {props.valid
          ? 'Vitória! Cadastro realizado com sucesso!'
          : 'Ops, algo saiu errado! Por favor, tente novamente.'}
      </p>
    </PopupWithForm>
  );
}

export default InfoTooltip;
