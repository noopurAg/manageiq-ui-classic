import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";

var flatOptions = function flatOptions(options) {
  return options.flatMap(function (option) {
    return option.options ? [{
      group: option.label
    }].concat(_toConsumableArray(option.options)) : [option];
  });
};

export default flatOptions;