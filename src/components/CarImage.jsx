import { useState } from 'react';
import { isImageUrl } from '../utils/validation';

export default function CarImage({ src, alt }) {
  const [failedUrl, setFailedUrl] = useState(null);
  if (!isImageUrl(src) || failedUrl === src) {
    return <div className="image-placeholder" role="img" aria-label={alt}>Image unavailable</div>;
  }
  return <img className="car-image" src={src} alt={alt} loading="lazy"
    referrerPolicy="no-referrer" onError={() => setFailedUrl(src)} />;
}
