import get from 'lodash/get';

var selectNext = function selectNext(nextStep, getState) {
  if (typeof nextStep === 'string') {
    return nextStep;
  }

  if (typeof nextStep === 'function') {
    return nextStep({
      values: getState().values
    });
  }

  var selectedValue = get(getState().values, nextStep.when);
  return nextStep.stepMapper[selectedValue];
};

export default selectNext;