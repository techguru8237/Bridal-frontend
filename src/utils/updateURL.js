const backend_url = import.meta.env.VITE_BACKEND_URL
export const addBaseURL = (url) => {
  return `${backend_url}${url}`;
};

export const removeBaseURL = (url) => {
  return url.replace(backend_url, '');
};