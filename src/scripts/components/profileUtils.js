export const createProfileUtils = (domElements, popupUtils) => {
  const fillProfileFormWithCurrentData = () => {
    if (!domElements.editInputName || !domElements.editInputDescription) return;
    
    domElements.editInputName.value = domElements.profileTitle?.textContent || '';
    domElements.editInputDescription.value = 
      domElements.profileDescription?.textContent || '';
  };

  const handleProfileFormSubmit = (evt) => {
    evt.preventDefault();
    if (!domElements.profileTitle || !domElements.profileDescription) return;
    
    domElements.profileTitle.textContent = domElements.editInputName?.value || '';
    domElements.profileDescription.textContent = 
      domElements.editInputDescription?.value || '';
    popupUtils.closePopup(domElements.editCardPopup);
  };

  return {
    fillProfileFormWithCurrentData,
    handleProfileFormSubmit,
  };
};