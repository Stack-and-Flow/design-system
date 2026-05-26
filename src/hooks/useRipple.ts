import { type RefObject, useEffect } from 'react';

export const useRipple = (ref: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const createRipple = (event: MouseEvent) => {
      if (!ref.current) {
        return;
      }
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');

      const max = Math.max(ref.current.offsetWidth, ref.current.offsetHeight);
      ripple.style.width = ripple.style.height = max * 2 + 'px';

      const rect = ref.current.getBoundingClientRect();
      ripple.style.left = event.clientX - rect.left - max + 'px';
      ripple.style.top = event.clientY - rect.top - max + 'px';

      ref.current.appendChild(ripple);

      // Remove ripple after animation ends
      ripple.addEventListener('animationend', () => {
        ripple.remove();
      });
    };

    const element = ref.current;
    if (element) {
      element.addEventListener('click', createRipple);
    }

    // Cleanup event listener on unmount
    return () => {
      if (element) {
        element.removeEventListener('click', createRipple);
      }
    };
  }, [ref]);
};
