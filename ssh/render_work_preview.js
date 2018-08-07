const htmlEncode = require('js-htmlencode').htmlEncode;

module.exports = function render_work_preview (manifest) {
  let user = manifest.user ? manifest.user + '@' : '';
  let use_key;
  let command = manifest.command ? htmlEncode(manifest.command) : '';

  if (manifest.key_location) use_key = manifest.key_location;
  else if (manifest.use_key) use_key = '~/.ssh/id_rsa';
  else use_key = false;

  return `
    <style>
      .ssh-lane-work-preview code {
        word-wrap: break-word;
        white-space: pre-wrap;
      }
    </style>
    <div class="ssh-lane-work-preview">
      <p class="ssh-address">Address:</p>
      <p><code>${user}${manifest.address}</code></p>
      <p>Use private key?</p>
      <p><code>${use_key}</code></p>
      <p class="ssh-command">Command:</p>
      <p><code>${command}</code></p>
    </div>
  `;
};
