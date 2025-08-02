import { editProfile, updateAvatar } from "../api/api";
export const createProfileUtils = (domElements, popupUtils) => {
  const fillProfileFormWithCurrentData = () => {
    if (!domElements.editInputName || !domElements.editInputDescription) return;

    domElements.editInputName.value =
      domElements.profileTitle?.textContent || "";
    domElements.editInputDescription.value =
      domElements.profileDescription?.textContent || "";
  };

  const handleProfileFormSubmit = (evt) => {
    evt.preventDefault();
    if (!domElements.profileTitle || !domElements.profileDescription) return;

    const submitButton = evt.submitter;
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = "Сохранение...";

    const name = domElements.editInputName?.value || "";
    const about = domElements.editInputDescription?.value || "";

    editProfile({ name, about })
      .then((userData) => {
        if (domElements.profileTitle && domElements.profileDescription) {
          domElements.profileTitle.textContent = userData.name;
          domElements.profileDescription.textContent = userData.about;
        }
        popupUtils.closePopup(domElements.editCardPopup);
      })
      .catch((err) => {
        console.error("Ошибка при обновлении профиля:", err);
      })
      .finally(() => {
        submitButton.textContent = originalButtonText;
      });
  };

  const handleAvatarFormSubmit = (evt) => {
    evt.preventDefault();
    const avatarUrl = domElements.inputAvatar.value.trim();

    const submitButton =
      domElements.avatarEditForm.querySelector(".popup__button");
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = "Сохранение...";
    submitButton.disabled = true;

    // Сбрасываем предыдущие ошибки
    const errorElement =
      domElements.avatarEditForm.querySelector(".popup__error");
    errorElement.textContent = "";
    errorElement.classList.remove("popup__error_visible");

    return updateAvatar(avatarUrl)
      .then((userData) => {
        domElements.profileImage.style.backgroundImage = `url('${userData.avatar}')`;
        popupUtils.closePopup(domElements.avatarEditPopup);
        domElements.avatarEditForm.reset();
        return userData;
      })
      .catch((err) => {
        console.error("Ошибка при обновлении аватара:", err);
        errorElement.textContent =
          "Не удалось обновить аватар. Проверьте ссылку.";
        errorElement.classList.add("popup__error_visible");
        throw err;
      })
      .finally(() => {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
      });
  };

  return {
    fillProfileFormWithCurrentData,
    handleProfileFormSubmit,
    handleAvatarFormSubmit,
  };
};
