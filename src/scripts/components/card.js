import {
  deleteCard as apiDeleteCard,
  likeCard as apiLikeCard,
  dislikeCard as apiUnlikeCard,
} from "../api/api";

/**
 * Создаёт DOM-элемент карточки, навешивает ВСЕ слушатели и возвращает элемент.
 *
 * @param {Object} cardData               — данные карточки с бэка: { name, link, likes, _id, owner }
 * @param {Object} deps
 * @param {string} deps.userId            — id текущего пользователя (НЕ захардкожен)
 * @param {(link:string, name:string)=>void} deps.onImageClick — колбэк на клик по изображению
 * @param {(updatedCard:Object)=>void} deps.onLikeChange       — колбэк после успешного лайка/дизлайка
 * @param {(cardId:string)=>void} deps.onDelete                — колбэк после успешного удаления
 * @param {HTMLTemplateElement} deps.cardTemplate              — template с .places__item
 * @returns {HTMLElement|null}
 */
export function createCard(
  cardData,
  { userId, onImageClick, onLikeChange, onDelete, cardTemplate }
) {
  const { name, link, likes = [], _id, owner = {} } = cardData || {};

  if (!_id || !name || !link || !cardTemplate) {
    console.error("Неполные данные для создания карточки:", { cardData });
    return null;
  }

  const cardElement = cardTemplate
    .querySelector(".places__item")
    .cloneNode(true);

  // DOM
  const cardImage = cardElement.querySelector(".card__image");
  const likeCountEl = cardElement.querySelector(".card__like-count");
  const titleEl = cardElement.querySelector(".card__title");
  const likeBtn = cardElement.querySelector(".card__like-button");
  const deleteBtn = cardElement.querySelector(".card__delete-button");

  // Инициализация
  cardElement.dataset.cardId = _id;
  cardImage.src = link;
  cardImage.alt = name;
  if (titleEl) titleEl.textContent = name;
  if (likeCountEl) likeCountEl.textContent = likes.length;

  // Стейт лайка для текущего пользователя
  const isLikedByMe = likes.some((u) => u && u._id === userId);
  if (isLikedByMe && likeBtn)
    likeBtn.classList.add("card__like-button_is-active");

  // Удаление видно только владельцу
  if (deleteBtn && owner._id !== userId) deleteBtn.remove();

  // --- Слушатели (ВСЕ здесь) ---

  // 1) Клик по изображению
  if (cardImage && typeof onImageClick === "function") {
    cardImage.addEventListener("click", () => onImageClick(link, name));
  }

  // 2) Лайк/дизлайк — без оптимистичного апдейта
  if (likeBtn) {
    likeBtn.addEventListener("click", async () => {
      const isActive = likeBtn.classList.contains("card__like-button_is-active");
      const cardId = cardElement.dataset.cardId;

      likeBtn.disabled = true;

      try {
        const updated = isActive
          ? await apiUnlikeCard(cardId)
          : await apiLikeCard(cardId);

        // Обновляем UI строго по факту ответа сервера
        const likedNow = updated.likes.some((u) => u && u._id === userId);
        if (likedNow) {
          likeBtn.classList.add("card__like-button_is-active");
        } else {
          likeBtn.classList.remove("card__like-button_is-active");
        }
        if (likeCountEl) likeCountEl.textContent = String(updated.likes.length);

        if (typeof onLikeChange === "function") onLikeChange(updated);
      } catch (e) {
        console.error("Ошибка при переключении лайка:", e);
        // Ничего не меняем в DOM — оставляем текущее состояние
      } finally {
        likeBtn.disabled = false;
      }
    });
  }
  // 3) Удаление карточки
  if (deleteBtn) {
    deleteBtn.addEventListener("click", async () => {
      const cardId = cardElement.dataset.cardId;
      deleteBtn.disabled = true;
      try {
        await apiDeleteCard(cardId);
        cardElement.remove();
        if (typeof onDelete === "function") onDelete(cardId);
      } catch (e) {
        console.error("Ошибка при удалении карточки:", e);
      } finally {
        deleteBtn.disabled = false;
      }
    });
  }

  return cardElement;
}

/**
 * Явная функция «лайк» (если нужно дернуть извне).
 * Ищет кнопку в cardElement и триггерит клик — вся логика внутри createCard.
 */
export function likeCard(cardElement) {
  const btn = cardElement?.querySelector?.(".card__like-button");
  if (btn) btn.click();
}

/**
 * Явная функция «удаление» (если нужно дернуть извне).
 * Ищет кнопку в cardElement и триггерит клик — удаление и колбэки уже настроены.
 */
export function deleteCard(cardElement) {
  const btn = cardElement?.querySelector?.(".card__delete-button");
  if (btn) btn.click();
}
