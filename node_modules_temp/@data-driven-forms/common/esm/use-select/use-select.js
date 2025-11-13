import _typeof from "@babel/runtime/helpers/typeof";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { useEffect, useReducer, useState } from 'react';
import isEqual from 'lodash/isEqual';
import useIsMounted from '../hooks/use-is-mounted';
import reducer, { init } from './reducer';
import fnToString from '../utils/fn-to-string';

var getSelectValue = function getSelectValue(stateValue, simpleValue, isMulti, allOptions) {
  var enhancedValue = stateValue;
  var hasSelectAll = isMulti && allOptions.find(function (_ref) {
    var selectAll = _ref.selectAll;
    return selectAll;
  });
  var hasSelectNone = isMulti && allOptions.find(function (_ref2) {
    var selectNone = _ref2.selectNone;
    return selectNone;
  });

  if (hasSelectAll || hasSelectNone) {
    enhancedValue = enhancedValue || [];
    var optionsLength = allOptions.filter(function (_ref3) {
      var selectAll = _ref3.selectAll,
          selectNone = _ref3.selectNone,
          divider = _ref3.divider,
          options = _ref3.options;
      return !selectAll && !selectNone && !divider && !options;
    }).length;
    var selectedAll = optionsLength === enhancedValue.length;
    var selectedNone = enhancedValue.length === 0;
    enhancedValue = [].concat(_toConsumableArray(enhancedValue), _toConsumableArray(hasSelectAll && selectedAll ? [simpleValue ? hasSelectAll.value : hasSelectAll] : []), _toConsumableArray(hasSelectNone && selectedNone ? [simpleValue ? hasSelectNone.value : hasSelectNone] : []));
  }

  return simpleValue ? allOptions.filter(function (_ref4) {
    var value = _ref4.value;
    return isMulti ? enhancedValue.includes(value) : isEqual(value, enhancedValue);
  }) : enhancedValue;
};

var handleSelectChange = function handleSelectChange(option, simpleValue, isMulti, onChange, allOptions, removeSelectAll, removeSelectNone) {
  var enhanceOption = option;

  if (removeSelectNone) {
    enhanceOption = enhanceOption.filter(function (_ref5) {
      var selectNone = _ref5.selectNone;
      return !selectNone;
    });
  } else if (removeSelectAll) {
    enhanceOption = enhanceOption.filter(function (_ref6) {
      var selectAll = _ref6.selectAll;
      return !selectAll;
    });
  }

  var sanitizedOption = !enhanceOption && isMulti ? [] : enhanceOption;

  if (isMulti && sanitizedOption.find(function (_ref7) {
    var selectAll = _ref7.selectAll;
    return selectAll;
  })) {
    return onChange(allOptions.filter(function (_ref8) {
      var selectAll = _ref8.selectAll,
          selectNone = _ref8.selectNone,
          value = _ref8.value;
      return !selectAll && !selectNone && value;
    }).map(function (_ref9) {
      var value = _ref9.value;
      return value;
    }));
  }

  if (isMulti && sanitizedOption.find(function (_ref10) {
    var selectNone = _ref10.selectNone;
    return selectNone;
  })) {
    return onChange([]);
  }

  return simpleValue ? onChange(isMulti ? sanitizedOption.map(function (item) {
    return item.value;
  }) : sanitizedOption ? sanitizedOption.value : undefined) : onChange(sanitizedOption);
};

