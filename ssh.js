/* eslint no-unused-vars: 0 */
const name = 'ssh';
const pkgs = [
  'ssh2',
  'expand-tilde',
  'js-htmlencode',
  'lodash',
  'ansicolor',
];
let fs;
let path;
let expandTilde;
let harbor_dir;
let Shipments;
let render_input;
let render_work_preview;
let update;
let work;
let _;
let ssh;
let ansicolor;
let Client;

module.exports = {
  next: () => {
    expandTilde = require('expand-tilde');
    harbor_dir = process.env.HARBORMASTER_HARBORS_DIR ||
      process.env.HARBORMASTER_SSH_DIR ||
      expandTilde('~/.harbormaster/harbors')
      ;
    fs = require('fs');
    path = require('path');
    _ = require('lodash');
    ansicolor = require('ansicolor');
    ssh = require('ssh2')
    Client = ssh.Client;

    render_input = eval(
      fs.readFileSync(harbor_dir + '/ssh/render_input.js').toString()
    );
    render_work_preview = eval(
      fs.readFileSync(harbor_dir + '/ssh/render_work_preview.js').toString()
    );
    update = eval(
      fs.readFileSync(harbor_dir + '/ssh/update.js').toString()
    );
    work = eval(
      fs.readFileSync(harbor_dir + '/ssh/work.js').toString()
    );
  },

  register: (lanes, users, harbors, shipments) => {
    Shipments = shipments;
    return { name, pkgs };
  },

  render_input: (values) => render_input(values),
  render_work_preview: (manifest) => render_work_preview(manifest),
  update: (lane, values) => update(lane, values),
  work: (lane, manifest) => work(lane, manifest),
};
