import {
  addCard as apiAddCard,
  deleteCard as apiDeleteCard,
  likeCard as apiLikeCard,
  dislikeCard as apiUnlikeCard,
} from "../api/api";
const currentUserId = "86912a5de8fb5c0ddfcf9a3b";

export const createCardUtils = (domElements, popupUtils, openImagePopup) => {
  const createCardElement = ({ name, link, likes = [], _id, owner }) => {
    const cardElement = domElements.cardTemplate
      .querySelector(".places__item")
      .cloneNode(true);

    const cardImage = cardElement.querySelector(".card__image");
    cardImage.src = link;
    cardImage.alt = name;

    cardElement.querySelector(".card__like-count").textContent = likes.length;
    cardElement.querySelector(".card__title").textContent = name;
    cardElement.dataset.cardId = _id; // Сохраняем ID карточки в data-атрибут

    // Проверяем, лайкнул ли текущий пользователь карточку
    const isLiked = likes.some(user => user._id === currentUserId);
    const likeButton = cardElement.querySelector(".card__like-button");
    if (isLiked) {
      likeButton.classList.add("card__like-button_is-active");
    }

    // Показываем иконку удаления только для своих карточек
    const deleteButton = cardElement.querySelector(".card__delete-button");
    if (owner._id !== currentUserId) {
      deleteButton.remove();
    }

    cardImage.addEventListener("click", () => openImagePopup(link, name));

    return cardElement;
  };

  const renderCard = (cardData, position = "start") => {
    const cardElement = createCardElement(cardData);
    setupCardEventListeners(cardElement);

    if (position === "end") {
      domElements.cardsContainer.append(cardElement);
    } else {
      domElements.cardsContainer.prepend(cardElement);
    }
  };

  const addCard = (cardData) => {
    const submitButton =
      domElements.newCardForm.querySelector(".popup__button");
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = "Создание...";
    submitButton.disabled = true;

    return apiAddCard({ name: cardData.name, link: cardData.link })
      .then((newCard) => {
        renderCard(newCard);
      })
      .catch((err) => {
        console.error("Ошибка при создании карточки:", err);
        throw err;
      })
      .finally(() => {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
      });
  };

  const deleteCard = (cardElement) => {
    const cardId = cardElement.dataset.cardId;
    return apiDeleteCard(cardId)
      .then(() => {
        cardElement.remove();
      })
      .catch((err) => {
        console.error("Ошибка при удалении карточки:", err);
        throw err;
      });
  };

  const handleLikeClick = (evt) => {
    const likeButton = evt.target;
    const cardElement = likeButton.closest(".places__item");
    const cardId = cardElement.dataset.cardId;
    const likeCounter = cardElement.querySelector(".card__like-count");
    const isLiked = likeButton.classList.contains(
      "card__like-button_is-active"
    );

    likeButton.disabled = true;
    const currentCount = parseInt(likeCounter.textContent) || 0;
    likeCounter.textContent = isLiked ? currentCount - 1 : currentCount + 1;
    likeButton.classList.toggle("card__like-button_is-active");

    const apiCall = isLiked ? apiUnlikeCard(cardId) : apiLikeCard(cardId);

    apiCall
      .then((updatedCard) => {
        likeCounter.textContent = updatedCard.likes.length;

        const isActuallyLiked = updatedCard.likes.some(
          (user) => user._id === currentUserId
        );

        if (isActuallyLiked) {
          likeButton.classList.add("card__like-button_is-active");
        } else {
          likeButton.classList.remove("card__like-button_is-active");
        }
      })
      .catch((err) => {
        console.error("Ошибка при обновлении лайка:", err);
        likeCounter.textContent = currentCount;
        likeButton.classList.toggle("card__like-button_is-active");
      })
      .finally(() => {
        likeButton.disabled = false;
      });
  };

  const renderInitialCards = (cards) => {
    cards.forEach((cardData) => renderCard(cardData, "end")); // Для начальных карточек добавляем в конец
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
