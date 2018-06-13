
const dependencies = ['ssh2', 'expand-tilde', 'js-htmlencode'].join(' ');

console.log('Installing dependencies:', dependencies, '...');
require('child_process').execSync(
  'npm i ' + dependencies
);
console.log('Dependencies installed:', dependencies);

const fs = require('fs');
const path = require('path');
const expandTilde = require('expand-tilde');
const harbor_dir = process.env.HARBORMASTER_HARBORS_DIR ||
  process.env.HARBORMASTER_SSH_DIR ||
  expandTilde('~/.harbormaster/harbors');

let Shipments;
const NAME = 'ssh';

module.exports = {

  render_input: eval(
    fs.readFileSync(harbor_dir + '/ssh/render_input.js').toString()
  ),

  render_work_preview: eval(
    fs.readFileSync(harbor_dir + '/ssh/render_work_preview.js').toString()
  ),

  register: eval(
    fs.readFileSync(harbor_dir + '/ssh/register.js').toString()
  ),

  update: eval(
    fs.readFileSync(harbor_dir + '/ssh/update.js').toString()
  ),

  work: eval(
    fs.readFileSync(harbor_dir + '/ssh/work.js').toString()
  )

};
