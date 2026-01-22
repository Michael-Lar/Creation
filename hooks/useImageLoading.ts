import { useCallback, useRef, useState } from 'react';

export function useImageLoading(itemIds: number[]) {
  const [loadingImages, setLoadingImages] = useState<Set<number>>(
    () => new Set(itemIds)
  );
  const loadedImagesRef = useRef<Set<number>>(new Set());

  const handleImageLoad = useCallback((id: number) => {
    setLoadingImages((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    loadedImagesRef.current.add(id);
  }, []);

  const resetLoading = useCallback((ids: number[]) => {
    setLoadingImages(() => {
      const next = new Set<number>();
      ids.forEach((id) => {
        if (!loadedImagesRef.current.has(id)) {
          next.add(id);
        }
      });
      return next;
    });
  }, []);

  return { loadingImages, handleImageLoad, resetLoading };
}
