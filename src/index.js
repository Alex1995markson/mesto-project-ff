// index.js
import "./pages/index.css";
import { initialCards } from "./scripts/components/data/initialData.js";
import { validationConfig, DOM_SELECTORS } from "./scripts/settings.js";
import { createProfileUtils } from "./scripts/components/profileUtils.js";
import { createPopupUtils } from "./scripts/components/modalWindows";
import { createCard } from "./scripts/components/card";
import {
  enableValidation,
  clearValidation,
} from "./scripts/components/validation/validator.js";
import { createProfileManager } from "./scripts/components/profileManager.js";
import { addCard as apiAddCard } from "./scripts/api/api"; // создание через API теперь здесь

// Кешируем DOM
const cacheDomElements = () => {
  const elements = {};
  Object.entries(DOM_SELECTORS).forEach(([key, selector]) => {
    elements[key] = document.querySelector(selector);
  });
  elements.cardTemplate = elements.cardTemplate.content; // как и раньше
  return elements;
};

const initApp = () => {
  const dom = cacheDomElements();
  const popup = createPopupUtils();

  const openImagePopup = (imageUrl, imageAlt) => {
    dom.imgPopup.src = imageUrl;
    dom.imgPopup.alt = imageAlt;
    dom.namePopup.textContent = imageAlt;
    popup.openPopup(dom.imgContainerPopup);
  };

  const profileUtils = createProfileUtils(dom, popup);
  const profileManager = createProfileManager(dom, initialCards);

  enableValidation(validationConfig);
  popup.initPopups();

  // Загружаем данные профиля/карт
  profileManager.loadInitialData().then(({ user, userId, cards }) => {
    // здесь userId передаём в createCard(...)
    cards.forEach((cardData) => {
      const el = createCard(cardData, {
        userId,
        onImageClick: openImagePopup,
        onLikeChange: () => {},
        onDelete: () => {},
        cardTemplate: dom.cardTemplate,
      });
      if (el) dom.cardsContainer.append(el);
    });

    // Сабмит формы создания карточки
    const handleCardFormSubmit = async (evt) => {
      evt.preventDefault();
      const name = dom.inputName.value;
      const link = dom.inputUrl.value;

      const submitBtn = dom.newCardForm?.querySelector(".popup__button");
      const originalText = submitBtn?.textContent || "Создать";
      if (submitBtn) {
        submitBtn.textContent = "Создание...";
        submitBtn.disabled = true;
      }

      try {
        const newCard = await apiAddCard({ name, link });
        const el = createCard(newCard, {
          userId,
          onImageClick: openImagePopup,
          onLikeChange: () => {},
          onDelete: () => {},
          cardTemplate: dom.cardTemplate,
        });
        if (el) dom.cardsContainer.prepend(el);

        popup.closePopup(dom.newCardPopup);
        dom.newCardForm.reset();
      } catch (e) {
        console.error("Ошибка при создании карточки:", e);
      } finally {
        if (submitBtn) {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      }
    };

    // Навешиваем обработчики
    dom.addButtonCard.addEventListener("click", () => {
      clearValidation(dom.newCardForm, validationConfig);
      dom.newCardForm.reset();
      popup.openPopup(dom.newCardPopup);
    });

    dom.newCardForm.addEventListener("submit", handleCardFormSubmit);

    dom.addButtonEditProfile.addEventListener("click", () => {
      clearValidation(dom.editCardForm, validationConfig);
      profileUtils.fillProfileFormWithCurrentData();
      popup.openPopup(dom.editCardPopup);
    });

    dom.editCardForm.addEventListener(
      "submit",
      profileUtils.handleProfileFormSubmit
    );

    dom.profileImage.addEventListener("click", () => {
      clearValidation(dom.avatarEditForm, validationConfig);
      dom.avatarEditForm.reset();
      popup.openPopup(dom.avatarEditPopup);
    });

    dom.avatarEditForm.addEventListener(
      "submit",
      profileUtils.handleAvatarFormSubmit
    );
  });
};

document.addEventListener("DOMContentLoaded", initApp);
