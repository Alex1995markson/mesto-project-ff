export const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  // inactiveButtonClass: "popup__button_disabled", возможно стоит заменить позже
  inactiveButtonClass: "button_inactive",
  // inputErrorClass: "popup__input_type_error",
  inputErrorClass: "form__input_type_error",
  errorClass: "form__input-error_active",
  // errorClass: "popup__error_visible",
};

export const DOM_SELECTORS = {
  // Элементы профиля
  profileTitle: ".profile__title",
  profileDescription: ".profile__description",
  profileImage: ".profile__image",
  addButtonEditProfile: ".profile__edit-button",
  popupErrorName: ".profile-name-error",
  popupErrorDescription: ".profile-description-error",

  // Элементы карточек
  addButtonCard: ".profile__add-button",
  cardsContainer: ".places__list",
  cardTemplate: "#card-template",
  cardErrorName: ".card-name-error",
  cardErrorUrl: ".card-url-error",

  // Попапы и их элементы
  editCardPopup: ".popup_type_edit",
  editCardForm: ".popup_type_edit .popup__form",
  editInputName: ".popup__input_type_name",
  editInputDescription: ".popup__input_type_description",

  newCardPopup: ".popup_type_new-card",
  newCardForm: ".popup_type_new-card .popup__form",
  inputName: ".popup__input_type_card-name",
  inputUrl: ".popup__input_type_url",

  imgContainerPopup: ".popup_type_image",
  imgPopup: ".popup__image",
  namePopup: ".popup__caption",

  closeNewCardButton: ".popup__close",
};