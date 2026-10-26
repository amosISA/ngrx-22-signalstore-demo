import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { vi } from 'vitest';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideZonelessChangeDetection(), provideStore()],
    }).compileComponents();
  });

  it('presents ReelNight as a cinema experience', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelector('h2')?.textContent).toContain('Pick your next story');
    expect(page.querySelector('.hero')).toBeNull();
    expect(page.textContent).not.toContain('Now showing');
    expect(page.querySelectorAll('.movie-card')).toHaveLength(6);
    expect(page.querySelector('#movie-details')).toBeNull();
    expect(page.textContent).not.toContain("Choose a film from tonight's programme");
  });

  it('states that resource extensions are experimental', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    expect(
      (fixture.nativeElement as HTMLElement).querySelector('.experimental')?.textContent,
    ).toContain('Resource extensions are experimental');
  });

  it('publishes primary technical references in the app', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const sources = (fixture.nativeElement as HTMLElement).querySelector('#sources');
    expect(sources?.textContent).toContain('Read the primary sources');
    expect(sources?.querySelectorAll('a').length).toBeGreaterThanOrEqual(7);
    expect(sources?.textContent).toContain('Checked 26 October 2026');
  });

  it('opens the selected movie in the focused details panel', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const page = fixture.nativeElement as HTMLElement;
    const inspectButton = page.querySelector<HTMLButtonElement>('.movie-card button');
    inspectButton?.click();
    await fixture.whenStable();

    const details = page.querySelector<HTMLElement>('#movie-details');
    expect(details?.querySelector('h2')?.textContent).toContain('Afterlight');
    expect(details?.textContent).toContain('A radio astronomer');
    await vi.waitFor(() => {
      expect(document.activeElement).toBe(details);
    });
  });

  it('loads the selected feature example into the code block', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const page = fixture.nativeElement as HTMLElement;
    const cards = [...page.querySelectorAll<HTMLButtonElement>('.feature-card')];
    const examples = [
      ['Resource extensions code', 'withPreviousValueOnLoading()'],
      ['Dynamic deep signals code', 'store.selectedMovie.title()'],
      ['Reusable feature types code', 'SignalStoreFeatureType'],
      ['Redux DevTools action creators code', 'actionCreators: catalogActions'],
    ] as const;

    expect(cards).toHaveLength(4);

    for (const [index, [label, code]] of examples.entries()) {
      cards[index].click();
      await fixture.whenStable();

      const codeBlock = page.querySelector<HTMLElement>('app-code-block pre');
      expect(cards[index].getAttribute('aria-pressed')).toBe('true');
      expect(
        cards.every((card, cardIndex) =>
          cardIndex === index
            ? card.getAttribute('aria-pressed') === 'true'
            : card.getAttribute('aria-pressed') === 'false',
        ),
      ).toBe(true);
      expect(codeBlock?.getAttribute('aria-label')).toBe(label);
      expect(codeBlock?.textContent).toContain(code);
    }
  });

  it('filters tonight’s programme by genre', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const page = fixture.nativeElement as HTMLElement;
    const dramaButton = [...page.querySelectorAll<HTMLButtonElement>('.genre-list button')].find(
      (button) => button.textContent?.trim() === 'Drama',
    );
    expect(dramaButton).toBeDefined();
    dramaButton?.click();

    const component = fixture.componentInstance as unknown as {
      genre(): string;
      resourceStatus(): string;
      visibleMovies(): readonly unknown[];
    };
    expect(component.genre()).toBe('Drama');

    await vi.waitFor(() => {
      expect(component.resourceStatus()).toBe('loading');
    });
    expect(component.visibleMovies()).toHaveLength(6);

    await vi.waitFor(
      () => {
        expect(component.visibleMovies()).toHaveLength(2);
      },
      { timeout: 1_500 },
    );
    await fixture.whenStable();

    const cards = [...page.querySelectorAll<HTMLElement>('.movie-card')];
    expect(cards).toHaveLength(2);
    expect(cards.map((card) => card.textContent)).toEqual([
      expect.stringContaining('One Small Step'),
      expect.stringContaining('Tides of Home'),
    ]);
  });

  it('combines delayed search and genre filters', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const page = fixture.nativeElement as HTMLElement;
    const dramaButton = [...page.querySelectorAll<HTMLButtonElement>('.genre-list button')].find(
      (button) => button.textContent?.trim() === 'Drama',
    );
    dramaButton?.click();

    const search = page.querySelector<HTMLInputElement>('input[type="search"]');
    if (!search) {
      throw new Error('Search input was not rendered');
    }
    search.value = 'home';
    search.dispatchEvent(new Event('input'));

    const component = fixture.componentInstance as unknown as {
      visibleMovies(): readonly { title: string }[];
    };

    await vi.waitFor(
      () => {
        expect(component.visibleMovies().map((movie) => movie.title)).toEqual(['Tides of Home']);
      },
      { timeout: 1_500 },
    );

    await fixture.whenStable();
    expect(page.querySelectorAll('.movie-card')).toHaveLength(1);
    expect(page.querySelector('.movie-card')?.textContent).toContain('Tides of Home');
  });
});
