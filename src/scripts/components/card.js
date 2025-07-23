import { addCard as apiAddCard } from "../api/api";

export const createCardUtils = (domElements, popupUtils, openImagePopup) => {
  const createCardElement = ({ name, link, likes = [] }) => {
    const cardElement = domElements.cardTemplate
      .querySelector(".places__item")
      .cloneNode(true);

    const cardImage = cardElement.querySelector(".card__image");
    cardImage.src = link;
    cardImage.alt = name;

    cardElement.querySelector(".card__like-count").textContent = likes.length;

    cardElement.querySelector(".card__title").textContent = name;
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
    cardElement.remove();
  };

  const handleLikeClick = (evt) => {
    const likeButton = evt.target;

    // Находим родительский контейнер
    const likeWrapper = likeButton.closest(".card__like-wrapper");
    if (!likeWrapper) {
      console.error("Не найден контейнер лайков");
      return;
    }

    // Находим счетчик
    const likeCounter = likeWrapper.querySelector(".card__like-count");
    if (!likeCounter) {
      console.error("Не найден счетчик лайков");
      return;
    }

    // Переключаем состояние лайка
    const isActive = likeButton.classList.toggle("card__like-button_is-active");

    let currentCount = parseInt(likeCounter.textContent) || 0;
    likeCounter.textContent = isActive ? currentCount + 1 : currentCount - 1;
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
