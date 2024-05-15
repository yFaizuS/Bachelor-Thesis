const dotenv = require('dotenv');
const assert = require('assert');

dotenv.config();

const {
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
} = process.env;

module.exports = {
  firebaseConfig: {
    apiKey: 'AIzaSyC6s8c-uVhiTMBdLGazyRUhyxZzmnwFNCQ',
    authDomain: 'be-find-fix.firebaseapp.com',
    projectId: 'be-find-fix',
    storageBucket: 'be-find-fix.appspot.com',
    messagingSenderId: '919834887234',
    appId: '1:919834887234:web:accab0e14746d6524a59db',
  },
};