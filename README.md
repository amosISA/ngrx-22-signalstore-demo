# ReelNight: an NgRx 22 cinema demo

ReelNight is an interactive companion demo for [NgRx 22: three changes that make SignalStore easier to use](https://www.codigotipado.com/p/ngrx-22-three-changes-that-make-signalstore). It uses a small fictional cinema app to show how the new APIs behave on a real screen.

[Open the live demo](https://amosisa.github.io/ngrx-22-signalstore-demo/). Every push to `main` is deployed to GitHub Pages with GitHub Actions.

The demo covers:

- Resource Extensions that keep the current catalogue visible during reloads and provide a safe value after errors.
- Dynamic Deep Signals with `Movie | null` and discriminated unions.
- Reusable SignalStore feature contracts with `SignalStoreFeatureType`.
- The Redux DevTools `actionCreators` option introduced in NgRx 22.

The app uses zoneless Angular 22 and NgRx 22. It has no backend, router, booking flow, or external movie API. Requests wait one second and failures can be triggered manually, making each state change easy to see.

## Getting started

```bash
pnpm start
```

Open `http://localhost:4200`. To run the Vitest suite:

```bash
pnpm test --watch=false
```

## A simple presentation flow

### 1. Explore the programme

Search for `night`, change genre, or select **View details** on a movie card. The details panel
receives focus and scrolls into view, so the result of the action is immediate and accessible.

### 2. Show Resource Extensions

Change a filter and watch the current cards remain visible for one second while the next result loads.
`withPreviousValueOnLoading()` avoids a blank flash.

Select **Simulate error**. The resource still enters its real error state, while
`withValueOnError([])` gives the UI a safe empty array to render. Select **Recover catalogue** to
return to the programme.

> Everything exported from `@ngrx/signals/resource` is experimental in NgRx 22.

### 3. Show Dynamic Deep Signals

Open `src/app/catalog/catalog.store.ts`. The selected value is `Movie | null`, but NgRx 22 can
still expose nested signals after an `in` check:

```ts
const selectedMovie = store.selectedMovie();

if (selectedMovie && 'title' in store.selectedMovie) {
  return store.selectedMovie.title();
}
```

The parent read is intentional: it registers the reactive dependency. The same panel also uses a
discriminated union. Select **Switch result branch** to move from its ready branch to its error
branch and read `message()`.

### 4. Show `SignalStoreFeatureType`

In `request-status.feature.ts`, `withRequestStatus()` owns its state, computed signals, and
methods. `SignalStoreFeatureType<typeof withRequestStatus>` extracts that complete contract so
`withStatusMessage()` can consume it without repeating the type by hand.

### 5. Open Redux DevTools

The `createActionGroup` object is passed to the new `actionCreators` option in
`app.config.ts`. Search, genre, selection, and reload actions appear in the action log and in the
DevTools Dispatcher.

## Where to look

| File                                        | Concept                                                      |
| ------------------------------------------- | ------------------------------------------------------------ |
| `src/app/app.ts`                            | Simulated movie resource and UI actions                      |
| `src/app/catalog/movie.model.ts`            | Six fictional movies and licensed image metadata             |
| `src/app/catalog/catalog.store.ts`          | `Movie \| null` and a discriminated union                    |
| `src/app/catalog/request-status.feature.ts` | Reusable features with `SignalStoreFeatureType`              |
| `src/app/catalog/catalog.actions.ts`        | `createActionGroup` registered in Redux DevTools             |
| `src/app/app.config.ts`                     | Zoneless Angular, Store, and DevTools configuration          |
| `src/app/catalog/catalog.store.spec.ts`     | Executable examples for deep signals and feature composition |

## Image credits

All film titles and stories are fictional. The photography is loaded directly from Wikimedia
Commons and is public domain or released under CC0.

- **Afterlight:** [NPS Photo / Tim Rains — public domain](<https://commons.wikimedia.org/wiki/File:Aurora_on_a_dark_night_in_February_(92a1c8be-b8db-4824-801e-3e9b9bc2231d).jpg>)
- **The Last Horizon:** [Mustang Joe — CC0](https://commons.wikimedia.org/wiki/File:Climbing_the_Merzouga_Dunes.jpg)
- **One Small Step:** [Neil A. Armstrong / NASA — public domain](<https://commons.wikimedia.org/wiki/File:A_Man_on_the_Moon,_AS11-40-5903_(cropped).jpg>)
- **Midnight District:** [Alfred Twu — CC0](https://commons.wikimedia.org/wiki/File:Jersey_City_night_skyline.jpg)
- **Into the Quiet:** [Nathan Anderson — CC0](<https://commons.wikimedia.org/wiki/File:Dense_forest_under_fog_(Unsplash).jpg>)
- **Tides of Home:** [João Cautela — CC0](<https://commons.wikimedia.org/wiki/File:Sun_Fisherman_Lighthouse_(212319699).jpeg>)

## Truly zoneless

`provideZonelessChangeDetection()` is configured in `app.config.ts`, and `zone.js` is not an app
dependency. Signals, resources, and event handlers notify Angular directly.

## References

Technical claims and image licences were rechecked on **26 October 2026**.

- [NgRx 22.0.1 package](https://www.npmjs.com/package/@ngrx/store/v/22.0.1)
- [Official NgRx v22 announcement](https://dev.to/ngrx/announcing-ngrx-v22-resource-extensions-dynamic-deep-signals-a-light-theme-and-more-5gci)
- [NgRx v22 migration guide](https://ngrx.io/guide/migration/v22)
- [NgRx 22.0.1 changelog snapshot](https://github.com/ngrx/platform/blob/22.0.1/CHANGELOG.md)
- [Resource Extensions guide](https://ngrx.io/guide/signals/resource-extensions)
- [Resource Extensions source at 22.0.1](https://github.com/ngrx/platform/tree/22.0.1/modules/signals/resource/src)
- [Dynamic deep signals change](https://github.com/ngrx/platform/commit/fa0780e)
- [`SignalStoreFeatureType` change](https://github.com/ngrx/platform/commit/319d3ee)
- [DevTools `actionCreators` change](https://github.com/ngrx/platform/commit/69dbe47)
- [`selectId` inference fix](https://github.com/ngrx/platform/commit/de9bf52)
- [Angular Resource guide](https://angular.dev/guide/signals/resource)
- [Angular zoneless guide](https://angular.dev/guide/zoneless)
