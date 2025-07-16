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
  inputElement.classList.remove(config.inputErrorClass);
  errorElement.classList.remove(config.errorClass);
  errorElement.textContent = "";
};


const checkInputValidity = (formElement, inputElement, config) => {
  const validationRules = {
    "profile-name": {
      regex: regexPatternTextInput,
      errorMessage: ErrorDescriptionTextInput,
    },
    "profile-description": {
      regex: regexPatternTextInput,
      errorMessage: ErrorDescriptionTextInput,
    },
    "card-name": {
      regex: regexPatternTextInput,
      errorMessage: ErrorDescriptionTextInput,
    },
    "card-url": {
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

const hasInvalidInput = (inputList) => {
  const validationRules = {
    "profile-name": regexPatternTextInput,
    "profile-description": regexPatternTextInput,
    "card-name": regexPatternTextInput,
    "card-url": regexPatternUrlInput,
  };

  return inputList.some((inputElement) => {
    const rule = validationRules[inputElement.id];
    const isValidPattern = rule ? rule.test(inputElement.value) : true;

    return !isValidPattern || !inputElement.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList)) {
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
