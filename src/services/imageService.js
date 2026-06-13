export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const extractCloudName = (value) => {
  if (!value) return null;
  const trimmed = value.trim();
  const fromUrl = trimmed.match(/@([\w-]+)$/);
  if (trimmed.startsWith("cloudinary://") && fromUrl) return fromUrl[1];
  return trimmed;
};

const getCloudinaryConfig = () => {
  const cloudName = extractCloudName(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();

  if (!cloudName && !uploadPreset) {
    return { cloudName: null, uploadPreset: null, configError: null };
  }

  if (!cloudName) {
    return {
      cloudName: null,
      uploadPreset: null,
      configError:
        "Set VITE_CLOUDINARY_CLOUD_NAME to your cloud name (e.g. dviurlpu8 — the part after @ in CLOUDINARY_URL).",
    };
  }

  if (!uploadPreset) {
    return {
      cloudName,
      uploadPreset: null,
      configError:
        'Set VITE_CLOUDINARY_UPLOAD_PRESET to an unsigned preset name. Create one: Cloudinary → Settings → Upload → Upload presets → Add → name it "yene_blog", Signing mode: Unsigned.',
    };
  }

  if (uploadPreset.startsWith("cloudinary://")) {
    return {
      cloudName,
      uploadPreset: null,
      configError:
        "VITE_CLOUDINARY_UPLOAD_PRESET must be the preset name (e.g. yene_blog), NOT your CLOUDINARY_URL. The API URL contains a secret and cannot be used in the browser. Create an Unsigned upload preset instead.",
    };
  }

  if (!/^[\w-]+$/.test(uploadPreset)) {
    return {
      cloudName,
      uploadPreset: null,
      configError:
        "VITE_CLOUDINARY_UPLOAD_PRESET looks invalid. Use only the preset name from Cloudinary (letters, numbers, underscores, hyphens).",
    };
  }

  return { cloudName, uploadPreset, configError: null };
};

export const isImageUploadConfigured = () => {
  const { cloudName, uploadPreset, configError } = getCloudinaryConfig();
  return Boolean(cloudName && uploadPreset && !configError);
};

export const getImageUploadConfigError = () => getCloudinaryConfig().configError;

export const validateImageFile = (file) => {
  if (!file) return { valid: false, error: "No file selected." };
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: "Only JPG, PNG, WebP, or GIF images are allowed." };
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return { valid: false, error: "Image must be smaller than 5 MB." };
  }
  return { valid: true };
};

/**
 * Uploads cover images to Cloudinary (free tier — no credit card required).
 * https://cloudinary.com/users/register/free
 */
export const uploadBlogCover = async (file, userId, blogId) => {
  const validation = validateImageFile(file);
  if (!validation.valid) throw new Error(validation.error);

  const { cloudName, uploadPreset, configError } = getCloudinaryConfig();

  if (configError) throw new Error(configError);

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Image upload is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your .env file."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", `yene-blog/${userId}/${blogId}`);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const message = error.error?.message || "Failed to upload image.";

    if (/preset not found/i.test(message)) {
      throw new Error(
        `Cloudinary upload preset "${uploadPreset}" was not found. In Cloudinary Dashboard → Settings → Upload → Upload presets, create a preset with Signing mode "Unsigned" and use that exact name in .env as VITE_CLOUDINARY_UPLOAD_PRESET.`
      );
    }

    throw new Error(message);
  }

  const data = await response.json();
  return { url: data.secure_url, publicId: data.public_id };
};

/** Cloudinary free tier: images stay in your account; we only clear the URL in Firestore. */
export const deleteBlogCover = async () => {};
