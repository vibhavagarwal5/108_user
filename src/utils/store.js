import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import { createLogger } from 'redux-logger';
import allReducers from '../reducers/index';
import createFilter, {
	createWhitelistFilter
} from 'redux-persist-transform-filter';
import { persistStore } from 'redux-persist';
import { persistCombineReducers } from 'redux-persist';
import { AsyncStorage } from 'react-native';

//Creating the config for the redux-persist for persisting the data upon data load.
const config = {
	key: 'root',
	storage: AsyncStorage,
	debug: true,
	// whitelist: ['login', 'incident'],
	transforms: [
		createWhitelistFilter('location', [
			'curr_coordinates',
		])
		// createWhitelistFilter('login', ['user','loading']),
		// createWhitelistFilter('slides')
	]
};

//Linking all the reducers with the redux-persist and applying all the middlewares to it.
const combinedReducer = persistCombineReducers(config, allReducers);
const reducers = (state, action) => {
	if (action.type === 'SIGN_OUT') {
		state = undefined;
	}
	return combinedReducer(state, action);
};
const enhancers = applyMiddleware(thunk, promise, createLogger());

//Creating the store and the persistor
const store = createStore(reducers, enhancers);
const persistor = persistStore(store, enhancers, () => {
	console.log('after persisting', store.getState());
});
const configureStore = () => {
	return {
		persistor,
		store
	};
};

export default configureStore;
