'use strict';

let dependencies = ['ssh2', 'expand-tilde'].join(' ');

console.log('Installing dependencies:', dependencies, '...');
require('child_process').execSync(
  'npm i ' + dependencies
);
console.log('Dependencies installed:', dependencies);

let fs = require('fs');
let expandTilde = require('expand-tilde');
let harbor_dir = expandTilde('~/.harbormaster/harbors');

let Client = require('ssh2')

let Lanes;
let Users;
let Harbors;
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
