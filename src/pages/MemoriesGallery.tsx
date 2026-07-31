import React, { useState, useEffect } from 'react';
import SphereImageGrid, { type ImageData } from '@/components/ui/img-sphere';
import { StorageService } from '../services/storageService';

const EVENT_TITLES = [
  'CodeMatrix 2025 Hackathon Grand Finale & Prize Ceremony',
  '280+ Student Developers Coding Sprint at Night',
  'AI & Neural Networks Hands-On Lab Workshop',
  'CyberShield CTF Ethical Hacking Leaderboard Reveal',
  'Fullstack React & Node.js Bootcamp Graduation',
  'Annual GITS Freshers Orientation & Wing Showcase',
  'Cloud Infrastructure & DevOps Masterclass',
  'UI/UX Design Systems Workshop & Figma Sprint',
  'Open Source Summer Code Fest Winner Showcase',
  'Web3 & Smart Contract Security Summit 2025',
];

const UNSPLASH_POOL = [
  'https://images.unsplash.com/photo-1540575467063-178a50f2ab34?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
];

interface MemoriesGalleryProps {
  userRole?: 'guest' | 'student' | 'admin';
}

export const MemoriesGallery: React.FC<MemoriesGalleryProps> = () => {
  const [images, setImages] = useState<ImageData[]>([]);

  // Prevent vertical page scroll on memory globe page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    const storedPhotos = StorageService.getGalleryPhotos();

    const generatedImages: ImageData[] = [];
    const totalCount = 60;

    for (let i = 0; i < totalCount; i++) {
      const stored = storedPhotos[i % storedPhotos.length];
      const fallbackUrl = UNSPLASH_POOL[i % UNSPLASH_POOL.length];
      const fallbackTitle = EVENT_TITLES[i % EVENT_TITLES.length];

      generatedImages.push({
        id: `globe-img-${i + 1}`,
        src: stored?.imageUrl || fallbackUrl,
        alt: stored?.title || fallbackTitle,
        title: stored?.title || fallbackTitle,
      });
    }

    setImages(generatedImages);
  }, []);

  return (
    <div style={{
      height: 'calc(100vh - 72px)',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative',
      background: 'radial-gradient(circle at 50% 50%, rgba(121, 40, 202, 0.15) 0%, rgba(8, 12, 20, 1) 70%)',
    }}>
      <SphereImageGrid
        images={images}
        containerSize={620}
        sphereRadius={225}
        dragSensitivity={0.8}
        momentumDecay={0.96}
        maxRotationSpeed={6}
        baseImageScale={0.15}
        hoverScale={1.3}
        perspective={1000}
        autoRotate={true}
        autoRotateSpeed={0.22}
      />
    </div>
  );
};
