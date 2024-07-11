import { useFormContext } from "react-hook-form";

export const useMediaUploadErrorHandler = () => {
  const form = useFormContext();

  const MAX_IMAGE_SIZE_IN_BYTES = 5 * 1024 * 1024; // 5 MB
  // const MIN_IMAGE_SIZE_IN_BYTES = 30 * 1024; // 30 KB

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

    if (file.size > MAX_IMAGE_SIZE_IN_BYTES) {
      form.setError(name, {
        type: "manual",
        message: `File size should be less than 5MB - "${file.name}"`,
      });

      return false;
    }

    return true;
  };

  return {
    mediaUploadErrorHandler,
    MAX_IMAGE_SIZE_IN_BYTES,
  };
};
