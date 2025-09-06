import { getUserInfo, getInitialCards } from "../api/api.js";

export const createProfileManager = (domElements, cardUtils, initialCards) => {
  // Функция рендеринга профиля
  const renderProfile = (userData) => {
    domElements.profileTitle.textContent = userData.name;
    domElements.profileDescription.textContent = userData.about;
  };

  // Загрузка и инициализация данных
  const loadInitialData = () => {
    return Promise.all([getUserInfo(), getInitialCards()])
      .then(([userData, cards]) => {
        renderProfile(userData);
        cardUtils.renderInitialCards(cards, userData._id);
        return { userData, cards };
      })
      .catch((err) => {
        console.error("Ошибка при загрузке данных:", err);
        cardUtils.renderInitialCards(initialCards); // рендерем карточки по умолчанию
        return { userData: null, cards: initialCards };
      });
  };

  return {
    renderProfile,
    loadInitialData,
  };
};
