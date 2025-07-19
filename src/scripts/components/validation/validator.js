import {
  ErrorDescriptionTextInput,
  ErrorDescriptionUrlInput,
  regexPatternTextInput,
  regexPatternUrlInput,
} from "./constants";

const showInputError = (formElement, inputElement, errorMessage, config) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
};

const hideInputError = (formElement, inputElement, config) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  if (!errorElement) return;

  if (inputElement.classList.contains(config.inputErrorClass)) {
    inputElement.classList.remove(config.inputErrorClass);
  }

  if (errorElement.classList.contains(config.errorClass)) {
    errorElement.classList.remove(config.errorClass);
  }
  errorElement.textContent = "";
};

const checkInputValidity = (formElement, inputElement, config) => {
  const validationRules = {
    [config.elementProfileName]: {
      regex: regexPatternTextInput,
      errorMessage: ErrorDescriptionTextInput,
    },
    [config.elementProfileDescription]: {
      regex: regexPatternTextInput,
      errorMessage: ErrorDescriptionTextInput,
    },
    [config.elementCardName]: {
      regex: regexPatternTextInput,
      errorMessage: ErrorDescriptionTextInput,
    },
    [config.elementCardUrl]: {
      regex: regexPatternUrlInput,
      errorMessage: ErrorDescriptionUrlInput,
    },
  };

  const rule = validationRules[inputElement.id] || {};
  const isValidPattern = rule.regex
    ? rule.regex.test(inputElement.value)
    : true;

  if (!isValidPattern) {
    inputElement.setCustomValidity(rule.errorMessage || "");
    showInputError(
      formElement,
      inputElement,
      rule.errorMessage || inputElement.validationMessage,
      config
    );
  } else {
    inputElement.setCustomValidity("");
    hideInputError(formElement, inputElement, config);
  }

  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      config
    );
  }
};

const hasInvalidInput = (inputList, config) => {
  const validationRules = {
    [config.elementProfileName]: regexPatternTextInput,
    [config.elementProfileDescription]: regexPatternTextInput,
    [config.elementCardName]: regexPatternTextInput,
    [config.elementCardUrl]: regexPatternUrlInput,
  };

  return inputList.some((inputElement) => {
    const rule = validationRules[inputElement.id];
    const isValidPattern = rule ? rule.test(inputElement.value) : true;

    return !isValidPattern || !inputElement.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList, config)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(config.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(config.inactiveButtonClass);
  }
};

const setEventListeners = (formElement, config) => {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    formElement.addEventListener("submit", function (evt) {
      evt.preventDefault();
    });
    setEventListeners(formElement, config);
  });
};

// Очистка ошибок валидации
const clearValidation = (formElement, config) => {
  const inputList = Array.from(document.querySelectorAll(config.inputSelector));

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, config);
    inputElement.setCustomValidity(""); // Сбрасываем кастомные сообщения
  });
};

export { enableValidation, clearValidation };
