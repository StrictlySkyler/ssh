const Client = require('ssh2');
const fs = require('fs');
const connection = new Client();
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
  code, signal, lane, exit_code, manifest
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

  if (shipment.active) {
    exit_code = code;
    $H.end_shipment(lane, exit_code, manifest);
  }
});

const handle_stdout = $H.bind((
  buffer, lane, exit_code, manifest
) => {
  const shipment = Shipments.findOne(manifest.shipment_id);
  console.log(
    `Command "${manifest.command}" logged data:\n ${buffer.toString('utf8')}`
  );

  if (shipment.active) {
    shipment.stdout.push({
      result: buffer.toString('utf8'),
      date: new Date()
    });
    Shipments.update(shipment._id, shipment);
  }
});

const handle_stderr = $H.bind((buffer, manifest) => {
  const shipment = Shipments.findOne(manifest.shipment_id);
  console.log(
    'Command "' + manifest.command + '" errored with error:\n',
    buffer.toString('utf8')
  );

  if (shipment.active) {
    shipment.stderr.push({
      result: buffer.toString('utf8'),
      date: new Date()
    });
    Shipments.update(shipment._id, shipment);
  }
});

const handle_ready = $H.bind((
  err, stream, lane, exit_code, manifest
) => {
  const shipment = Shipments.findOne(manifest.shipment_id);
  console.log('Connection ready.');

  console.log(
    `Executing command "${manifest.command}" for: ${manifest.address}`
  );
  connection.exec(manifest.command, { pty: true }, (err, stream) =>
    handle_stream(err, stream, lane, exit_code, manifest));
});

const handle_stream = $H.bind((
  err, stream, lane, exit_code, manifest
) => {
  if (err) {
    console.error(error);
    manifest.error = error;
  }

  stream
    .on('close', (code, signal) =>
      handle_stream_close(code, signal, lane, exit_code, manifest))
    .on('data', (buffer) =>
      handle_stdout(buffer, lane, exit_code, manifest))
    .stderr.on('data', (buffer) =>
      handle_stderr(buffer, manifest));
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
  let ready;

  console.log(`Logging into ${connection_options.host}`);

  connection
    .on('ready', (err, stream) => {
      if (! ready) {
        ready = true;
        return handle_ready(err, stream, lane, exit_code, manifest)
      }
    })
    .on('error', (err) =>
      handle_error(err, lane, exit_code, manifest))
    .connect(connection_options);

  return manifest;
};
