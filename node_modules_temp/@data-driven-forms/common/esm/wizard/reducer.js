import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _typeof from "@babel/runtime/helpers/typeof";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import get from 'lodash/get';
export var DYNAMIC_WIZARD_TYPES = ['function', 'object'];

var createSchema = function createSchema(_ref) {
  var formOptions = _ref.formOptions,
      fields = _ref.fields;

  var _formOptions$getState = formOptions.getState(),
      values = _formOptions$getState.values;

  var schema = [];
  var field = fields[0]; // find first wizard step

  var index = -1;

  var _loop = function _loop() {
    var _field$substepOf, _schema, _schema2, _field$substepOf2;

    index += 1;
    schema = [].concat(_toConsumableArray(schema), [{
      name: field.name,
      title: field.title,
      substepOf: ((_field$substepOf = field.substepOf) === null || _field$substepOf === void 0 ? void 0 : _field$substepOf.name) || field.substepOf,
      substepOfTitle: field.substepOf === ((_schema = schema[schema.length - 1]) === null || _schema === void 0 ? void 0 : _schema.substepOf) && ((_schema2 = schema[schema.length - 1]) === null || _schema2 === void 0 ? void 0 : _schema2.substepOfTitle) || ((_field$substepOf2 = field.substepOf) === null || _field$substepOf2 === void 0 ? void 0 : _field$substepOf2.title) || field.substepOf,
      index: index,
      primary: !schema[schema.length - 1] || !field.substepOf || field.substepOf !== schema[schema.length - 1].substepOf
    }]);
    var nextStep = field.nextStep;

    if (_typeof(field.nextStep) === 'object') {
      nextStep = nextStep.stepMapper[get(values, nextStep.when)];
    }

    if (typeof field.nextStep === 'function') {
      nextStep = field.nextStep({
        values: values
      });
    }

    if (nextStep) {
      field = fields.find(function (_ref2) {
        var name = _ref2.name;
        return name === nextStep;
      });
    } else {
      field = undefined;
    }
  };

  while (field) {
    _loop();
  }

  return schema;
};

var handleNext = function handleNext(state, nextStep, formOptions, fields) {
  var newActiveIndex = state.activeStepIndex + 1;
  var shouldInsertStepIntoHistory = state.prevSteps.includes(state.activeStep);
  return _objectSpread(_objectSpread({}, state), {}, {
    registeredFieldsHistory: _objectSpread(_objectSpread({}, state.registeredFieldsHistory), {}, _defineProperty({}, state.activeStep, formOptions.getRegisteredFields())),
    activeStep: nextStep,
    prevSteps: shouldInsertStepIntoHistory ? state.prevSteps : [].concat(_toConsumableArray(state.prevSteps), [state.activeStep]),
    activeStepIndex: newActiveIndex,
    maxStepIndex: newActiveIndex > state.maxStepIndex ? newActiveIndex : state.maxStepIndex,
    navSchema: state.isDynamic ? createSchema({
      fields: fields,
      formOptions: formOptions
    }) : state.navSchema
  });
};

export var findCurrentStep = function findCurrentStep(activeStep, fields) {
  return fields.find(function (_ref3) {
    var name = _ref3.name;
    return name === activeStep;
  });
};

var jumpToStep = function jumpToStep(state, index, valid, fields, crossroads, formOptions) {
  if (index === state.activeStepIndex) {
    return state;
  }

  var clickOnPreviousStep = state.prevSteps[index];

  if (!clickOnPreviousStep) {
    return state;
  }

  if (clickOnPreviousStep) {
    var originalActiveStep;
    var includeActiveStep = state.prevSteps.includes(state.activeStep, fields);
    originalActiveStep = state.activeStep;

    var newState = _objectSpread(_objectSpread({}, state), {}, {
      activeStep: state.prevSteps[index],
      prevSteps: includeActiveStep ? state.prevSteps : [].concat(_toConsumableArray(state.prevSteps), [state.activeStep]),
      activeStepIndex: index
    });

    var INDEXING_BY_ZERO = 1;
    var currentStep = findCurrentStep(newState.prevSteps[index], fields);
    var currentStepHasStepMapper = DYNAMIC_WIZARD_TYPES.includes(_typeof(currentStep.nextStep));
    var hardcodedCrossroads = crossroads;
    var dynamicStepShouldDisableNav = newState.isDynamic && currentStepHasStepMapper;
    var invalidStepShouldDisableNav = valid === false;

    var updatedState = _objectSpread({}, newState);

    if (dynamicStepShouldDisableNav && !hardcodedCrossroads) {
      updatedState = _objectSpread(_objectSpread({}, updatedState), {}, {
        navSchema: createSchema({
          formOptions: formOptions,
          fields: fields
        }),
        prevSteps: newState.prevSteps.slice(0, index),
        maxStepIndex: index
      });
    } else if (currentStep.disableForwardJumping) {
      updatedState = _objectSpread(_objectSpread({}, updatedState), {}, {
        prevSteps: newState.prevSteps.slice(0, index),
        maxStepIndex: index
      });
    } else if (invalidStepShouldDisableNav) {
      var indexOfCurrentStep = newState.prevSteps.indexOf(originalActiveStep);
      updatedState = _objectSpread(_objectSpread({}, updatedState), {}, {
        prevSteps: newState.prevSteps.slice(0, indexOfCurrentStep + INDEXING_BY_ZERO),
        maxStepIndex: newState.prevSteps.slice(0, indexOfCurrentStep + INDEXING_BY_ZERO).length - INDEXING_BY_ZERO
      });
    }

    return updatedState;
  }
};

var reducer = function reducer(state, _ref4) {
  var type = _ref4.type,
      payload = _ref4.payload;

  switch (type) {
    case 'finishLoading':
      return _objectSpread(_objectSpread({}, state), {}, {
        loading: false,
        navSchema: createSchema({
          fields: payload.fields,
          formOptions: payload.formOptions
        })
      });

    case 'handleNext':
      return handleNext(state, payload.nextStep, payload.formOptions, payload.fields);

    case 'setPrevSteps':
      return _objectSpread(_objectSpread({}, state), {}, {
        prevSteps: state.prevSteps.slice(0, state.activeStepIndex),
        maxStepIndex: state.activeStepIndex,
        navSchema: createSchema({
          fields: payload.fields,
          formOptions: payload.formOptions
        })
      });

    case 'jumpToStep':
      return jumpToStep(state, payload.index, payload.valid, payload.fields, payload.crossroads, payload.formOptions);

    default:
      return state;
  }
};

export default reducer;