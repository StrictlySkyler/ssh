const htmlEncode = require('js-htmlencode').htmlEncode;

module.exports = function render_input (values) {
  values = values || {};

  return /*html*/`
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
    <div>
      <label class="float-left m-2">Use Private Key
        <input
          type="checkbox"
          name=use_key
          class="use-private-key"
          ${values.use_key ? 'checked' : ''}
        >
      </label>
      <label class="float-left m-2">Render ANSI Colors
        <input
          type=radio
          name=ansi_colors
          class="ansi-color-choice"
          ${values.ansi_colors == 'render' ? 'checked' : ''}
          value=render>
      </label>
      <label class="float-left m-2">Strip ANSI Colors
        <input
          type=radio
          name=ansi_colors
          class="ansi-color-choice"
          ${values.ansi_colors == 'strip' ? 'checked' : ''}
          value=strip>
      </label>
      <label class="float-left m-2">Do Nothing
      <input
        type=radio
        name=ansi_colors
        class="ansi-color-choice"
        ${values.ansi_colors == 'nothing' ? 'checked' : ''}
        value=nothing>
      </label>
    </div>
      <label class="clear-both">Private Key Location
        <input
          type="text"
          name=key_location
          class="private-key-location"
          placeholder="~/.ssh/id_rsa (default)"
          value="${values.key_location || ''}">
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
