import Rebase from 're-base';
import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyAMpOEpuIwMuCxI5lcA96VWMJPPgnLBoYE",
    authDomain: "cryptofolio-fc74f.firebaseapp.com",
    databaseURL: "https://cryptofolio-fc74f.firebaseio.com",
    projectId: "cryptofolio-fc74f",
    storageBucket: "cryptofolio-fc74f.appspot.com",
    messagingSenderId: "698383133578"
};

const app = firebase.initializeApp(config);
const base = Rebase.createClass(app.database());

export { base }