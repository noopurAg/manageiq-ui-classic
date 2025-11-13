import selectNext from './select-next';

var enterHandler = function enterHandler(e, formOptions, activeStep, findCurrentStep, handleNext, handleSubmit) {
  if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
    var isNotButton = e.target.type !== 'button';

    if (isNotButton) {
      e.preventDefault();
      var schemaNextStep = findCurrentStep(activeStep).nextStep;
      var hasCustomButtons = findCurrentStep(activeStep).buttons;
      var nextStep;

      if (schemaNextStep) {
        nextStep = selectNext(schemaNextStep, formOptions.getState);
      }

      var canContinue = formOptions.valid && !formOptions.getState().validating;

      if (canContinue && nextStep && !hasCustomButtons) {
        handleNext(nextStep, formOptions.getRegisteredFields);
      } else if (canContinue && !schemaNextStep && !hasCustomButtons) {
        handleSubmit();
      }
    }
  }
};

export default enterHandler;