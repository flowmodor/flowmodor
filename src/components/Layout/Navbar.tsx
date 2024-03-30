import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (window.location.pathname !== '/') {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      const windowHeight = window.innerHeight - 1;
      if (window.scrollY > windowHeight) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-10 justify-center backdrop-blur border-[#FFFFFF20] border-b flex -mb-16 h-16 items-center transition-all ${
        isScrolled ? 'text-white' : 'text-background'
      }`}
    >
      <a
        href="/"
        className="left-5 absolute flex cursor-pointer items-center gap-2 text-2xl font-bold"
      >
        <img
          src="/logo.png"
          alt="Logo of Flowmodor"
          width={32}
          height={32}
          className="rounded-md bg-background"
          draggable={false}
        />
        <div>Flowmodor</div>
      </a>
      <div className="hidden sm:flex gap-10 font-medium text-lg">
        <a href="/blog">Blog</a>
        <a href="/pricing">Pricing</a>
      </div>
      <a
        href="https://app.flowmodor.com/signin"
        className={`right-5 absolute text-sm font-medium cursor-pointer rounded-md p-2 transition-all ${
          isScrolled ? 'text-background bg-primary' : 'text-white bg-background'
        }`}
      >
        Get started
      </a>
    </nav>
  );
}
