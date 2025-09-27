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
  if (input.validity.patternMismatch) {
    const custom = input.dataset.errorPattern?.trim();
    // если data-атрибута нет, используем нативное сообщение
    return custom || input.validationMessage || "Неверный формат";
  }
  return input.validationMessage || "Некорректное значение";
};

const checkInputValidity = (formElement, inputElement, config) => {
  // 1) всегда сбрасываем кастомную ошибку перед проверкой
  inputElement.setCustomValidity("");

  if (!inputElement.validity.valid) {
    // 2) только для patternMismatch выставляем кастомный текст (если есть)
    if (inputElement.validity.patternMismatch) {
      const custom = inputElement.dataset.errorPattern?.trim();
      if (custom) inputElement.setCustomValidity(custom);
    }

    // 3) отображаем текст (учтёт либо ваш кастом, либо нативный)
    const msg = getErrorMessage(inputElement);
    showInputError(formElement, inputElement, msg, config);
  } else {
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
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
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

const clearValidation = (formElement, config, { forceDisable = true } = {}) => {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  inputList.forEach((inputElement) => {
    inputElement.setCustomValidity("");
    hideInputError(formElement, inputElement, config);
  });

  const buttonElement = formElement.querySelector(config.submitButtonSelector);
  if (!buttonElement) return;

  if (forceDisable) {
    // Жёстко выключаем при открытии
    buttonElement.disabled = true;
    buttonElement.classList.add(config.inactiveButtonClass);
  } else {
    // Или пересчитываем по валидности полей
    toggleButtonState(inputList, buttonElement, config);
  }
};

export { enableValidation, clearValidation };
