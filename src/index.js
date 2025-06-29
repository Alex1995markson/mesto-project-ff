import "./pages/index.css";
import { initialCards } from "./scripts/initialData";
import { createPopupUtils } from "./scripts/components/modalWindows";
import { createCardUtils } from "./scripts/components/card";

// Константы DOM элементов
const DOM_SELECTORS = {
  // Элементы профиля
  profileTitle: ".profile__title",
  profileDescription: ".profile__description",
  addButtonEditProfile: ".profile__edit-button",

  // Элементы карточек
  addButtonCard: ".profile__add-button",
  cardsContainer: ".places__list",
  cardTemplate: "#card-template",

  // Попапы и их элементы
  editCardPopup: ".popup_type_edit",
  editCardForm: ".popup_type_edit .popup__form",
  editInputName: ".popup__input_type_name",
  editInputDescription: ".popup__input_type_description",

  newCardPopup: ".popup_type_new-card",
  newCardForm: ".popup_type_new-card .popup__form",
  inputName: ".popup__input_type_card-name",
  inputUrl: ".popup__input_type_url",

  imgContainerPopup: ".popup_type_image",
  imgPopup: ".popup__image",
  namePopup: ".popup__caption",

  closeNewCardButton: ".popup__close",
};

// Утилиты работы с DOM
const cacheDomElements = () => {
  const elements = {};
  Object.entries(DOM_SELECTORS).forEach(([key, selector]) => {
    elements[key] = document.querySelector(selector);
  });
  elements.cardTemplate = elements.cardTemplate.content;
  return elements;
};

// Утилиты работы с профилем
const createProfileUtils = (domElements, popupUtils) => {
  const fillProfileForm = () => {
    domElements.editInputName.value = domElements.profileTitle.textContent;
    domElements.editInputDescription.value =
      domElements.profileDescription.textContent;
  };

  const handleEditFormSubmit = (evt) => {
    evt.preventDefault();
    domElements.profileTitle.textContent = domElements.editInputName.value;
    domElements.profileDescription.textContent =
      domElements.editInputDescription.value;
    popupUtils.closePopup(domElements.editCardPopup);
  };

  return {
    fillProfileForm,
    handleEditFormSubmit,
  };
};

// Инициализация приложения
const initApp = () => {
  const domElements = cacheDomElements();
  const popupUtils = createPopupUtils();
  const profileUtils = createProfileUtils(domElements, popupUtils);

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

  // Инициализация утилит
  popupUtils.initPopups();
  const cardUtils = createCardUtils(domElements, popupUtils, openImagePopup);

  // Загрузка начальных данных
  cardUtils.renderInitialCards(initialCards);

  // Настройка обработчиков событий
  const setupEventListeners = () => {
    // Карточки
    domElements.addButtonCard.addEventListener("click", () => {
      popupUtils.openPopup(domElements.newCardPopup);
    });

    domElements.newCardForm.addEventListener("submit", handleCardFormSubmit);

    // Профиль
    domElements.addButtonEditProfile.addEventListener("click", () => {
      profileUtils.fillProfileForm();
      popupUtils.openPopup(domElements.editCardPopup);
    });

    domElements.editCardForm.addEventListener(
      "submit",
      profileUtils.handleEditFormSubmit
    );
  };

  setupEventListeners();
};

// Запуск приложения после загрузки DOM
document.addEventListener("DOMContentLoaded", initApp);
