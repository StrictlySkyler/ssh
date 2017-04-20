'use strict';

module.exports = function update (lane, values) {
  let harbor = Harbors.findOne(lane.type);

  harbor.lanes[lane._id] = {
    manifest: values
  };

  Harbors.update(harbor._id, harbor);

  if (values.destination != '' && values.command != '') return true;

  return false;
};
