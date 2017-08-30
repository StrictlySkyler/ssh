'use strict';

module.exports = function update (lane, values) {
  if (values.destination != '' && values.command != '') return true;

  return false;
};
