import React, { useState, useEffect } from 'react';
import { MediaItem } from '../types';
import { DEFAULT_MEDIA_LIBRARY } from '../data';
import { AdminMediaLibrary } from './AdminMediaLibrary';
import { saveMediaToIDB } from '../lib/idbStorage';

export interface MediaGalleryProps {
  mediaList?: MediaItem[];
  onSaveMedia?: (updatedList: MediaItem[]) => Promise<void> | void;
  isModalPicker?: boolean;
  onSelectMedia?: (url: string) => void;
  onCloseModal?: () => void;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  mediaList: propMediaList,
  onSaveMedia: propOnSaveMedia,
  isModalPicker = false,
  onSelectMedia,
  onCloseModal
}) => {
  const [localMedia, setLocalMedia] = useState<MediaItem[]>(() => {
    if (propMediaList && propMediaList.length > 0) return propMediaList;
    try {
      const saved = localStorage.getItem("tb_resurs_media") || localStorage.getItem("media_gallery");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return propMediaList || DEFAULT_MEDIA_LIBRARY;
  });

  useEffect(() => {
    if (propMediaList && propMediaList.length >= localMedia.length) {
      setLocalMedia(propMediaList);
    }
  }, [propMediaList]);

  const handleSave = async (updatedList: MediaItem[]) => {
    setLocalMedia(updatedList);
    try {
      localStorage.setItem("tb_resurs_media", JSON.stringify(updatedList));
      localStorage.setItem("media_gallery", JSON.stringify(updatedList));
    } catch (e) {}
    try {
      await saveMediaToIDB(updatedList);
    } catch (e) {}
    if (propOnSaveMedia) {
      await propOnSaveMedia(updatedList);
    }
  };

  return (
    <AdminMediaLibrary
      mediaList={propMediaList || localMedia}
      onSaveMedia={handleSave}
      isModalPicker={isModalPicker}
      onSelectMedia={onSelectMedia}
      onCloseModal={onCloseModal}
    />
  );
};

export default MediaGallery;
