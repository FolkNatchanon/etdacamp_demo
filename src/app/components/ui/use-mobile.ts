import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    
    // Defer setting state to prevent synchronous cascading render warning on mount
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    const frameId = requestAnimationFrame(checkMobile);

    return () => {
      cancelAnimationFrame(frameId);
      mql.removeEventListener("change", onChange);
    };
  }, []);

  return !!isMobile;
}
