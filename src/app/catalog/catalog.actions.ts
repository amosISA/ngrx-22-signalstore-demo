import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const catalogActions = createActionGroup({
  source: 'ReelNight Catalog',
  events: {
    'Filter Changed': props<{ query: string }>(),
    'Genre Changed': props<{ genre: string }>(),
    'Movie Selected': props<{ movieId: number }>(),
    'Reload Requested': emptyProps(),
  },
});
