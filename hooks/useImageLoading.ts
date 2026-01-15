import { useCallback, useState } from 'react';

export function useImageLoading(itemIds: number[]) {
  const [loadingImages, setLoadingImages] = useState<Set<number>>(
    () => new Set(itemIds)
  );

  const handleImageLoad = useCallback((id: number) => {
    setLoadingImages((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const resetLoading = useCallback((ids: number[]) => {
    setLoadingImages(new Set(ids));
  }, []);

  return { loadingImages, handleImageLoad, resetLoading };
}
