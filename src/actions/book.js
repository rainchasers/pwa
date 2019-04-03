import { fb } from "./firebase.js";

export const REQUEST_BOOK = "REQUEST_BOOK";
export const RECEIVE_BOOK = "RECEIVE_BOOK";
export const FAIL_BOOK = "FAIL_BOOK";

export const fetchBook = id => dispatch => {
  dispatch(requestBook(id));
  // fetch book data given the book id.
  fb(dispatch)
    .then(FirebaseApp => {
      return FirebaseApp.firestore()
        .collection("rivers")
        .where("section.slug", "==", id)
        .get();
    })
    .then(results => {
      results.forEach(doc => {
        return dispatch(receiveBook(id, doc.data()));
      });
      return dispatch(failBook(id));
    })
    .catch(e => {
      console.log(e); // TODO: better error logging
      dispatch(failBook(id));
    });
};

const requestBook = id => {
  return {
    type: REQUEST_BOOK,
    id
  };
};

const receiveBook = (id, item) => {
  return {
    type: RECEIVE_BOOK,
    id,
    item
  };
};

const failBook = id => {
  return {
    type: FAIL_BOOK,
    id
  };
};
