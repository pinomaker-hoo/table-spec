import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface GoogleAdProps {
  slot: string;
  format?: string;
  responsive?: boolean;
  className?: string;
}

export default function GoogleAd({ slot, format = 'auto', responsive = true, className = '' }: GoogleAdProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pushed.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      return;
    }

    // 광고 로드 여부를 확인하여 높이가 잡히면 표시
    const el = adRef.current;
    if (!el) return;

    const observer = new MutationObserver(() => {
      if (el.offsetHeight > 0) {
        setVisible(true);
        observer.disconnect();
      }
    });

    observer.observe(el, { attributes: true, childList: true, subtree: true });

    // fallback: 일정 시간 후에도 높이가 잡히면 표시
    const timer = setTimeout(() => {
      if (el.offsetHeight > 0) setVisible(true);
      observer.disconnect();
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
      <ins
        ref={adRef}
        className={`adsbygoogle ${className}`}
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
