import { FiUploadCloud, FiX, FiImage } from "react-icons/fi";
import { validateImageFile, isImageUploadConfigured, getImageUploadConfigError } from "../services/imageService";

const ImageUpload = ({
  file,
  previewUrl,
  onFileSelect,
  onRemove,
  disabled = false,
  error,
}) => {
  const configured = isImageUploadConfigured();
  const configError = getImageUploadConfigError();
  const handleChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const validation = validateImageFile(selected);
    if (!validation.valid) {
      onFileSelect(null, validation.error);
      return;
    }

    onFileSelect(selected, null);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (disabled) return;

    const dropped = e.dataTransfer.files?.[0];
    if (!dropped) return;

    const validation = validateImageFile(dropped);
    if (!validation.valid) {
      onFileSelect(null, validation.error);
      return;
    }

    onFileSelect(dropped, null);
  };

  const displayUrl = file ? URL.createObjectURL(file) : previewUrl;

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-secondary mb-2">
        Cover Image <span className="text-muted font-normal">(optional)</span>
      </label>

      {configError && (
        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 mb-3">
          {configError}
        </p>
      )}

      {!configured && !configError && (
        <p className="text-xs text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2 mb-3">
          Add Cloudinary keys to <code className="text-accent">.env</code> to enable uploads.
          See <code className="text-accent">.env.example</code> for setup steps.
        </p>
      )}

      {displayUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-app group">
          <img
            src={displayUrl}
            alt="Cover preview"
            className="w-full h-48 md:h-56 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <label className="cursor-pointer px-4 py-2 bg-white text-black text-sm font-semibold rounded-xl hover:bg-gray-100 transition">
              Replace
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleChange}
                disabled={disabled}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={onRemove}
              disabled={disabled}
              className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition flex items-center gap-1"
            >
              <FiX size={16} /> Remove
            </button>
          </div>
        </div>
      ) : configured ? (
        <label
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`flex flex-col items-center justify-center gap-3 w-full h-44 border-2 border-dashed border-app rounded-2xl bg-input transition-all cursor-pointer hover:border-accent hover:bg-accent-soft ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center text-accent">
            <FiUploadCloud size={22} />
          </div>
          <div className="text-center px-4">
            <p className="text-sm font-medium text-app">
              Drop an image here or <span className="text-accent">browse</span>
            </p>
            <p className="text-xs text-muted mt-1 flex items-center justify-center gap-1">
              <FiImage size={12} /> JPG, PNG, WebP, GIF · max 5 MB
            </p>
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleChange}
            disabled={disabled}
            className="hidden"
          />
        </label>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 w-full h-44 border-2 border-dashed border-app rounded-2xl bg-input opacity-50">
          <FiUploadCloud size={22} className="text-muted" />
          <p className="text-sm text-muted">Configure Cloudinary to upload images</p>
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
};

export default ImageUpload;
