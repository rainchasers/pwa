export const REQUEST_BOOKS = "REQUEST_BOOKS";
export const RECEIVE_BOOKS = "RECEIVE_BOOKS";
export const FAIL_BOOKS = "FAIL_BOOKS";

const appID = "68SCVTV3KD";
const publicAPIKey = "99fe024e02d9f69215cfc5634e5466dc";

export const searchBooks = query => (dispatch, getState) => {
  // Check to see if the cached results are from the same query.
  // This is useful for avoiding a network request.
  if (shouldSearchBooks(getState(), query)) {
    dispatch(requestBooks(query));
    if (query) {
      const url =
        "https://" + appID + "-dsn.algolia.net/1/indexes/rivers/query";
      fetch(url, {
        method: "post",
        headers: {
          "X-Algolia-API-Key": publicAPIKey,
          "X-Algolia-Application-Id": appID,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ params: "query=" + encodeURIComponent(query) })
      })
        .then(checkResponseStatus)
        .then(res => res.json())
        .then(data => dispatch(receiveBooks(query, data.hits)))
        .catch(() => dispatch(failBooks(query)));
    } else {
      // query is empty, clear the results
      dispatch(receiveBooks(query, []));
    }
  }
};

const checkResponseStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  }
  return Promise.reject(new Error(response.statusText));
};

const shouldSearchBooks = (state, query) => {
  return (
    state.books.failure ||
    (state.books.query !== query && !state.books.isFetching)
  );
};

const requestBooks = query => {
  return {
    type: REQUEST_BOOKS,
    query
  };
};

const receiveBooks = (query, items) => {
  return {
    type: RECEIVE_BOOKS,
    query,
    items
  };
};

const failBooks = query => {
  return {
    type: FAIL_BOOKS,
    query
  };
};
