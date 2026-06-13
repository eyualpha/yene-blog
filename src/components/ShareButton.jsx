import { useState } from "react";
import { FiShare2, FiCheck } from "react-icons/fi";

const ShareButton = ({ title, url }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
        return;
      } catch {
        /* user cancelled */
      }
    }
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-elevated border border-app text-secondary hover:text-app hover:border-accent transition"
      aria-label="Share article"
    >
      {copied ? <FiCheck size={15} className="text-green-500" /> : <FiShare2 size={15} />}
      {copied ? "Link copied!" : "Share"}
    </button>
  );
};

export default ShareButton;
