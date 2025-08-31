import Papa from 'papaparse';
import { Artwork } from '@/types/artwork';

interface CSVRow {
  cover?: string;
  artworkName?: string;
  songGenre?: string;
  artist?: string;
  songTitle?: string;
  artisticCategory?: string;
  mood?: string;
  year?: string;
  collections?: string;
  [key: string]: string | undefined;
}

export function parseCSVData(csvContent: string): Artwork[] {
  const results = Papa.parse<CSVRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => {
      // Map CSV headers to our interface properties
      const headerMap: { [key: string]: string } = {
        'cover': 'cover',
        'artwork name': 'artworkName',
        'song genre': 'songGenre', 
        'artist': 'artist',
        'song title': 'songTitle',
        'artistic category': 'artisticCategory',
        'mood': 'mood',
        'year': 'year',
        'collections': 'collections'
      };
      return headerMap[header.toLowerCase()] || header;
    }
  });

  return results.data
    .filter((item: CSVRow) => item.cover && item.artworkName)
    .map((item: CSVRow) => ({
      cover: item.cover || '',
      artworkName: item.artworkName || '',
      songGenre: item.songGenre || '',
      artist: item.artist || '',
      songTitle: item.songTitle || '',
      artisticCategory: item.artisticCategory || '',
      mood: item.mood || '',
      year: item.year || '',
      collections: item.collections || ''
    }));
}

export function getUniqueValues(artworks: Artwork[], field: keyof Artwork): string[] {
  const values = artworks
    .map(artwork => artwork[field])
    .filter(Boolean)
    .flatMap(value => {
      // Handle comma-separated values like in collections and mood fields
      if (typeof value === 'string' && value.includes(',')) {
        return value.split(',').map(v => v.trim());
      }
      return [value];
    })
    .filter((value, index, array) => array.indexOf(value) === index)
    .sort();

  return values as string[];
}

export function filterArtworks(artworks: Artwork[], filters: {
  genre?: string;
  mood?: string; 
  category?: string;
  collection?: string;
  search?: string;
}): Artwork[] {
  return artworks.filter(artwork => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const searchFields = [
        artwork.artworkName,
        artwork.artist,
        artwork.songTitle,
        artwork.songGenre,
        artwork.mood,
        artwork.artisticCategory,
        artwork.collections
      ].join(' ').toLowerCase();
      
      if (!searchFields.includes(searchLower)) {
        return false;
      }
    }

    if (filters.genre && !artwork.songGenre?.toLowerCase().includes(filters.genre.toLowerCase())) {
      return false;
    }

    if (filters.mood && !artwork.mood?.toLowerCase().includes(filters.mood.toLowerCase())) {
      return false;
    }

    if (filters.category && !artwork.artisticCategory?.toLowerCase().includes(filters.category.toLowerCase())) {
      return false;
    }

    if (filters.collection && !artwork.collections?.toLowerCase().includes(filters.collection.toLowerCase())) {
      return false;
    }

    return true;
  });
}