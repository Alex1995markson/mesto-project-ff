export const createPopupUtils = () => {
  const handleEscapeKey = (evt) => {
    if (evt.key === "Escape") {
      const openedPopup = document.querySelector(".popup_is-opened");
      if (openedPopup) closePopup(openedPopup);
    }
  };

  const openPopup = (popup) => {
    popup.classList.add("popup_is-opened");

    document.addEventListener("keydown", handleEscapeKey);
    popup.addEventListener("click", handlePopupClick);
  };

  const closePopup = (popup) => {
    const handleTransitionEnd = () => {
      popup.removeEventListener("transitionend", handleTransitionEnd);
    };

    popup.addEventListener("transitionend", handleTransitionEnd);
    popup.classList.remove("popup_is-opened");

    document.removeEventListener("keydown", handleEscapeKey);
    popup.removeEventListener("click", handlePopupClick);

    //   // Находим форму внутри попапа (пока под вопросом)
    //   const form = popup.querySelector(".popup__form");
    //   const errorSpans = form.querySelectorAll("span.popup__error");
    //   console.log("Erros", errorSpans)
    //   errorSpans.forEach((span) => {
    //     span.textContent = "";
    //     span.classList.remove("form__input-error_active");
    //   });

    //   // Если нужно очистить input'ы
    //   if (true && form) {
    //     const inputs = form.querySelectorAll("input");
    //     inputs.forEach(input => {
    //       input.value = ""; // Очищаем значение
    //     });
    //   }
  };

  const handlePopupClick = (evt) => {
    if (
      evt.target.classList.contains("popup__close") ||
      evt.target === evt.currentTarget
    ) {
      closePopup(evt.currentTarget);
    }
  };

  const initPopups = () => {
    document.querySelectorAll(".popup").forEach((popup) => {
      popup.classList.add("popup_is-animated");
    });
  };

  return {
    openPopup,
    closePopup,
    initPopups,
  };
};
