import "./pages/index.css";
import { initialCards } from "./scripts/initialData";
import { validationConfig, DOM_SELECTORS } from "./scripts/settings.js";
import { createProfileUtils } from "./scripts/components/profileUtils.js";
import { createPopupUtils } from "./scripts/components/modalWindows";
import { createCardUtils } from "./scripts/components/card";
import {
  enableValidation,
  clearValidation,
} from "./scripts/components/validation/validator.js";
import {
  getUserInfo,
  getInitialCards,
  editProfile,
  addCard,
  deleteCard,
  likeCard,
  dislikeCard,
  updateAvatar,
} from "./scripts/api/api.js";

// Утилиты работы с DOM
const cacheDomElements = () => {
  const elements = {};
  Object.entries(DOM_SELECTORS).forEach(([key, selector]) => {
    elements[key] = document.querySelector(selector);
  });
  elements.cardTemplate = elements.cardTemplate.content;
  return elements;
};

// Инициализация приложения
const initApp = () => {
  const domElements = cacheDomElements();
  const popupUtils = createPopupUtils();
  const profileUtils = createProfileUtils(domElements, popupUtils);

  enableValidation(validationConfig);
  popupUtils.initPopups();

  // Функция для открытия попапа с изображением
  const openImagePopup = (imageUrl, imageAlt) => {
    domElements.imgPopup.src = imageUrl;
    domElements.imgPopup.alt = imageAlt;
    domElements.namePopup.textContent = imageAlt;
    popupUtils.openPopup(domElements.imgContainerPopup);
  };

  // Функция для обработки создания карточки
  const handleCardFormSubmit = (evt) => {
    evt.preventDefault();
    const name = domElements.inputName.value;
    const link = domElements.inputUrl.value;
    cardUtils.addCard({ name, link });
    popupUtils.closePopup(domElements.newCardPopup);
    domElements.newCardForm.reset();
  };

  const cardUtils = createCardUtils(domElements, popupUtils, openImagePopup);

  function initRenderProfile(userData) {
    domElements.profileTitle.textContent = userData.name;
    domElements.profileDescription.textContent = userData.about;
  }
  // Загрузка начальных данных
  Promise.all([getUserInfo(), getInitialCards()])
    .then(([userData, cards]) => {
      initRenderProfile(userData);
      cardUtils.renderInitialCards(cards);
    })
    .catch((err) => {
      console.error("Ошибка при загрузке данных:", err);
      cardUtils.renderInitialCards(initialCards);
    });

  // Настройка обработчиков событий
  const setupEventListeners = () => {
    // Карточки
    domElements.addButtonCard.addEventListener("click", () => {
      clearValidation(domElements.newCardForm, validationConfig);
      domElements.newCardForm.reset();
      popupUtils.openPopup(domElements.newCardPopup);

    });

    domElements.newCardForm.addEventListener("submit", handleCardFormSubmit);

    // Профиль
    domElements.addButtonEditProfile.addEventListener("click", () => {
      clearValidation(domElements.editCardForm, validationConfig);
      profileUtils.fillProfileFormWithCurrentData();
      popupUtils.openPopup(domElements.editCardPopup);
    });

    domElements.editCardForm.addEventListener(
      "submit",
      profileUtils.handleProfileFormSubmit
    );
  };

  setupEventListeners();
};

document.addEventListener("DOMContentLoaded", initApp);
