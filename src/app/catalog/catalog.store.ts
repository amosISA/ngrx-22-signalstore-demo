import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Movie } from './movie.model';
import { withRequestStatus, withStatusMessage } from './request-status.feature';

type SelectionResult = { kind: 'ready'; note: string } | { kind: 'error'; message: string };

interface CatalogState {
  selectedMovie: Movie | null;
  selectionResult: SelectionResult;
}

const initialState: CatalogState = {
  selectedMovie: null,
  selectionResult: {
    kind: 'ready',
    note: 'Choose a movie to reveal its dynamic deep signals.',
  },
};

export const CatalogStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withRequestStatus(),
  withStatusMessage(),
  withComputed((store) => ({
    selectedTitle: computed(() => {
      // v22: `in` narrows Movie | null and reveals the DeepSignal<Movie>.
      const selectedMovie = store.selectedMovie();
      if (selectedMovie && 'title' in store.selectedMovie) return store.selectedMovie.title();
      return 'Choose a movie';
    }),
    selectedGenre: computed(() => {
      const selectedMovie = store.selectedMovie();
      if (selectedMovie && 'genre' in store.selectedMovie) return store.selectedMovie.genre();
      return 'Nothing selected';
    }),
    resultText: computed(() => {
      // This also works for discriminated unions of objects.
      store.selectionResult();
      if ('message' in store.selectionResult) {
        return store.selectionResult.message();
      }
      if ('note' in store.selectionResult) return store.selectionResult.note();
      return '';
    }),
  })),
  withMethods((store) => ({
    selectMovie(movie: Movie): void {
      patchState(store, {
        selectedMovie: movie,
        selectionResult: {
          kind: 'ready',
          note: `Now showing “${movie.title}” through deep signals.`,
        },
      });
    },
    clearSelection(): void {
      patchState(store, initialState);
    },
    showSelectionError(): void {
      patchState(store, {
        selectionResult: {
          kind: 'error',
          message: 'The result changed branch and now exposes message().',
        },
      });
    },
  })),
);
