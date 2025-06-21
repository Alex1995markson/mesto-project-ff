export const createPopupUtils = () => {
  const handleEscapeKey = (evt) => {
    if (evt.key === "Escape") {
      const openedPopup = document.querySelector(".popup_is-opened");
      if (openedPopup) closePopup(openedPopup);
    }
  };

  const openPopup = (popup) => {
    popup.classList.add("popup_is-opened");
    popup.addEventListener("keydown", handleEscapeKey);
    popup.addEventListener('click', handlePopupClick)
  };

  const closePopup = (popup) => {
    popup.classList.remove("popup_is-opened");
    popup.removeEventListener("keydown", handlePopupClick);
    popup.removeEventListener("click", handlePopupClick);
  };

  const handlePopupClick = (evt) => {
    // Закрытие по крестику
    if (evt.target.classList.contains("popup__close")) {
      closePopup(evt.currentTarget);
    }
    // Закрытие по клику вне контента (на оверлей)
    else if (evt.target === evt.currentTarget) {
      closePopup(evt.currentTarget);
    }
  };

  return { openPopup, closePopup};
};