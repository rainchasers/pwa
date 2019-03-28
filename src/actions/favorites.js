import { fb } from "./firebase.js";

export const REQUEST_FAVORITES = "REQUEST_FAVORITES";
export const RECEIVE_FAVORITES = "RECEIVE_FAVORITES";
export const FAIL_FAVORITES = "FAIL_FAVORITES";
export const ADD_FAVORITE = "ADD_FAVORITE";
export const REMOVE_FAVORITE = "REMOVE_FAVORITE";

export const fetchFavorites = force => (dispatch, getState) => {
  if (!force && !shouldFetchFavorites(getState())) {
    return;
  }

  fb(dispatch).then(FirebaseApp => {
    dispatch(requestFavorites());
    // TODO: use FirebaseApp to get favourites from firebase.
    //       then dispatch with dispatch(receiveFavorites(items))

    // if not authed, or error then:
    dispatch(failFavorites());
  });
};

const shouldFetchFavorites = state => {
  return (
    state.favorites && !state.favorites.isFetching && !state.favorites.items
  );
};

export const saveFavorite = (item, isRemove) => dispatch => {
  fb(dispatch).then(FirebaseApp => {
    if (!FirebaseApp.auth().currentUser) {
      return;
    }
    // TODO: save the favourites using FirebaseApp, then...
    dispatch(isRemove ? removeFavorite(item) : addFavorite(item));
  });
};

const requestFavorites = () => {
  return {
    type: REQUEST_FAVORITES
  };
};

const receiveFavorites = items => {
  return {
    type: RECEIVE_FAVORITES,
    items
  };
};

const failFavorites = () => {
  return {
    type: FAIL_FAVORITES
  };
};

const addFavorite = item => {
  return {
    type: ADD_FAVORITE,
    item
  };
};

const removeFavorite = item => {
  return {
    type: REMOVE_FAVORITE,
    item
  };
};
