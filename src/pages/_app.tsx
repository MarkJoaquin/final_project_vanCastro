import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Duración de la animación
    });
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp; 