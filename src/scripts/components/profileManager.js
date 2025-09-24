import { getUserInfo, getInitialCards } from "../api/api.js";

export const createProfileManager = (domElements, initialCards = []) => {
  // Рендер полей профиля
  const renderProfile = (user) => {
    if (!user) return;
    domElements.profileTitle.textContent = user.name ?? "";
    domElements.profileDescription.textContent = user.about ?? "";
    if (user.avatar) {
      domElements.profileImage.style.backgroundImage = `url('${user.avatar}')`;
    }
  };

  // Загрузка и инициализация данных
  const loadInitialData = () => {
    return Promise.all([getUserInfo(), getInitialCards()])
      .then(([user, cards]) => {
        renderProfile(user);
        // Возвращаем в новом формате: user, userId, cards
        return {
          user,
          userId: user?._id ?? null,
          cards: Array.isArray(cards) ? cards : initialCards,
        };
      })
      .catch((err) => {
        console.error("Ошибка при загрузке данных:", err);
        return {
          user: null,
          userId: null,
          cards: initialCards, // фолбэк на локальные
        };
      });
  };

  return {
    renderProfile,
    loadInitialData,
  };
};
