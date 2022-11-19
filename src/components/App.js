import React, { useEffect } from 'react';
import Login from './Login.js';
import Register from './Register';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import api from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import AddPlacePopup from './AddPlacePopup';
import DeletePopup from './DeletePopup';
import { Route, Switch, useHistory } from 'react-router-dom';
import InfoTooltip from './InfoTooltip.js';
import * as auth from '../utils/auth';
import ProtectedRoute from './ProtectedRoute.js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isSuccessful, setIsSuccessful] = React.useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] =
    React.useState(false);
  const [userData, setUserData] = React.useState({});
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] =
    React.useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);

  const history = useHistory();

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth
        .getContent(jwt)
        .then((res) => {
          const userData = {
            id: res.data._id,
            email: res.data.email,
          };
          setIsLoggedIn(true);
          setUserData(userData);
        })
        .then(() => {
          api.getCardsList().then((initialCards) => {
            setCards(initialCards);
          });
        })
        .then(() => {
          api.getUserInfo().then((data) => {
            setCurrentUser(data);
          });
        })
        .then(() => {
          history.push('/');
        })
        .catch((err) => console.log(err));
    }

    const handleEscClose = (evt) => {
      if (evt.keyCode === 27) {
        closeAllPopups();
      }
    };

    const handleClickOutside = (evt) => {
      if (
        !evt.target.closest('.popup__container') &&
        evt.target.tagName !== 'IMG' &&
        evt.target.tagName !== 'BUTTON'
      ) {
        closeAllPopups();
      }
    };
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscClose);
  }, []);

  function handleSignup(email, password) {
    auth
      .register(email, password)
      .then((res) => {
        if (!res || res.status === 400) {
          setIsInfoTooltipPopupOpen(true);
          throw new Error('Algo deu errado.');
        } else {
          setIsSuccessful(true);
          setIsInfoTooltipPopupOpen(true);
          history.push('/signin');
        }
        return res;
      })
      .catch((err) => console.log(err));
  }

  function handleLogin(email, password) {
    if (!email || !password) {
      return;
    }
    auth
      .authorize(email, password)
      .then((data) => {
        if (!data) {
          throw new Error('Algo deu errado.');
        }
      })
      .then(() => {
        api.getCardsList().then((res) => {
          setCards(res);
        });
      })
      .then(() => {
        api.getUserInfo().then((res) => {
          setCurrentUser(res);
        });
      })
      .then(() => {
        setIsLoggedIn(true);
        setUserData(userData);
        history.push('/');
      })
      .catch((err) => console.log(err));
  }

  function handleSignOut() {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    history.push('/signin');
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleUpdateUser(obj) {
    api.setUserInfo(obj.name, obj.about).then((data) => {
      setCurrentUser(data);
      closeAllPopups();
    });
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleUpdateAvatar(obj) {
    api.setUserAvatar(obj.avatar).then((data) => {
      setCurrentUser(data);
      closeAllPopups();
    });
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleAddPlaceSubmit(obj) {
    api.addCard(obj.placeName, obj.link).then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    });
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
      setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
    });
  }

  function handleDeleteCardClick(card) {
    setSelectedCard(card);
    setIsDeleteCardPopupOpen(true);
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id).then((res) => {
      setCards(cards.filter((c) => c._id !== card._id));
      closeAllPopups();
    });
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
    setIsDeleteCardPopupOpen(false);
  }

  return (
    <div className="page">
      <Switch>
        <Route path="/signin">
          <Login handleLogin={handleLogin} />
        </Route>
        <Route path="/signup">
          <Register handleSignup={handleSignup} />
        </Route>
        <ProtectedRoute path="/" isLoggedIn={isLoggedIn}>
          <CurrentUserContext.Provider value={currentUser}>
            <Header>
              <div className="header__info">
                <p className="header__note">{userData.email}</p>
                <a
                  className="header__link header__link-logout"
                  onClick={handleSignOut}
                >
                  Sair
                </a>
              </div>
            </Header>
            <Main
              onEditProfileClick={handleEditProfileClick}
              onAddPlaceClick={handleAddPlaceClick}
              onEditAvatarClick={handleEditAvatarClick}
              cards={cards}
              onCardLike={handleCardLike}
              onCardClick={handleCardClick}
              onCardDelete={handleDeleteCardClick}
            />
            <Footer />
            <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              onClose={closeAllPopups}
              onUpdateUser={handleUpdateUser}
            />
            <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
              onUpdateAvatar={handleUpdateAvatar}
            />
            <AddPlacePopup
              isOpen={isAddPlacePopupOpen}
              onClose={closeAllPopups}
              onAddPlaceSubmit={handleAddPlaceSubmit}
            />
            <ImagePopup
              card={selectedCard}
              isOpen={isImagePopupOpen}
              onClose={closeAllPopups}
            />
            <DeletePopup
              card={selectedCard}
              isOpen={isDeleteCardPopupOpen}
              onClose={closeAllPopups}
              onDeleteSubmit={handleCardDelete}
            />
          </CurrentUserContext.Provider>
        </ProtectedRoute>
        <InfoTooltip
          valid={isSuccessful}
          isOpen={isInfoTooltipPopupOpen}
          onClose={closeAllPopups}
        />
      </Switch>
    </div>
  );
}

export default App;
