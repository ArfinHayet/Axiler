// store/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage for web

import cartReducer from './cartSlice';


const rootReducer = combineReducers({
  cart: cartReducer
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart',], // Only persist the search slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // redux-persist uses non-serializable values
      }),
    devTools: process.env.NODE_ENV !== 'production',
  });

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
