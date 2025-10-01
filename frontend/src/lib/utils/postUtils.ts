import { POST_CATEGORIES, POST_STATUS } from "@/lib/types/posts";

export const getCategoryLabel = (category: string) => {
  switch (category) {
    case POST_CATEGORIES.TATTOO:
      return "Tatouage";
    case POST_CATEGORIES.FLASH:
      return "Flash";
    case POST_CATEGORIES.INSPIRATION:
      return "Inspiration";
    case POST_CATEGORIES.OTHER:
      return "Autre";
    default:
      return category;
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case POST_STATUS.AVAILABLE:
      return "Disponible";
    case POST_STATUS.BOOKED:
      return "Réservé";
    case POST_STATUS.COMPLETED:
      return "Terminé";
    default:
      return status;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case POST_STATUS.AVAILABLE:
      return "bg-green-100 text-green-800";
    case POST_STATUS.BOOKED:
      return "bg-yellow-100 text-yellow-800";
    case POST_STATUS.COMPLETED:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const formatPostDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const createErrorHandler =
  (setError: (error: string | null) => void) =>
  (err: unknown, defaultMessage: string) => {
    const errorMessage = err instanceof Error ? err.message : defaultMessage;
    setError(errorMessage);
    throw err;
  };
