import { auth } from 'firebase'
import {combineReducers} from 'redux'
import alert from './alert'
//import auth from './auth'

export default combineReducers({
    alert:alert
    //auth:auth
})