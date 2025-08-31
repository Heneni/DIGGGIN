'use client';

import { useState, useEffect, useCallback } from 'react';
import { Artwork } from '@/types/artwork';
import { ArtworkGallery } from '@/components/ArtworkGallery';
import { FilterBar } from '@/components/FilterBar';
import { filterArtworks, getUniqueValues } from '@/lib/artworks';

export default function Home() {
  const [allArtworks, setAllArtworks] = useState<Artwork[]>([]);
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Unique values for filters
  const [genres, setGenres] = useState<string[]>([]);
  const [moods, setMoods] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [collections, setCollections] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const response = await fetch('/DIGGGIN/artworks.json');
        if (!response.ok) {
          throw new Error('Failed to load artworks');
        }
        const artworks: Artwork[] = await response.json();
        
        setAllArtworks(artworks);
        setFilteredArtworks(artworks);
        
        // Extract unique values for filters
        setGenres(getUniqueValues(artworks, 'songGenre'));
        setMoods(getUniqueValues(artworks, 'mood'));
        setCategories(getUniqueValues(artworks, 'artisticCategory'));
        setCollections(getUniqueValues(artworks, 'collections'));
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleFilterChange = useCallback((filters: {
    genre?: string;
    mood?: string;
    category?: string;
    collection?: string;
    search?: string;
  }) => {
    const filtered = filterArtworks(allArtworks, filters);
    setFilteredArtworks(filtered);
  }, [allArtworks]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading amazing artworks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">DIGGGIN</h1>
            <p className="text-xl text-gray-600 mb-4">DISCDIGGER</p>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Explore a curated collection of psychedelic and contemporary artwork, 
              each piece connected to the rhythm and soul of music. 
              Discover art that transcends visual boundaries and connects with sound.
            </p>
            <div className="mt-4 text-sm text-gray-400">
              {allArtworks.length} artworks • {filteredArtworks.length} showing
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterBar
          genres={genres}
          moods={moods}
          categories={categories}
          collections={collections}
          onFilterChange={handleFilterChange}
        />
        
        <ArtworkGallery artworks={filteredArtworks} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 DIGGGIN. A modern gallery experience.</p>
            <p className="mt-2 text-sm">
              Built with Next.js • Deployed on GitHub Pages
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
