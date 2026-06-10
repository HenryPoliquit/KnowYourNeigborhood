// Shared Vuetify validation rules. A rule is `value => true | string`
// (string = error message). These mirror the backend JSON schemas in
// backend/src/routes/*. Format rules are "optional-friendly": they pass on
// empty input, so combine with `required()` when the field is mandatory.

export const required = (msg = 'Required') =>
  (v) => (!!v && String(v).trim().length > 0) || msg;

export const email = (msg = 'Enter a valid email') =>
  (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || msg;

export const minLen = (n, msg) =>
  (v) => !v || String(v).length >= n || (msg ?? `Min ${n} characters`);

export const phone = (msg = 'Enter a valid phone number') =>
  (v) => !v || /^[+]?[\d\s().-]{6,}$/.test(v) || msg;
