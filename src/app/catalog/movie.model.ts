export type MovieGenre = 'Adventure' | 'Drama' | 'Mystery' | 'Sci-Fi' | 'Thriller';

export interface Movie {
  id: number;
  title: string;
  genre: MovieGenre;
  year: number;
  rating: string;
  runtime: string;
  synopsis: string;
  imageUrl: string;
  imageAlt: string;
  creditLabel: string;
  creditUrl: string;
}

export const MOVIES: readonly Movie[] = [
  {
    id: 1,
    title: 'Afterlight',
    genre: 'Sci-Fi',
    year: 2026,
    rating: '8.4',
    runtime: '1h 54m',
    synopsis:
      'A radio astronomer follows an impossible signal into the Arctic night and finds a sky that remembers.',
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Aurora_on_a_dark_night_in_February_%2892a1c8be-b8db-4824-801e-3e9b9bc2231d%29.jpg/960px-Aurora_on_a_dark_night_in_February_%2892a1c8be-b8db-4824-801e-3e9b9bc2231d%29.jpg',
    imageAlt: 'Green aurora shining above a dark snowy landscape',
    creditLabel: 'NPS Photo / Tim Rains · Public domain',
    creditUrl:
      'https://commons.wikimedia.org/wiki/File:Aurora_on_a_dark_night_in_February_(92a1c8be-b8db-4824-801e-3e9b9bc2231d).jpg',
  },
  {
    id: 2,
    title: 'The Last Horizon',
    genre: 'Adventure',
    year: 2025,
    rating: '7.9',
    runtime: '2h 06m',
    synopsis:
      'Two estranged sisters cross a desert of shifting dunes to finish the journey their father began.',
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2b/Climbing_the_Merzouga_Dunes.jpg/960px-Climbing_the_Merzouga_Dunes.jpg',
    imageAlt: 'Travellers climbing warm orange dunes beneath a clear sky',
    creditLabel: 'Mustang Joe · CC0',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Climbing_the_Merzouga_Dunes.jpg',
  },
  {
    id: 3,
    title: 'One Small Step',
    genre: 'Drama',
    year: 2026,
    rating: '9.1',
    runtime: '1h 47m',
    synopsis:
      'An ageing engineer revisits the mission that changed the world and the family moments he missed.',
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/41/A_Man_on_the_Moon%2C_AS11-40-5903_%28cropped%29.jpg/960px-A_Man_on_the_Moon%2C_AS11-40-5903_%28cropped%29.jpg',
    imageAlt: 'Astronaut standing on the Moon beside scientific equipment',
    creditLabel: 'Neil A. Armstrong / NASA · Public domain',
    creditUrl:
      'https://commons.wikimedia.org/wiki/File:A_Man_on_the_Moon,_AS11-40-5903_(cropped).jpg',
  },
  {
    id: 4,
    title: 'Midnight District',
    genre: 'Thriller',
    year: 2025,
    rating: '8.0',
    runtime: '1h 42m',
    synopsis:
      'A night-shift dispatcher hears a call from tomorrow and has until sunrise to change its ending.',
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/Jersey_City_night_skyline.jpg/960px-Jersey_City_night_skyline.jpg',
    imageAlt: 'City skyline glowing across the water at night',
    creditLabel: 'Alfred Twu · CC0',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Jersey_City_night_skyline.jpg',
  },
  {
    id: 5,
    title: 'Into the Quiet',
    genre: 'Mystery',
    year: 2024,
    rating: '7.7',
    runtime: '1h 49m',
    synopsis:
      'A sound recordist enters a fogbound forest where every missing voice seems to be waiting for her.',
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/Dense_forest_under_fog_%28Unsplash%29.jpg/960px-Dense_forest_under_fog_%28Unsplash%29.jpg',
    imageAlt: 'Dense evergreen forest disappearing into pale fog',
    creditLabel: 'Nathan Anderson · CC0',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Dense_forest_under_fog_(Unsplash).jpg',
  },
  {
    id: 6,
    title: 'Tides of Home',
    genre: 'Drama',
    year: 2025,
    rating: '8.6',
    runtime: '1h 58m',
    synopsis:
      'A lighthouse keeper prepares for one final storm as his daughter returns to the coast she left behind.',
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/Sun_Fisherman_Lighthouse_%28212319699%29.jpeg/960px-Sun_Fisherman_Lighthouse_%28212319699%29.jpeg',
    imageAlt: 'Lighthouse and fisherman silhouetted against a golden sunset',
    creditLabel: 'João Cautela · CC0',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Sun_Fisherman_Lighthouse_(212319699).jpeg',
  },
];
