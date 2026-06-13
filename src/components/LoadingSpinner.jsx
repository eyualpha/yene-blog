const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-20 text-muted">
    <div className="w-10 h-10 border-4 border-app border-t-[var(--accent)] rounded-full animate-spin mb-4" />
    <p className="text-secondary text-sm">{message}</p>
  </div>
);

export default LoadingSpinner;
