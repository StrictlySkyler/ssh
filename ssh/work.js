/* eslint
no-unused-vars: ["error", {"args": "after-used"}]
*/

const Client = require('ssh2');
const fs = require('fs');
const _ = require('lodash');
const DEFAULT_USER = process.env.HARBORMASTER_SSH_DEFAULT_USER || 'ubuntu';

const get_user = (manifest) => {
  return manifest.user || DEFAULT_USER;
};

const maybe_get_private_key = (manifest) => {
  let private_key;

  if (manifest.use_key && manifest.key_location) {
    private_key = fs.readFileSync(
      expandTilde(destination.private_key_location),
      'utf8'
    );

  } else if (manifest.use_key) {
    try {
      private_key = fs.readFileSync(expandTilde('~/.ssh/id_rsa'), 'utf8');
    } catch (err) {
      manifest.error = err;
    }
  }

  return private_key || false;
};

const handle_stream_close = $H.bind((
  code, signal, connection, lane, exit_code, manifest
) => {
  const shipment = Shipments.findOne(manifest.shipment_id);
  console.log(
    `Command "${
    manifest.command
    }" exited with code ${
    code
    } for: ${
    manifest.address
    }`
  );

  if (! code) code = -1; // Stream closed without a code

  if (shipment.active) {
    exit_code = code;
    $H.end_shipment(lane, exit_code, manifest);
  }
  return connection.end();
});

const handle_stdout = $H.bind((buffer, lane, exit_code, manifest) => {
  const shipment = Shipments.findOne(manifest.shipment_id);
  console.log(
    `Command "${manifest.command}" logged data:\n ${buffer.toString('utf8')}`
  );

  if (shipment.active) {
    const result = buffer.toString('utf8');
    shipment.stdout.push({
      result,
      date: new Date()
    });
    manifest.result = result;
    shipment.manifest = manifest;
    Shipments.update(shipment._id, shipment);
  }

  return manifest;
});

const handle_stderr = $H.bind((buffer, manifest) => {
  const shipment = Shipments.findOne(manifest.shipment_id);
  console.log(
    'Command "' + manifest.command + '" errored with error:\n',
    buffer.toString('utf8')
  );

  if (shipment.active) {
    const result = buffer.toString('utf8');
    shipment.stderr.push({
      result,
      date: new Date()
    });
    manifest.result = result;
    shipment.manifest = manifest;
    Shipments.update(shipment._id, shipment);
  }

  return manifest;
});

const fill_reference_text = (manifest, text) => {
  const reference_regex = /\[\[([a-zA-Z0-9\.-_\+:]+)\]\]/g;

  const referenced_value_text = text.replace(
    reference_regex,
    (match, target) => {
      const value = _.get(manifest, target);
      if (value) return JSON.stringify(value, null, '\t');
      return '';
    }
  );
  return referenced_value_text;
};

const handle_ready = $H.bind((
  err, stream, connection, lane, exit_code, manifest
) => {
  const command = fill_reference_text(manifest, manifest.command);
  console.log('Connection ready.');
  console.log(
    `Executing command "${command}" for: ${manifest.address}`
  );
  connection.exec(
    command,
    { pty: true },
    (exec_err, exec_stream) => handle_stream(
      exec_err, exec_stream, connection, lane, exit_code, manifest
    )
  );
});

const handle_stream = $H.bind((
  err, stream, connection, lane, exit_code, manifest
) => {
  if (err) {
    console.error(error);
    manifest.error = error;
  }

  stream.on('close', (code, signal) => handle_stream_close(
    code, signal, connection, lane, exit_code, manifest
  )).on(
    'data', (buffer) => handle_stdout(buffer, lane, exit_code, manifest)
  ).stderr.on('data', (buffer) => handle_stderr(buffer, manifest));
});

const handle_error = $H.bind((err, lane, exit_code, manifest) => {
  console.error('Error with connection!', err);
  if (err) manifest.error = err;

  $H.end_shipment(lane, exit_code, manifest);
});

module.exports = function work (lane, manifest) {
  let exit_code = 1;
  const private_key = maybe_get_private_key(manifest);
  const user = get_user(manifest);
  const connection_options = {
    tryKeyboard: true,
    host: manifest.address,
    username: user,
    privateKey: private_key,
    password: manifest.password,
  };
  const connection = new Client();

  console.log(`Logging into ${connection_options.host}`);
  connection
    .on('ready', (err, stream) =>
      handle_ready(err, stream, connection, lane, exit_code, manifest))
    .on('error', (err) =>
      handle_error(err, lane, exit_code, manifest))
    .connect(connection_options);

  return manifest;
};

