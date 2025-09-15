import { withApiCache } from '../api-caching.service.js';
import { httpGet } from '../http-client.js';

export const getMe = (token) => withApiCache(`me_${token}`, httpGet, '/user/me', { Authorization: `Bearer ${token}` });
export const getProfile = (token) => withApiCache('user-profile', httpGet, '/user/profile', { Authorization: `Bearer ${token}` });
  
    
