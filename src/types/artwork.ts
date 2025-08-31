export interface Artwork {
  cover: string;
  artworkName: string;
  songGenre: string;
  artist: string;
  songTitle: string;
  artisticCategory: string;
  mood: string;
  year: string;
  collections: string;
}

export interface ArtworkFilter {
  genre?: string;
  mood?: string;
  category?: string;
  collection?: string;
  search?: string;
}