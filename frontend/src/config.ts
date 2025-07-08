const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_BASE_URL
    : import.meta.env.VITE_PROD_BASE_URL;

const API_URLS = {
  LOGIN: () => `${BASE_URL}${import.meta.env.VITE_AUTH_SIGN_IN}`,
  REGISTER: () => `${BASE_URL}${import.meta.env.VITE_AUTH_REGISTER}`,
};

export { API_URLS };
