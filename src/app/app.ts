import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  resource,
  signal,
} from '@angular/core';
import {
  extendResource,
  withPreviousValueOnLoading,
  withValueOnError,
} from '@ngrx/signals/resource';
import { Store } from '@ngrx/store';
import { catalogActions } from './catalog/catalog.actions';
import { CatalogStore } from './catalog/catalog.store';
import { MOVIES, Movie, MovieGenre } from './catalog/movie.model';
import { CodeBlock } from './shared/code-block';

const wait = (milliseconds: number, abortSignal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(resolve, milliseconds);
    abortSignal.addEventListener('abort', () => {
      window.clearTimeout(timeout);
      reject(abortSignal.reason);
    });
  });

type GenreFilter = 'All' | MovieGenre;
type CodeExampleId = 'resources' | 'deep-signals' | 'feature-types' | 'devtools';

const codeExamples = {
  resources: {
    label: 'Resource extensions code',
    code: `extendResource(
  resource({ params, loader }),
  withPreviousValueOnLoading(),
  withValueOnError([]),
);`,
  },
  'deep-signals': {
    label: 'Dynamic deep signals code',
    code: `const selectedMovie = store.selectedMovie();

if (selectedMovie && 'title' in store.selectedMovie) {
  return store.selectedMovie.title();
}`,
  },
  'feature-types': {
    label: 'Reusable feature types code',
    code: `export type RequestStatusFeature =
  SignalStoreFeatureType<typeof withRequestStatus>;

return signalStoreFeature(
  type<RequestStatusFeature>(),
  withComputed(({ isPending, requestError }) => ({
    statusMessage: computed(() => {
      if (isPending()) return 'Updating the programme…';
      return requestError() ?? 'Tonight’s programme is ready';
    }),
  })),
);`,
  },
  devtools: {
    label: 'Redux DevTools action creators code',
    code: `provideStoreDevtools({
  name: 'NgRx 22 · ReelNight',
  maxAge: 25,
  actionCreators: catalogActions,
});`,
  },
} as const satisfies Record<CodeExampleId, { label: string; code: string }>;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeBlock],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  readonly catalogStore = inject(CatalogStore);
  private readonly document = inject(DOCUMENT);
  private readonly reduxStore = inject(Store);

  protected readonly featuredMovie = MOVIES[0];
  protected readonly genres: readonly GenreFilter[] = [
    'All',
    'Sci-Fi',
    'Adventure',
    'Drama',
    'Thriller',
    'Mystery',
  ];
  protected readonly query = signal('');
  protected readonly genre = signal<GenreFilter>('All');
  protected readonly forceError = signal(false);
  protected readonly selectedCodeExampleId = signal<CodeExampleId>('resources');
  protected readonly selectedCodeExample = computed(
    () => codeExamples[this.selectedCodeExampleId()],
  );

  protected readonly moviesResource = extendResource(
    resource({
      params: () => ({
        query: this.query().trim().toLocaleLowerCase(),
        genre: this.genre(),
        forceError: this.forceError(),
      }),
      loader: async ({ params, abortSignal }) => {
        this.catalogStore.markPending();
        await wait(1_000, abortSignal);

        if (params.forceError) {
          this.catalogStore.markFailed(
            'The projector lost its connection. The fallback is active.',
          );
          throw new Error('Intentional ReelNight catalogue failure');
        }

        this.catalogStore.markReady();
        return MOVIES.filter((movie) => {
          const matchesGenre = params.genre === 'All' || movie.genre === params.genre;
          const haystack = `${movie.title} ${movie.genre} ${movie.synopsis}`.toLocaleLowerCase();
          return matchesGenre && haystack.includes(params.query);
        });
      },
      defaultValue: [...MOVIES],
    }),
    withPreviousValueOnLoading(),
    withValueOnError([]),
  );

  protected readonly visibleMovies = computed(() => {
    this.moviesResource.status();
    return this.moviesResource.value();
  });
  protected readonly resourceStatus = computed(() => this.moviesResource.status());

  protected updateFilter(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.query.set(query);
    this.reduxStore.dispatch(catalogActions.filterChanged({ query }));
  }

  protected selectGenre(genre: GenreFilter): void {
    this.genre.set(genre);
    this.reduxStore.dispatch(catalogActions.genreChanged({ genre }));
  }

  protected reload(): void {
    this.forceError.set(false);
    this.moviesResource.reload();
    this.reduxStore.dispatch(catalogActions.reloadRequested());
  }

  protected simulateError(): void {
    this.forceError.set(true);
  }

  protected recover(): void {
    this.forceError.set(false);
  }

  protected selectCodeExample(exampleId: CodeExampleId): void {
    this.selectedCodeExampleId.set(exampleId);
  }

  protected selectMovie(movie: Movie): void {
    this.catalogStore.selectMovie(movie);
    this.reduxStore.dispatch(catalogActions.movieSelected({ movieId: movie.id }));

    window.setTimeout(() => {
      const details = this.document.getElementById('movie-details');
      details?.focus({ preventScroll: true });
      details?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
    });
  }
}
