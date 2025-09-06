import {
  addCard as apiAddCard,
  deleteCard as apiDeleteCard,
  likeCard as apiLikeCard,
  dislikeCard as apiUnlikeCard,
} from "../api/api";

const currentUserId = "86912a5de8fb5c0ddfcf9a3b";

export const createCardUtils = (domElements, popupUtils, openImagePopup) => {
  // Функция проверки существования элемента перед добавлением обработчика
  const safeAddEventListener = (element, event, handler) => {
    if (element) {
      element.addEventListener(event, handler);
    } else {
      console.warn("Элемент не найден для добавления обработчика события");
    }
  };

  const createCardElement = ({ name, link, likes = [], _id, owner = {} }) => {
    // Проверка обязательных полей
    if (!_id || !name || !link) {
      console.error("Неполные данные карточки:", { name, link, _id, owner });
      return null;
    }

    try {
      const cardElement = domElements.cardTemplate
        .querySelector(".places__item")
        .cloneNode(true);

      const cardImage = cardElement.querySelector(".card__image");
      cardImage.src = link;
      cardImage.alt = name;

      const likeCountElement = cardElement.querySelector(".card__like-count");
      if (likeCountElement) {
        likeCountElement.textContent = likes.length;
      }

      const titleElement = cardElement.querySelector(".card__title");
      if (titleElement) {
        titleElement.textContent = name;
      }

      console.log("id", _id);
      cardElement.dataset.cardId = _id;

      // Проверяем, лайкнул ли текущий пользователь карточку
      const isLiked = likes.some(user => user && user._id === currentUserId);
      const likeButton = cardElement.querySelector(".card__like-button");
      if (likeButton && isLiked) {
        likeButton.classList.add("card__like-button_is-active");
      }

      // Показываем иконку удаления только для своих карточек
      const deleteButton = cardElement.querySelector(".card__delete-button");
      if (deleteButton) {
        if (owner._id !== currentUserId) {
          deleteButton.remove();
        }
      }

      if (cardImage) {
        cardImage.addEventListener("click", () => openImagePopup(link, name));
      }

      return cardElement;
    } catch (error) {
      console.error("Ошибка при создании элемента карточки:", error);
      return null;
    }
  };

  const renderCard = (cardData, position = "start") => {
    const cardElement = createCardElement(cardData);
    
    if (!cardElement) {
      console.warn("Не удалось создать элемент карточки", cardData);
      return;
    }
    
    setupCardEventListeners(cardElement);

    if (position === "end") {
      domElements.cardsContainer.append(cardElement);
    } else {
      domElements.cardsContainer.prepend(cardElement);
    }
  };

  const addCard = (cardData) => {
    const submitButton = domElements.newCardForm?.querySelector(".popup__button");
    const originalButtonText = submitButton?.textContent || "Создать";
    
    if (submitButton) {
      submitButton.textContent = "Создание...";
      submitButton.disabled = true;
    }

    return apiAddCard({ name: cardData.name, link: cardData.link })
      .then((newCard) => {
        renderCard(newCard);
      })
      .catch((err) => {
        console.error("Ошибка при создании карточки:", err);
        throw err;
      })
      .finally(() => {
        if (submitButton) {
          submitButton.textContent = originalButtonText;
          submitButton.disabled = false;
        }
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
    
    if (!cardElement) return;
    
    const cardId = cardElement.dataset.cardId;
    const likeCounter = cardElement.querySelector(".card__like-count");
    const isLiked = likeButton.classList.contains("card__like-button_is-active");

    likeButton.disabled = true;
    const currentCount = parseInt(likeCounter?.textContent) || 0;
    
    if (likeCounter) {
      likeCounter.textContent = isLiked ? currentCount - 1 : currentCount + 1;
    }
    
    likeButton.classList.toggle("card__like-button_is-active");

    const apiCall = isLiked ? apiUnlikeCard(cardId) : apiLikeCard(cardId);

    apiCall
      .then((updatedCard) => {
        if (likeCounter) {
          likeCounter.textContent = updatedCard.likes.length;
        }

        const isActuallyLiked = updatedCard.likes.some(
          (user) => user && user._id === currentUserId
        );

        if (isActuallyLiked) {
          likeButton.classList.add("card__like-button_is-active");
        } else {
          likeButton.classList.remove("card__like-button_is-active");
        }
      })
      .catch((err) => {
        console.error("Ошибка при обновлении лайка:", err);
        if (likeCounter) {
          likeCounter.textContent = currentCount;
        }
        likeButton.classList.toggle("card__like-button_is-active");
      })
      .finally(() => {
        likeButton.disabled = false;
      });
  };

  const renderInitialCards = (cards) => {
    if (!cards || !Array.isArray(cards)) {
      console.error("Некорректные данные карточек:", cards);
      return;
    }
    
    cards.forEach((cardData) => {
      if (cardData && cardData._id) {
        renderCard(cardData, "end");
      } else {
        console.warn("Пропущена карточка с неполными данными:", cardData);
      }
    });
  };

  const setupCardEventListeners = (cardElement) => {
    if (!cardElement) return;

    const likeButton = cardElement.querySelector(".card__like-button");
    const deleteButton = cardElement.querySelector(".card__delete-button");

    safeAddEventListener(likeButton, "click", handleLikeClick);
    
    if (deleteButton) {
      safeAddEventListener(deleteButton, "click", () => deleteCard(cardElement));
    }
  };

  return {
    renderInitialCards,
    addCard,
  };
};