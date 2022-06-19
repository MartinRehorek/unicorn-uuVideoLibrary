import Cookies from 'js-cookie';
import { COOKIES_TOKEN } from './constants';

export const saveUserToStorage = (token, options = {}) => {
  token ? Cookies.set(COOKIES_TOKEN.name, token, options) : Cookies.set(COOKIES_TOKEN.name, null, options);
};

export const getUserFromStorage = () => Cookies.get(COOKIES_TOKEN.name);

export const removeUserFromStorage = () => Cookies.remove(COOKIES_TOKEN.name);
