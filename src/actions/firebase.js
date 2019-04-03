// use separate firebase imports to reduce bundle
// size and avoid https://github.com/firebase/firebase-js-sdk/issues/1516
import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/firestore";
// TODO: configure persistent data

export const SET_USER = "SET_USER";

let FirebaseApp;

export const fb = dispatch => {
  if (FirebaseApp) {
    return Promise.resolve(FirebaseApp);
  }

  FirebaseApp = firebase.initializeApp(
    {
      apiKey: "AIzaSyBTpxubA2JN6_90PZ2ICEUej2qqjZpUtVk",
      authDomain: "tuleyprod.firebaseapp.com",
      databaseURL: "https://tuleyprod.firebaseio.com",
      projectId: "tuleyprod",
      storageBucket: "tuleyprod.appspot.com",
      messagingSenderId: "601668794048"
    },
    "rainchasers"
  );

  FirebaseApp.auth().onAuthStateChanged(function(user) {
    if (user) {
      // user is signed in
      dispatch(setUser(user));
    } else {
      // user is signed out.
      dispatch(setUser());
    }
  });

  return Promise.resolve(FirebaseApp);
};

export const signIn = () => dispatch => {
  fb(dispatch).then(() => {
    // signin with FirebaseApp
  });
};

export const signOut = () => dispatch => {
  fb(dispatch).then(() => {
    // signout with FirebaseApp
  });
};

const setUser = user => {
  return {
    type: SET_USER,
    user
  };
};
