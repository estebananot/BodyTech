export const configureStore = jest.fn((config) => ({
  getState: jest.fn(),
  dispatch: jest.fn(),
  subscribe: jest.fn(),
  replaceReducer: jest.fn(),
}));

export const createSlice = jest.fn((config) => ({
  actions: config.actions,
  reducer: config.reducer,
}));

export const createAsyncThunk = jest.fn((typePrefix, payloadCreator) => {
  return payloadCreator;
});
