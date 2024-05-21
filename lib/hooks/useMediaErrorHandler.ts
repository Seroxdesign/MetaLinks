import { useFormContext } from "react-hook-form";

export const useMediaUploadErrorHandler = () => {
  const form = useFormContext();

  const ALLOWED_IMAGE_EXTENSIONS = ["jpeg", "jpg", "png"];
  const MAX_IMAGE_SIZE_IN_BYTES = 5 * 1024 * 1024; // 5 MB
  const MIN_IMAGE_SIZE_IN_BYTES = 30 * 1024; // 30 KB

  const isAllowedImageExtension = (extensionToCheck: string) =>
    ALLOWED_IMAGE_EXTENSIONS.includes(extensionToCheck.toLowerCase());

  const isAllowedMediaExtension = (extensionToCheck: string) =>
    isAllowedImageExtension(extensionToCheck);

  const mediaUploadErrorHandler = ({
    file,
    name,
  }: {
    file: File | null;
    name: string;
  }) => {
    if (!file) {
      form.setError(name, {
        type: "manual",
        message: "File is required",
      });

      return false;
    }

    const fileExtension = file.name.split(".").pop() ?? "";

    if (!isAllowedMediaExtension(fileExtension)) {
      form.setError(name, {
        type: "manual",
        message: `Only ${ALLOWED_IMAGE_EXTENSIONS.join(
          ", "
        )} files are allowed - "${file.name}"`,
      });

      return false;
    }

    if (isAllowedImageExtension(fileExtension)) {
      if (file.size > MAX_IMAGE_SIZE_IN_BYTES) {
        form.setError(name, {
          type: "manual",
          message: `File size should be less than 5MB - "${file.name}"`,
        });

        return false;
      }

      if (file.size < MIN_IMAGE_SIZE_IN_BYTES) {
        form.setError(name, {
          type: "manual",
          message: `File size should be greater than 350 KBs - "${file.name}"`,
        });

        return false;
      }
    }

    return true;
  };

  return {
    mediaUploadErrorHandler,
    isAllowedImageExtension,
    isAllowedMediaExtension,
    ALLOWED_IMAGE_EXTENSIONS,
    MAX_IMAGE_SIZE_IN_BYTES,
    MIN_IMAGE_SIZE_IN_BYTES,
  };
};
