const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
    <div className="w-10 h-10 border-4 border-gray-600 border-t-white rounded-full animate-spin mb-4" />
    <p>{message}</p>
  </div>
);

export default LoadingSpinner;
