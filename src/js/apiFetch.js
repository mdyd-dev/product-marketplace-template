const getCSRFToken = () => {
  const meta = document.querySelector('meta[name="csrf-token"]');
  if (!meta) { throw new Error('Unable to find CSRF token meta'); }

  const csrfToken = meta.getAttribute('content');
  if (!csrfToken) { throw new Error('Unable to get CSRF token value'); }

  return csrfToken;
}

const apiFetch = (path, { method, data }) => {
  fetch(path, {
    method: method || 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(
      Object.assign(data, { authenticity_token: getCSRFToken() })
    ),
  }).then((response) => response.json())
}

export default apiFetch;
