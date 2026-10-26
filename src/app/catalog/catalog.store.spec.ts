import { TestBed } from '@angular/core/testing';
import { CatalogStore } from './catalog.store';
import { MOVIES } from './movie.model';

describe('CatalogStore: dynamic deep signals', () => {
  let store: InstanceType<typeof CatalogStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CatalogStore] });
    store = TestBed.inject(CatalogStore);
  });

  it('narrows Movie | null and reads nested signals', () => {
    expect(store.selectedTitle()).toBe('Choose a movie');
    store.selectMovie(MOVIES[0]);
    expect(store.selectedTitle()).toBe('Afterlight');
    expect(store.selectedGenre()).toBe('Sci-Fi');
  });

  it('switches between members of a discriminated union', () => {
    expect(store.resultText()).toContain('Choose a movie');
    store.showSelectionError();
    expect(store.resultText()).toContain('message()');
  });

  it('composes the second feature with the type extracted from the first', () => {
    store.markPending();
    expect(store.statusMessage()).toContain('Updating the programme');
    store.markFailed('No connection');
    expect(store.statusMessage()).toBe('No connection');
  });
});
