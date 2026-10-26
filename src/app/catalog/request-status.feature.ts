import { computed } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  SignalStoreFeatureType,
  type,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

type RequestStatus = 'idle' | 'pending' | { error: string };

/** First feature: the only place that declares the request state shape. */
export function withRequestStatus() {
  return signalStoreFeature(
    withState<{ requestStatus: RequestStatus }>({ requestStatus: 'idle' }),
    withComputed(({ requestStatus }) => ({
      isPending: computed(() => requestStatus() === 'pending'),
      requestError: computed(() => {
        const status = requestStatus();
        return typeof status === 'object' ? status.error : null;
      }),
    })),
    withMethods((store) => ({
      markPending: () => patchState(store, { requestStatus: 'pending' }),
      markReady: () => patchState(store, { requestStatus: 'idle' }),
      markFailed: (error: string) => patchState(store, { requestStatus: { error } }),
    })),
  );
}

/** NgRx 22 extracts the state, computed signals, and methods from the feature above. */
export type RequestStatusFeature = SignalStoreFeatureType<typeof withRequestStatus>;

/** Second feature: consumes that contract without declaring it again by hand. */
export function withStatusMessage() {
  return signalStoreFeature(
    type<RequestStatusFeature>(),
    withComputed(({ isPending, requestError }) => ({
      statusMessage: computed(() => {
        if (isPending()) return 'Updating the programme…';
        return requestError() ?? 'Tonight’s programme is ready';
      }),
    })),
  );
}
