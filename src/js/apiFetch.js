const getCSRFToken = () => {
  const meta = document.querySelector('meta[name="csrf-token"]');
  if (!meta) { throw new Error('Unable to find CSRF token meta'); }

  const csrfToken = meta.getAttribute('content');
  if (!csrfToken) { throw new Error('Unable to get CSRF token value'); }

  return csrfToken;
}

const apiFetch = (path, options) => {
  const initOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      "X-CSRF-Token": getCSRFToken()
    }
  };

  return fetch(path, Object.assign(initOptions, options))
    .then((response) => response.json())
}

export default apiFetch;
