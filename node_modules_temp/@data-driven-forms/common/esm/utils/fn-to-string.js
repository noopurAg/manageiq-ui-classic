var fnToString = function fnToString() {
  var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return fn.toString().replace(/\s+/g, ' ');
};

export default fnToString;