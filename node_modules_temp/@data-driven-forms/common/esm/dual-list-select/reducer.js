import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

export var initialState = {
  lastLeftClicked: undefined,
  selectedLeftValues: [],
  lastRightClicked: undefined,
  selectedRightValues: [],
  sortLeftDesc: true,
  sortRightDesc: true,
  filterOptions: '',
  filterValue: ''
};

var reducer = function reducer(state, _ref) {
  var type = _ref.type,
      value = _ref.value,
      values = _ref.values,
      isRight = _ref.isRight;

  switch (type) {
    case 'setSelectedValue':
      return _objectSpread(_objectSpread(_objectSpread({}, state), isRight ? {
        selectedLeftValues: values
      } : {
        selectedRightValues: values
      }), isRight ? {
        lastLeftClicked: value
      } : {
        lastRightClicked: value
      });

    case 'setFilterValue':
      return _objectSpread(_objectSpread({}, state), {}, {
        filterValue: value
      });

    case 'setFilterOptions':
      return _objectSpread(_objectSpread({}, state), {}, {
        filterOptions: value
      });

    case 'sortValue':
      return _objectSpread(_objectSpread({}, state), {}, {
        sortRightDesc: !state.sortRightDesc
      });

    case 'sortOptions':
      return _objectSpread(_objectSpread({}, state), {}, {
        sortLeftDesc: !state.sortLeftDesc
      });

    case 'clearRightValues':
      return _objectSpread(_objectSpread({}, state), {}, {
        selectedRightValues: []
      });

    case 'clearLeftOptions':
      return _objectSpread(_objectSpread({}, state), {}, {
        selectedLeftValues: []
      });

    default:
      return state;
  }
};

export default reducer;