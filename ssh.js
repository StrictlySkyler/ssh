const name = 'ssh';
const pkgs = [
  'ssh2', 'expand-tilde', 'js-htmlencode', 'lodash',
];
let fs;
let path;
let expandTilde;
let harbor_dir;
let Shipments;

module.exports = {
  next: () => {
    fs = require('fs');
    path = require('path');
    expandTilde = require('expand-tilde');
    harbor_dir = process.env.HARBORMASTER_HARBORS_DIR ||
      process.env.HARBORMASTER_SSH_DIR ||
      expandTilde('~/.harbormaster/harbors');

    module.exports.render_input = eval(
      fs.readFileSync(harbor_dir + '/ssh/render_input.js').toString()
    );
    module.exports.render_work_preview = eval(
      fs.readFileSync(harbor_dir + '/ssh/render_work_preview.js').toString()
    );
    module.exports.update = eval(
      fs.readFileSync(harbor_dir + '/ssh/update.js').toString()
    );
    module.exports.work = eval(
      fs.readFileSync(harbor_dir + '/ssh/work.js').toString()
    );
  },

  register: (lanes, users, harbors, shipments) => {
    Shipments = shipments;
    return { name, pkgs };
  },
};
