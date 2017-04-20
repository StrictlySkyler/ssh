'use strict';

module.exports = function register (lanes, users, harbors, shipments) {
  Lanes = lanes;
  Users = users;
  Harbors = harbors;
  Shipments = shipments;

  Harbors.upsert(NAME, {
    lanes: Harbors.findOne(NAME) && Harbors.findOne(NAME).lanes ?
      Harbors.findOne(NAME).lanes :
      {}
  });
};
