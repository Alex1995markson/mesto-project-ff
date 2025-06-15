import "./pages/index.css";
import { initialCards } from "./scripts/initial_data";
import {createPopupUtils} from "./scripts/components/model"

// Константы DOM элементов
const DOM_SELECTORS = {
  addButton: ".profile__add-button", // добавить новую карточку
  cardsContainer: ".places__list",   // место для карточкек

  newCardPopup: ".popup_type_new-card", // новая карточка попап
  newCardForm: ".popup_type_new-card .popup__form", // форма для новой карточки
  inputName: ".popup__input_type_card-name",
  inputUrl: ".popup__input_type_url",

  editCardPopup: ".popup_type_edit", // попад для редактирования профиля
  editCardForm: ".popup_type_edit .popup__form",
  editInputName: ".popup__input_type_name",
  editInputDescription: ".popup__input_type_description",
  closeNewCardButton: ".popup__close",  // значок закрытия попапа

  imgContainerPopup: ".popup_type_image", // попап всплывающее окно с картинкой
  imgPopup: ".popup__image",
  namePopup: ".popup__caption",

  cardTemplate: "#card-template", // шаблон для создания карточек
};

// кэшируем переменные DOM
const cacheDomElements = () => {
  const elements = {};
  
  Object.entries(DOM_SELECTORS).forEach(([key, selector]) => {
    elements[key] = document.querySelector(selector)
  });
  elements.cardTemplate = elements.cardTemplate.content;
  
  return elements;
};

const domElements = cacheDomElements()
const popupUtils = createPopupUtils();

// Функции для работы с карточками
const cardUtils = {
  createCardElement({ name, link }) {
    // пересмотреть как можно обозначить эту переменную
    const cardElement = domElements.cardTemplate
      .querySelector(".places__item")
      .cloneNode(true);

    const cardImage = cardElement.querySelector(".card__image");
    cardImage.src = link;
    cardImage.alt = name;

    cardElement.querySelector(".card__title").textContent = name;

    // Добавляем обработчик клика на изображение
    cardImage.addEventListener("click", () => this.openImagePopup(link, name));

    return cardElement;
  },

  openImagePopup(imageUrl, imageAlt) {
    // Устанавливаем изображение
    const imgElement = domElements.imgPopup;
    imgElement.src = imageUrl;
    imgElement.alt = imageAlt;

    // Устанавливаем подпись
    const captionElement = domElements.namePopup;
    captionElement.textContent = imageAlt;

    // Открываем попап
    popupUtils.openPopup(domElements.imgContainerPopup);
  },

  setupCardEventListeners(cardElement) {
    cardElement
      .querySelector(".card__like-button")
      .addEventListener("click", this.handleLikeClick);

    cardElement
      .querySelector(".card__delete-button")
      .addEventListener("click", () => this.deleteCard(cardElement));
  },

  handleLikeClick(evt) {
    evt.target.classList.toggle("card__like-button_is-active");
  },

  deleteCard(cardElement) {
    cardElement.remove();
  },

  addCard(cardData) {
    const cardElement = this.createCardElement(cardData);
    this.setupCardEventListeners(cardElement);
    domElements.cardsContainer.append(cardElement);
  },

  renderInitialCards(cards) {
    cards.forEach((cardData) => this.addCard(cardData));
  },

  handleFormSubmit(evt) {
    evt.preventDefault();
    const name = domElements.inputName.value;
    const link = domElements.inputUrl.value;

    this.addCard({ name, link });

    popupUtils.close(domElements.newCardPopup);
    domElements.newCardForm.reset();

    console.log("Форма отправлена:", { name, link });
  },
};

// Инициализация приложения
function initApp() {
  // Рендер начальных карточек
  cardUtils.renderInitialCards(initialCards);

  // Настройка обработчиков событий
  domElements.addButton.addEventListener("click", () =>
    popupUtils.openPopup(domElements.newCardPopup)
  );

  domElements.newCardPopup
    .querySelector(DOM_SELECTORS.closeNewCardButton)
    .addEventListener("click", () =>
      popupUtils.closePopup(domElements.newCardPopup)
    );  

  domElements.newCardPopup.addEventListener(
    "mousedown",
    popupUtils.handleOverlayClick.bind(popupUtils)
  );

  // Обработчик отправки формы
  if (domElements.newCardForm) {
    domElements.newCardForm.addEventListener("submit", (evt) => {
      cardUtils.handleFormSubmit(evt);
    });
  } else {
    console.error(
      "Форма не найдена! Проверьте селектор:",
      DOM_SELECTORS.newCardForm
    );
  }
  // Добавляем обработчики событий
  domElements.imgContainerPopup.addEventListener("click", () => {
    popupUtils.closePopup(domElements.imgContainerPopup);
  });
}

// Запуск приложения после загрузки DOM
document.addEventListener("DOMContentLoaded", initApp);
