import { useEffect, useState } from "react";

const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed top-[65px] left-0 right-0 z-40 h-0.5 bg-transparent">
      <div
        className="h-full bg-accent transition-all duration-150 ease-out shadow-[0_0_8px_var(--accent)]"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />
    </div>
  );
};

export default ReadingProgress;
