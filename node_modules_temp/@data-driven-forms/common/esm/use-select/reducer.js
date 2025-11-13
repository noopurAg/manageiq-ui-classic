import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

export var init = function init(_ref) {
  var propsOptions = _ref.propsOptions,
      optionsTransformer = _ref.optionsTransformer;
  return _objectSpread({
    isLoading: false,
    options: optionsTransformer ? optionsTransformer(propsOptions) : propsOptions,
    promises: {},
    isInitialLoaded: false
  }, optionsTransformer && {
    originalOptions: propsOptions
  });
};

var reducer = function reducer(state, _ref2) {
  var type = _ref2.type,
      payload = _ref2.payload,
      _ref2$options = _ref2.options,
      options = _ref2$options === void 0 ? [] : _ref2$options,
      optionsTransformer = _ref2.optionsTransformer,
      compareValues = _ref2.compareValues;

  switch (type) {
    case 'updateOptions':
      return _objectSpread(_objectSpread({}, state), {}, {
        options: optionsTransformer ? optionsTransformer(payload) : payload,
        isLoading: false,
        promises: {}
      }, optionsTransformer && {
        originalOptions: payload
      });

    case 'startLoading':
      return _objectSpread(_objectSpread({}, state), {}, {
        isLoading: true
      });

    case 'setOptions':
      return _objectSpread(_objectSpread({}, state), {}, {
        options: optionsTransformer ? optionsTransformer(payload) : payload
      }, optionsTransformer && {
        originalOptions: payload
      });

    case 'initialLoaded':
      return _objectSpread(_objectSpread({}, state), {}, {
        isInitialLoaded: true
      });

    case 'setPromises':
      return _objectSpread(_objectSpread({}, state), {}, {
        promises: _objectSpread(_objectSpread({}, state.promises), payload),
        options: optionsTransformer ? optionsTransformer([].concat(_toConsumableArray(state.options), _toConsumableArray(options.filter(function (_ref3) {
          var value = _ref3.value;
          return !state.options.find(function (option) {
            return compareValues(option.value, value);
          });
        })))) : [].concat(_toConsumableArray(state.options), _toConsumableArray(options.filter(function (_ref4) {
          var value = _ref4.value;
          return !state.options.find(function (option) {
            return compareValues(option.value, value);
          });
        })))
      }, optionsTransformer && {
        originalOptions: [].concat(_toConsumableArray(state.options), _toConsumableArray(options.filter(function (_ref5) {
          var value = _ref5.value;
          return !state.options.find(function (option) {
            return compareValues(option.value, value);
          });
        })))
      });

    default:
      return state;
  }
};

export default reducer;