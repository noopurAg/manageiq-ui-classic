import _typeof from "@babel/runtime/helpers/typeof";

var deepEqual = function deepEqual(a, b) {
  var depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  if (depth > 4) {
    console.error('Recursion limit of 5 has been exceeded.');
    return false;
  }

  if (a === b) {
    return true;
  }

  if (Array.isArray(a) && Array.isArray(b) && a.length === b.length) {
    return a.every(function (item, index) {
      return deepEqual(item, b[index]);
    });
  }

  if (_typeof(a) === 'object' && _typeof(b) === 'object' && a !== null && b !== null) {
    var keysA = Object.keys(a);
    var keysB = Object.keys(b);

    if (keysA.length !== keysB.length) {
      return false;
    }

    for (var _i = 0, _keysA = keysA; _i < _keysA.length; _i++) {
      var key = _keysA[_i];

      if (!keysB.includes(key) || !deepEqual(a[key], b[key], depth + 1)) {
        return false;
      }
    }

    return true;
  }

  return false;
};

export default deepEqual;