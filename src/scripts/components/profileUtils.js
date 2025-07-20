import {editProfile} from "../api/api"
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
    submitButton.textContent = 'Сохранение...';

    const name = domElements.editInputName?.value || '';
    const about = domElements.editInputDescription?.value || '';

    editProfile({ name, about })
      .then((userData) => {
        if (domElements.profileTitle && domElements.profileDescription) {
          domElements.profileTitle.textContent = userData.name;
          domElements.profileDescription.textContent = userData.about;
        }
        popupUtils.closePopup(domElements.editCardPopup);
      })
      .catch((err) => {
        console.error('Ошибка при обновлении профиля:', err);
      })
      .finally(() => {
        submitButton.textContent = originalButtonText;
      });
  };

  return {
    fillProfileFormWithCurrentData,
    handleProfileFormSubmit,
  };
};
