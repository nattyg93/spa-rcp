import { frontendBaseUrl } from '@/config';

export default function() {
  const path = window.location.pathname.endsWith('/')
    ? window.location.pathname
    : `${window.location.pathname}/`;
  return path.replace(frontendBaseUrl, '/');
}
