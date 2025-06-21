export const createCardUtils = (domElements, popupUtils) => {
  const createCardElement = ({ name, link }) => {
    const cardElement = domElements.cardTemplate
      .querySelector(".places__item")
      .cloneNode(true);

    const cardImage = cardElement.querySelector(".card__image");
    cardImage.src = link;
    cardImage.alt = name;

    cardElement.querySelector(".card__title").textContent = name;
    cardImage.addEventListener("click", () => openImagePopup(link, name));

    return cardElement;
  };
  // создаем свой popup с открытием нужной нам картинки
  const openImagePopup = (imageUrl, imageAlt) => {
    domElements.imgPopup.src = imageUrl;
    domElements.imgPopup.alt = imageAlt;
    domElements.namePopup.textContent = imageAlt;
    popupUtils.openPopup(domElements.imgContainerPopup);
  };

  const addCard = (cardData, position = "start") => {
    const cardElement = createCardElement(cardData);
    setupCardEventListeners(cardElement);
    if (position === "end") {
      domElements.cardsContainer.append(cardElement);
    } else {
      domElements.cardsContainer.prepend(cardElement); // По умолчанию добавляем в начало
    }
  };
  const deleteCard = (cardElement) => {
    cardElement.remove();
  };
  const handleLikeClick = (evt) => {
    evt.target.classList.toggle("card__like-button_is-active");
  };

  const renderInitialCards = (cards) => {
    cards.forEach((cardData) => addCard(cardData));
  };

  const setupCardEventListeners = (cardElement) => {
    cardElement
      .querySelector(".card__like-button")
      .addEventListener("click", handleLikeClick);

    cardElement
      .querySelector(".card__delete-button")
      .addEventListener("click", () => deleteCard(cardElement));
  };

  const handleFormSubmit = (evt) => {
    evt.preventDefault();
    const name = domElements.inputName.value;
    const link = domElements.inputUrl.value;

    addCard({ name, link });
    popupUtils.closePopup(domElements.newCardPopup);
    domElements.newCardForm.reset();
  };

  return {
    renderInitialCards,
    addCard,
    handleFormSubmit,
  };
};
