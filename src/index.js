import "./pages/index.css";
import { initialCards } from "./scripts/initial_data";
import { createPopupUtils } from "./scripts/components/modal_windows";
import { createCardUtils } from "./scripts/components/card";
// Константы DOM элементов
const DOM_SELECTORS = {
  addButtonCard: ".profile__add-button", // добавить новую карточку
  addButtonEditProfile: ".profile__edit-button",
  cardsContainer: ".places__list", // место для карточкек

  newCardPopup: ".popup_type_new-card", // новая карточка попап
  newCardForm: ".popup_type_new-card .popup__form", // форма для новой карточки
  inputName: ".popup__input_type_card-name",
  inputUrl: ".popup__input_type_url",

  editCardPopup: ".popup_type_edit", // попад для редактирования профиля
  editCardForm: ".popup_type_edit .popup__form",
  editInputName: ".popup__input_type_name",
  editInputDescription: ".popup__input_type_description",
  closeNewCardButton: ".popup__close", // значок закрытия попапа

  imgContainerPopup: ".popup_type_image", // попап всплывающее окно с картинкой
  imgPopup: ".popup__image",
  namePopup: ".popup__caption",

  // p для имя и описания
  profileTitle: ".profile__title",
  profileDescription: ".profile__description",

  cardTemplate: "#card-template", // шаблон для создания карточек
};

// кэшируем переменные DOM
const cacheDomElements = () => {
  const elements = {};

  Object.entries(DOM_SELECTORS).forEach(([key, selector]) => {
    elements[key] = document.querySelector(selector);
  });
  elements.cardTemplate = elements.cardTemplate.content;

  return elements;
};

const domElements = cacheDomElements();
const popupUtils = createPopupUtils();

const cardUtils = createCardUtils(domElements, popupUtils);

const profileUtils = {
  fillProfileForm: () => {
    domElements.editInputName.value = domElements.profileTitle.textContent;
    domElements.editInputDescription.value =
      domElements.profileDescription.textContent;
  },

  handleEditFormSubmit: (evt) => {
    evt.preventDefault();

    domElements.profileTitle.textContent = domElements.editInputName.value;
    domElements.profileDescription.textContent =
      domElements.editInputDescription.value;

    popupUtils.closePopup(domElements.editCardPopup);
  },
};

// Инициализация приложения
function initApp() {
  // Рендер начальных карточек
  cardUtils.renderInitialCards(initialCards);

  // Настройка обработчиков событий (появление попада для добавления картинки)
  domElements.addButtonCard.addEventListener("click", () =>
    popupUtils.openPopup(domElements.newCardPopup)
  );
  // Настройка обработчиков событий (появление попада для редактирования подписи профиля)
  domElements.addButtonEditProfile.addEventListener("click", () => {
    profileUtils.fillProfileForm();
    popupUtils.openPopup(domElements.editCardPopup);
  });
  // Добавляем обработчики событий (закрытия изображения и подписи)
  domElements.imgContainerPopup.addEventListener("click", () => {
    popupUtils.closePopup(domElements.imgContainerPopup);
  });
  domElements.editCardForm.addEventListener(
    "submit",
    profileUtils.handleEditFormSubmit
  );

  domElements.newCardForm.addEventListener(
    "submit",
    cardUtils.handleFormSubmit
  );
}

// Запуск приложения после загрузки DOM
document.addEventListener("DOMContentLoaded", initApp);
