export const compressImage = async (
  file: File,
  maxSize: number = 400,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Impossible de créer le contexte canvas"));
          return;
        }

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });

              console.log(`✅ Image compressée:`, {
                original: `${(file.size / 1024).toFixed(2)} KB`,
                compressé: `${(compressedFile.size / 1024).toFixed(2)} KB`,
                réduction: `${(
                  ((file.size - compressedFile.size) / file.size) *
                  100
                ).toFixed(1)}%`,
                dimensions: `${width}x${height}px`,
              });

              resolve(compressedFile);
            } else {
              reject(new Error("Erreur lors de la compression"));
            }
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = () => {
        reject(new Error("Erreur lors du chargement de l'image"));
      };
    };

    reader.onerror = () => {
      reject(new Error("Erreur lors de la lecture du fichier"));
    };
  });
};

export const validateImageFile = (
  file: File,
  maxSize: number = 5 * 1024 * 1024
): string | null => {
  if (file.size > maxSize) {
    return `L'image ne peut pas dépasser ${(maxSize / (1024 * 1024)).toFixed(
      0
    )}MB`;
  }

  if (!file.type.startsWith("image/")) {
    return "Veuillez sélectionner une image valide";
  }

  return null;
};

export const getInitials = (firstName?: string, lastName?: string): string => {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[1]}`.toUpperCase();
  }
  return "U";
};
