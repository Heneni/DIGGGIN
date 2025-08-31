'use client';

import { useState } from 'react';
import { Artwork } from '@/types/artwork';
import { ArtworkCard } from './ArtworkCard';

interface ArtworkGalleryProps {
  artworks: Artwork[];
}

export function ArtworkGallery({ artworks }: ArtworkGalleryProps) {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  const handleArtworkSelect = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
  };

  const closeModal = () => {
    setSelectedArtwork(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {artworks.map((artwork, index) => (
          <ArtworkCard
            key={`${artwork.cover}-${index}`}
            artwork={artwork}
            onSelect={handleArtworkSelect}
          />
        ))}
      </div>

      {artworks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No artworks found matching your criteria.</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms.</p>
        </div>
      )}

      {/* Modal for selected artwork */}
      {selectedArtwork && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 bg-white rounded-full p-2 shadow-md"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={selectedArtwork.cover}
                    alt={selectedArtwork.artworkName}
                    className="w-full h-64 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                  />
                </div>
                
                <div className="md:w-1/2 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {selectedArtwork.artworkName}
                  </h2>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="font-semibold text-gray-700">Artist:</span>
                      <span className="ml-2 text-gray-600">{selectedArtwork.artist}</span>
                    </div>
                    
                    <div>
                      <span className="font-semibold text-gray-700">Song:</span>
                      <span className="ml-2 text-gray-600">{selectedArtwork.songTitle}</span>
                    </div>
                    
                    <div>
                      <span className="font-semibold text-gray-700">Genre:</span>
                      <span className="ml-2 text-gray-600">{selectedArtwork.songGenre}</span>
                    </div>
                    
                    <div>
                      <span className="font-semibold text-gray-700">Category:</span>
                      <span className="ml-2 text-gray-600">{selectedArtwork.artisticCategory}</span>
                    </div>
                    
                    <div>
                      <span className="font-semibold text-gray-700">Mood:</span>
                      <span className="ml-2 text-gray-600">{selectedArtwork.mood}</span>
                    </div>
                    
                    <div>
                      <span className="font-semibold text-gray-700">Year:</span>
                      <span className="ml-2 text-gray-600">{selectedArtwork.year}</span>
                    </div>
                    
                    <div>
                      <span className="font-semibold text-gray-700">Collections:</span>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {selectedArtwork.collections.split(',').map((collection, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                          >
                            {collection.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}