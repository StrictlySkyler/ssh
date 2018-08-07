const htmlEncode = require('js-htmlencode').htmlEncode;

module.exports = function render_input (values) {
  values = values || {};

  return `
    <label>Destination Address
      <span class="address-field">
        <input
          type=text
          name=address
          class="destination-address"
          placeholder="Single IP or hostname"
          required
          value="${values.address || ''}"
        >
      </span>
    </label>
    <label>Destination User
      <input
        type="text"
        name=user
        class="destination-user" 
        placeholder="ubuntu (default)"
        autocomplete="new-password"
        value="${values.user || ''}"
      >
    </label>
    <label>Destination User Password
      <input
        type="password"
        name=password
        class="destination-password"
        autocomplete="new-password"
        placeholder="(no default)"
        value="${values.password || ''}"
      >
    </label>
    <label>Use Private Key
      <input
        type="checkbox"
        name=use_key
        class="use-private-key"
        ${values.use_key ? 'checked' : ''}
      >
    </label>
    <label>Private Key Location
      <input
        type="text"
        name=key_location
        class="private-key-location"
        placeholder="~/.ssh/id_rsa (default)"
        value="${values.key_location || ''}"
      >
    </label>
    <label>Command to execute:
      <style>
        .ssh-work {
          font: 14px monospace;
          resize: vertical;
        }
      </style>
      <textarea
        name=command
        class="ssh-work"
        placeholder="(no default)"
        required
      >${values.command ? htmlEncode(values.command) : ''}</textarea>
    </label>
  `;
};
