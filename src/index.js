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
import { createProfileManager } from "./scripts/components/profileManager.js";

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
  const cardUtils = createCardUtils(domElements, popupUtils, openImagePopup);
  const profileManager = createProfileManager(
    domElements,
    cardUtils,
    initialCards
  );

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

  // Загрузка начальных данных
  profileManager.loadInitialData();

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

    // Аватар
    domElements.profileImage.addEventListener("click", () => {
      clearValidation(domElements.avatarEditForm, validationConfig);
      domElements.avatarEditForm.reset();
      popupUtils.openPopup(domElements.avatarEditPopup);
    });

    domElements.avatarEditForm.addEventListener(
      "submit",
      profileUtils.handleAvatarFormSubmit
    );
  };

  setupEventListeners();
};

document.addEventListener("DOMContentLoaded", initApp);
