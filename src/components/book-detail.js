import { html, css } from "lit-element";
import { PageViewElement } from "./page-view-element.js";
import { connect } from "pwa-helpers/connect-mixin.js";
import { updateMetadata } from "pwa-helpers/metadata.js";

import { favoriteIcon, favoriteBorderIcon } from "./book-icons.js";
import "./book-offline.js";

// This element is connected to the redux store.
import { store } from "../store.js";

import { refreshPage } from "../actions/app.js";
import { fetchBook } from "../actions/book.js";
import { fetchFavorites, saveFavorite } from "../actions/favorites.js";
import { book, bookSelector } from "../reducers/book.js";
import { favorites } from "../reducers/favorites.js";

// We are lazy loading its reducer.
store.addReducers({
  book,
  favorites
});

class BookDetail extends connect(store)(PageViewElement) {
  static get styles() {
    return css`
      :host {
        display: block;
      }

      section {
        padding: 8px;
      }

      p.meta {
        color: #006621;
        margin: 0;
      }

      p.level {
        display: inline-block;
        margin: 4px 0 0 0;
        padding: 4px;
        border-radius: 4px;
      }

      [hidden] {
        display: none !important;
      }
    `;
  }

  render() {
    const {
      _item,
      _favorites,
      _lastVisitedListPage,
      _showOffline,
      _isSignedIn
    } = this;

    // Don't render if there is no item.
    if (!_item) {
      return;
    }
    console.log("got river ", _item);

    const section = _item.section;
    const uuid = section ? section.uuid : "intentionally-blank";
    const km = section ? section.km : "";
    const grade = section && section.grade ? section.grade.text : "";
    const river = section ? section.river : "";
    const title = section ? section.section : "";
    const desc = section ? section.desc : "";
    const directions = section ? section.directions : "";
    const isFavorite = _favorites && !!_favorites[uuid];

    updateMetadata({
      title: `${title} · ${river}`,
      description: desc
    });

    return html`
      <section ?hidden="${_showOffline}">
        <h2>${title}</h2>
        <p>${river}</p>
        <p class="meta">${km}km of grade ${grade}</p>
        <p>${desc}</p>
      </section>

      <section ?hidden="${_showOffline}">
        <p>TODO: insert putin/takeout maps</p>
        <p>${directions}</p>
      </section>

      <div
        class="fav-btn-container"
        ?hidden="${_lastVisitedListPage === "favorites"}"
      >
        <button
          class="fav-button"
          @click="${() => store.dispatch(saveFavorite(_item, isFavorite))}"
          ?hidden="${!_isSignedIn}"
        >
          ${isFavorite ? favoriteIcon : favoriteBorderIcon}
          ${isFavorite ? "Added to Favorites" : "Add to Favorites"}
        </button>
      </div>

      <book-offline
        ?hidden="${!_showOffline}"
        @refresh="${() => store.dispatch(refreshPage())}"
      ></book-offline>
    `;
  }

  static get properties() {
    return {
      _item: { type: Object },
      _favorites: { type: Object },
      _lastVisitedListPage: { type: Boolean },
      _showOffline: { type: Boolean },
      _isSignedIn: { type: Boolean }
    };
  }

  // This is called every time something is updated in the store.
  stateChanged(state) {
    this._item = bookSelector(state);
    this._favorites = state.favorites && state.favorites.items;
    this._lastVisitedListPage = state.app.lastVisitedListPage;
    this._showOffline = state.app.offline && state.book.failure;
    this._isSignedIn = !!state.firebase.user;
  }
}

window.customElements.define("book-detail", BookDetail);

export { fetchBook, fetchFavorites };
