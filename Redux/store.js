import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
// import { configureStore } from '@reduxjs/toolkit'
import cartItems from './Reducers/cartItems'
import serviceCartItems from './Reducers/serviceCartItems';

const reducers = combineReducers({
    cartItems: cartItems,
    serviceCartItems: serviceCartItems
})

const store = createStore(
    reducers,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
)

export default store;