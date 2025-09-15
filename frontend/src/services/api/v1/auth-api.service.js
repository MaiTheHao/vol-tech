import { withApiCache } from '../api-caching.service.js';
import { httpPost } from '../http-client.js';

export const login = (email, password) =>
	withApiCache(`/auth/login:${email}`, httpPost, '/auth/login', { email, password });

export const register = ({ name, email, password }) =>
  withApiCache(`/auth/register:${email}`, httpPost, '/auth/register', { name, email, password, });
    
    
    
  
