module.exports = function render_work_preview (manifest) {
  let user = manifest.user ? manifest.user + '@' : '';

  return `
    <p>Address: <code>${user}${manifest.address}</code></p>
    <p>Command: <code>${manifest.command}</code></p>
  `;
}
