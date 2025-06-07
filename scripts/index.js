// Константы DOM элементов
const DOM_SELECTORS = {
  addButton: ".profile__add-button",
  cardsContainer: ".places__list",
  newCardPopup: ".popup_type_new-card",
  closeNewCardButton: ".popup__close",
  cardTemplate: "#card-template",
  newCardForm: ".popup_type_new-card .popup__form",
  inputName: ".popup__input_type_card-name",
  inputUrl: ".popup__input_type_url",
  imgContainerPopup: ".popup_type_image",
  imgPopup: ".popup__image",
  namePopup: ".popup__caption",
};

// Кэширование DOM элементов
const domElements = {
  addButton: document.querySelector(DOM_SELECTORS.addButton),
  cardsContainer: document.querySelector(DOM_SELECTORS.cardsContainer),
  newCardPopup: document.querySelector(DOM_SELECTORS.newCardPopup),
  cardTemplate: document.querySelector(DOM_SELECTORS.cardTemplate).content,
  inputName: document.querySelector(DOM_SELECTORS.inputName),
  inputUrl: document.querySelector(DOM_SELECTORS.inputUrl),
  newCardForm: document.querySelector(DOM_SELECTORS.newCardForm),
  imgContainerPopup: document.querySelector(DOM_SELECTORS.imgContainerPopup),
  imgPopup: document.querySelector(DOM_SELECTORS.imgPopup),
  namePopup: document.querySelector(DOM_SELECTORS.namePopup),
};

// Утилиты для работы с попапами
const popupUtils = {
  open(popup) {
    popup.classList.add("popup_is-opened");
    document.addEventListener("keydown", this.handleEscapeKey);
  },

  close(popup) {
    popup.classList.remove("popup_is-opened");
    document.removeEventListener("keydown", this.handleEscapeKey);
  },

  handleEscapeKey(evt) {
    if (evt.key === "Escape") {
      const openedPopup = document.querySelector(".popup_is-opened");
      if (openedPopup) {
        this.close(openedPopup);
      }
    }
  },

  handleOverlayClick(evt) {
    if (evt.target === evt.currentTarget) {
      this.close(evt.currentTarget);
    }
  },
};

// Функции для работы с карточками
const cardUtils = {
  createCardElement({ name, link }) {
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
    popupUtils.open(domElements.imgContainerPopup);
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
    popupUtils.open(domElements.newCardPopup)
  );

  domElements.newCardPopup
    .querySelector(DOM_SELECTORS.closeNewCardButton)
    .addEventListener("click", () =>
      popupUtils.close(domElements.newCardPopup)
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
    popupUtils.close(domElements.imgContainerPopup);
  });
}

// Запуск приложения после загрузки DOM
document.addEventListener("DOMContentLoaded", initApp);