var useSelect = function useSelect(_ref11) {
  var loadOptions = _ref11.loadOptions,
      optionsTransformer = _ref11.optionsTransformer,
      _ref11$options = _ref11.options,
      initialOptions = _ref11$options === void 0 ? [] : _ref11$options,
      noValueUpdates = _ref11.noValueUpdates,
      _onChange = _ref11.onChange,
      value = _ref11.value,
      loadOptionsChangeCounter = _ref11.loadOptionsChangeCounter,
      isSearchable = _ref11.isSearchable,
      pluckSingleValue = _ref11.pluckSingleValue,
      isMulti = _ref11.isMulti,
      simpleValue = _ref11.simpleValue,
      compareValues = _ref11.compareValues;

  var _useState = useState(initialOptions),
      _useState2 = _slicedToArray(_useState, 2),
      propsOptions = _useState2[0],
      setPropsCache = _useState2[1];

  var _useReducer = useReducer(reducer, {
    optionsTransformer: optionsTransformer,
    propsOptions: initialOptions
  }, init),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      originalDispatch = _useReducer2[1];

  var dispatch = function dispatch(action) {
    return originalDispatch(_objectSpread(_objectSpread({}, action), {}, {
      optionsTransformer: optionsTransformer,
      compareValues: compareValues
    }));
  };

  useEffect(function () {
    if (!isEqual(initialOptions, propsOptions)) {
      setPropsCache(initialOptions);
    }
  }, [initialOptions]);
  var isMounted = useIsMounted();

  var updateOptions = function updateOptions() {
    dispatch({
      type: 'startLoading'
    });
    return loadOptions().then(function (data) {
      if (isMounted.current) {
        if (!noValueUpdates) {
          if (value && Array.isArray(value)) {
            var _selectValue = value.filter(function (value) {
              return _typeof(value) === 'object' ? data.find(function (option) {
                return compareValues(value.value, option.value);
              }) : data.find(function (option) {
                return compareValues(value, option.value);
              });
            });

            _onChange(_selectValue.length === 0 ? undefined : _selectValue);
          } else if (value && !data.find(function (_ref12) {
            var internalValue = _ref12.value;
            return compareValues(internalValue, value);
          })) {
            _onChange(undefined);
          }
        }

        dispatch({
          type: 'updateOptions',
          payload: data
        });
      }
    });
  };

  useEffect(function () {
    if (loadOptions) {
      updateOptions();
    }

    dispatch({
      type: 'initialLoaded'
    });
  }, []);
  var loadOptionsStr = loadOptions ? fnToString(loadOptions) : '';
  useEffect(function () {
    if (loadOptionsStr && state.isInitialLoaded) {
      updateOptions();
    }
  }, [loadOptionsStr, loadOptionsChangeCounter]);
  useEffect(function () {
    if (!isEqual(state.options, propsOptions) && state.isInitialLoaded) {
      if (!noValueUpdates && value && !propsOptions.map(function (_ref13) {
        var value = _ref13.value;
        return value;
      }).includes(value)) {
        _onChange(undefined);
      }

      dispatch({
        type: 'setOptions',
        payload: propsOptions
      });
    }
  }, [propsOptions]);

  var onInputChange = function onInputChange(inputValue) {
    if (inputValue && loadOptions && state.promises[inputValue] === undefined && isSearchable) {
      dispatch({
        type: 'setPromises',
        payload: _defineProperty({}, inputValue, true)
      });
      loadOptions(inputValue).then(function (options) {
        if (isMounted.current) {
          dispatch({
            type: 'setPromises',
            payload: _defineProperty({}, inputValue, false),
            options: options
          });
        }
      })["catch"](function (error) {
        dispatch({
          type: 'setPromises',
          payload: _defineProperty({}, inputValue, false)
        }); // eslint-disable-next-line no-console

        console.error(error);
      });
    }
  };

  var selectValue = pluckSingleValue ? isMulti ? value : Array.isArray(value) && value[0] ? value[0] : value : value;
  var filteredLength = state.options.filter(function (_ref14) {
    var selectAll = _ref14.selectAll,
        selectNone = _ref14.selectNone;
    return !selectAll && !selectNone;
  }).length;
  var shouldRemoveSelectAll = isMulti && state.options.find(function (_ref15) {
    var selectAll = _ref15.selectAll;
    return selectAll;
  }) && selectValue.length === filteredLength;
  var shouldRemoveSelectNone = isMulti && state.options.find(function (_ref16) {
    var selectNone = _ref16.selectNone;
    return selectNone;
  }) && selectValue.length === 0;
  return {
    value: getSelectValue(selectValue, simpleValue, isMulti, state.options),
    onChange: function onChange(option) {
      return handleSelectChange(option, simpleValue, isMulti, _onChange, state.options, shouldRemoveSelectAll, shouldRemoveSelectNone);
    },
    onInputChange: onInputChange,
    isFetching: Object.values(state.promises).some(function (value) {
      return value;
    }),
    state: state
  };
};

export default useSelect;