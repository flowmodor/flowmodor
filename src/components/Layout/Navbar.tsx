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
      className={`sticky top-0 z-10 -mb-16 flex h-16 items-center justify-center border-b border-[#FFFFFF20] backdrop-blur transition-all ${
        isScrolled ? 'text-white' : 'text-background'
      }`}
    >
      <a
        href="/"
        className="absolute left-5 flex cursor-pointer items-center gap-2 text-2xl font-bold"
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
      <div className="hidden gap-10 text-lg font-medium sm:flex">
        <a href="/blog">Blog</a>
        <a href="/pricing">Pricing</a>
      </div>
      <a
        href="https://app.flowmodor.com/signin"
        className={`absolute right-5 cursor-pointer rounded-md p-2 text-sm font-medium transition-all ${
          isScrolled ? 'bg-primary text-background' : 'bg-background text-white'
        }`}
      >
        Get started
      </a>
    </nav>
  );
}
