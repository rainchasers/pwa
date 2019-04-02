export const UPDATE_PAGE = "UPDATE_PAGE";
export const RECEIVE_LAZY_RESOURCES = "RECEIVE_LAZY_RESOURCES";
export const UPDATE_OFFLINE = "UPDATE_OFFLINE";
export const UPDATE_WIDE_LAYOUT = "UPDATE_WIDE_LAYOUT";
export const UPDATE_DRAWER_STATE = "UPDATE_DRAWER_STATE";
export const OPEN_SNACKBAR = "OPEN_SNACKBAR";
export const CLOSE_SNACKBAR = "CLOSE_SNACKBAR";
export const UPDATE_SUBTITLE = "UPDATE_SUBTITLE";

export const navigate = location => dispatch => {
  // extract the page name, river ID and/or search query from URL path
  const pathname = location.pathname;
  const parts = pathname.slice(1).split("/");
  const page = parts[0] || "explore";

  // river uuid is in the path: /river/{bookId}
  const bookId = parts[1];

  // search query is extracted from the search string: /?q={query}
  const match = RegExp("[?&]q=([^&]*)").exec(location.search);
  const query = match && decodeURIComponent(match[1].replace(/\+/g, " "));

  dispatch(loadPage(page, query, bookId));
};

const loadPage = (page, query, bookId) => async (dispatch, getState) => {
  let module;
  switch (page) {
    case "explore":
      module = await import("../components/book-explore.js");
      dispatch(module.searchBooks(query));
      break;
    case "detail":
      module = await import("../components/book-detail.js");
      // Fetch the book info for the given book id.
      await dispatch(module.fetchBook(bookId));
      // Wait for to check if the book id is valid.
      if (isFetchBookFailed(getState().book)) {
        page = "404";
      }
      // Fetch favorites
      dispatch(module.fetchFavorites());
      break;
    case "viewer":
      module = await import("../components/book-viewer.js");
      // Fetch the book info for the given book id.
      await dispatch(module.fetchBook(bookId));
      // Wait for to check if book id is valid.
      if (isFetchBookFailed(getState().book)) {
        page = "404";
      }
      break;
    case "favorites":
      module = await import("../components/book-favorites.js");
      // Fetch favorites
      dispatch(module.fetchFavorites());
      // Update subtitle
      dispatch(updateSubTitle("Favorites"));
      break;
    case "about":
      await import("../components/book-about.js");
      break;
    default:
      // Nothing matches, set page to '404'.
      page = "404";
  }

  if (page === "404") {
    import("../components/book-404.js");
  }

  dispatch(updatePage(page));

  const lazyLoadComplete = getState().app.lazyResourcesLoaded;
  // load lazy resources after render and set `lazyLoadComplete` when done.
  if (!lazyLoadComplete) {
    requestAnimationFrame(async () => {
      await import("../components/lazy-resources.js");
      dispatch({
        type: RECEIVE_LAZY_RESOURCES
      });
    });
  }
};

export const refreshPage = () => (dispatch, getState) => {
  const state = getState();
  // load page using the current state
  dispatch(
    loadPage(
      state.app.page,
      state.books && state.books.query,
      state.book && state.book.id
    )
  );
};

const updatePage = page => {
  return {
    type: UPDATE_PAGE,
    page
  };
};

const isFetchBookFailed = book => {
  return !book.isFetching && book.failure;
};

let snackbarTimer;

export const showSnackbar = () => dispatch => {
  dispatch({
    type: OPEN_SNACKBAR
  });
  clearTimeout(snackbarTimer);
  snackbarTimer = setTimeout(() => dispatch({ type: CLOSE_SNACKBAR }), 3000);
};

export const updateOffline = offline => (dispatch, getState) => {
  const prev = getState().app.offline;
  dispatch({
    type: UPDATE_OFFLINE,
    offline
  });
  if (prev !== undefined) {
    dispatch(showSnackbar());
  }
  //  automatically refresh when you come back online (offline was true and now is false)
  if (prev === true && offline === false) {
    dispatch(refreshPage());
  }
};

export const updateLayout = wide => (dispatch, getState) => {
  dispatch({
    type: UPDATE_WIDE_LAYOUT,
    wide
  });
  if (getState().app.drawerOpened) {
    dispatch(updateDrawerState(false));
  }
};

export const updateDrawerState = opened => (dispatch, getState) => {
  if (getState().app.drawerOpened !== opened) {
    dispatch({
      type: UPDATE_DRAWER_STATE,
      opened
    });
  }
};

export const updateSubTitle = subTitle => {
  return {
    type: UPDATE_SUBTITLE,
    subTitle
  };
};

export const updateLocationURL = url => dispatch => {
  window.history.pushState({}, "", url);
  dispatch(navigate(window.location));
};
