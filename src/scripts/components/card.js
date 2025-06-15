const createCardUtils = (domElements, popupUtils) => {
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

  const openImagePopup = (imageUrl, imageAlt) => {
    domElements.imgPopup.src = imageUrl;
    domElements.imgPopup.alt = imageAlt;
    domElements.namePopup.textContent = imageAlt;
    popupUtils.openPopup(domElements.imgContainerPopup);
  };

  const handleLikeClick = (evt) => {
    evt.target.classList.toggle("card__like-button_is-active");
  };

  const deleteCard = (cardElement) => {
    cardElement.remove();
  };

  const setupCardEventListeners = (cardElement) => {
    cardElement
      .querySelector(".card__like-button")
      .addEventListener("click", handleLikeClick);

    cardElement
      .querySelector(".card__delete-button")
      .addEventListener("click", () => deleteCard(cardElement));
  };

  const addCard = (cardData) => {
    const cardElement = createCardElement(cardData);
    setupCardEventListeners(cardElement);
    domElements.cardsContainer.append(cardElement);
  };

  const renderInitialCards = (cards) => {
    cards.forEach((cardData) => addCard(cardData));
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
    handleFormSubmit,
    addCard,
    openImagePopup
  };
};