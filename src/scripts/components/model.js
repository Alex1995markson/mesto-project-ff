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
  };

  const closePopup = (popup) => {
    popup.classList.remove("popup_is-opened");
    document.removeEventListener("keydown", handleEscapeKey);
  };

  const handleOverlayClick = (evt) => {
    if (evt.target === evt.currentTarget) {
      closePopup(evt.currentTarget);
    }
  };

  return { openPopup, closePopup, handleOverlayClick };
};