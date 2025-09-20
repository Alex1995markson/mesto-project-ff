const showInputError = (formElement, inputElement, errorMessage, config) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  if (!errorElement) return;
  inputElement.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
};

const hideInputError = (formElement, inputElement, config) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  if (!errorElement) return;
  inputElement.classList.remove(config.inputErrorClass);
  errorElement.classList.remove(config.errorClass);
  errorElement.textContent = "";
};

// Универсальный генератор текста ошибки
const getErrorMessage = (input) => {
  const t = (fallback) => input.title?.trim() || fallback;

  if (input.validity.valueMissing) return "Вы пропустили это поле";
  if (input.validity.tooShort) return `Минимум ${input.minLength} символ(а/ов)`;
  if (input.validity.tooLong)  return `Максимум ${input.maxLength} символ(а/ов)`;
  if (input.validity.typeMismatch) {
    return t("Введите корректное значение");
  }
  if (input.validity.patternMismatch) {
    // текст можно задать через title на самом инпуте
    return t("Неверный формат");
  }
  return input.validationMessage || "Некорректное значение";
};

const checkInputValidity = (formElement, inputElement, config) => {
  if (!inputElement.validity.valid) {
    inputElement.setCustomValidity(""); 
    const msg = getErrorMessage(inputElement);
    showInputError(formElement, inputElement, msg, config);
  } else {
    inputElement.setCustomValidity("");
    hideInputError(formElement, inputElement, config);
  }
};

const hasInvalidInput = (inputList) =>
  inputList.some((input) => !input.validity.valid);

const toggleButtonState = (inputList, buttonElement, config) => {
  const invalid = hasInvalidInput(inputList);
  buttonElement.disabled = invalid;
  buttonElement.classList.toggle(config.inactiveButtonClass, invalid);
};

const setEventListeners = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    formElement.addEventListener("submit", (evt) => evt.preventDefault());
    setEventListeners(formElement, config);
  });
};

// Очистка ошибок валидации — только внутри данной формы
const clearValidation = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  inputList.forEach((inputElement) => {
    inputElement.setCustomValidity("");
    hideInputError(formElement, inputElement, config);
  });
};

export { enableValidation, clearValidation };
