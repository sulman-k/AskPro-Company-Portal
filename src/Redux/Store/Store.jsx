// import { createStore , applyMiddleware } from 'redux';
import { createStore } from 'redux';
import allReducer from '../Reducers/AllReducer/AllReducer';
import createEngine from 'redux-storage-engine-localstorage';
import * as storage from 'redux-storage';

const store = createStore(
  allReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
