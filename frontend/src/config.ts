const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_BASE_URL
    : import.meta.env.VITE_PROD_BASE_URL;

const API_URLS = {
  LOGIN: () => `${BASE_URL}${import.meta.env.VITE_AUTH_SIGN_IN}`,
  REGISTER: () => `${BASE_URL}${import.meta.env.VITE_AUTH_REGISTER}`,
  CREATE_USER: () => `${BASE_URL}${import.meta.env.VITE_USER_CREATE_USER}`,
  DEACTIVATE_USER: (userId: number) =>
    `${BASE_URL}${import.meta.env.VITE_USER_DEACTIVATE_USER}/${userId}`,
  DELETE_USER: (userId: number) =>
    `${BASE_URL}${import.meta.env.VITE_USER_DELETE_USER}/${userId}`,
  UPDATE_USER: (userId: number) =>
    `${BASE_URL}${import.meta.env.VITE_USER_UPDATE_USER}/${userId}`,
  GET_PROFILE: () => `${BASE_URL}${import.meta.env.VITE_USER_GET_PROFILE}`,
  GET_PROFILE_BY_ID: (userId: number) =>
    `${BASE_URL}${import.meta.env.VITE_USER_GET_PROFILE_BY_ID}/${userId}`,
  GET_AUDITS: () => `${BASE_URL}${import.meta.env.VITE_USER_ALL_AUDITS}`,
  GET_ALL_USERS: (page: number, limit: number) =>
    `${BASE_URL}${
      import.meta.env.VITE_USER_GETALL
    }?page=${page}&limit=${limit}`,
};

export { API_URLS };
