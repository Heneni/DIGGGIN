'use client';

import { useState } from 'react';
import { Artwork } from '@/types/artwork';

interface ArtworkCardProps {
  artwork: Artwork;
  onSelect?: (artwork: Artwork) => void;
}

export function ArtworkCard({ artwork, onSelect }: ArtworkCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect(artwork);
    }
  };

  return (
    <div 
      className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      <div className="aspect-square relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        {!imageError ? (
          <img
            src={artwork.cover}
            alt={artwork.artworkName}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
            <span className="text-gray-600 text-sm">Image unavailable</span>
          </div>
        )}
        
        {/* Overlay with details */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-end p-4">
          <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="font-semibold text-sm mb-1 line-clamp-2">{artwork.artworkName}</h3>
            <p className="text-xs text-gray-200 mb-1">{artwork.artist} - {artwork.songTitle}</p>
            <div className="flex flex-wrap gap-1">
              {artwork.mood && (
                <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                  {artwork.mood.split(',')[0].trim()}
                </span>
              )}
              {artwork.songGenre && (
                <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                  {artwork.songGenre}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}