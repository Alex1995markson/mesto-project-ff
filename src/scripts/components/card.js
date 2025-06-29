export const createCardUtils = (domElements, popupUtils, openImagePopup) => {
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

  return {
    renderInitialCards,
    addCard,
  };
};
