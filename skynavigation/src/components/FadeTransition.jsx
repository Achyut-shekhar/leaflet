// components/FadeTransition.jsx
import { useEffect, useState } from "react";

const FadeTransition = ({ show, duration = 300, children }) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      const timeout = setTimeout(() => setIsVisible(false), duration);
      return () => clearTimeout(timeout);
    }
  }, [show, duration]);

  return (
    <div
      className={`transition-opacity duration-${duration} ease-in-out ${
        show ? "opacity-100" : "opacity-0"
      }`}
      style={{ display: isVisible ? "block" : "none" }}
    >
      {children}
    </div>
  );
};

export default FadeTransition;
