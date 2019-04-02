import { html, css } from "lit-element";
import { PageViewElement } from "./page-view-element.js";
import { repeat } from "lit-html/directives/repeat.js";
import { connect } from "pwa-helpers/connect-mixin.js";
import { updateMetadata } from "pwa-helpers/metadata.js";

import "./book-item.js";
import "./book-offline.js";

// This element is connected to the redux store.
import { store } from "../store.js";

import { searchBooks } from "../actions/books.js";
import { refreshPage } from "../actions/app.js";
import { books, itemListSelector } from "../reducers/books.js";

// We are lazy loading its reducer.
store.addReducers({
  books
});

class BookExplore extends connect(store)(PageViewElement) {
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        ul {
          max-width: 600px;
          margin: 0 auto;
          padding: 0 8px;
        }

        li {
          list-style: none;
          margin: 0;
          padding: 0;
          margin-bottom: 8px;
        }

        img {
          display: block;
          max-width: 200px;
          margin: 16px auto;
        }

        .tagline {
          padding: 24px 16px 0;
          text-align: center;
        }

        [hidden] {
          display: none !important;
        }
      `
    ];
  }

  render() {
    const { _query, _items, _showOffline } = this;
    updateMetadata({
      title: `${_query ? `${_query} - ` : ""}Rivers`,
      description: "Search for rivers"
    });

    return html`
      <section ?hidden="${_showOffline}">
        <ul ?hidden="${!_query}">
          ${repeat(
            _items,
            item => html`
              <li>
                <book-item .item="${item}"></book-item>
              </li>
            `
          )}
        </ul>

        <img
          src="images/logo.svg"
          ?hidden="${_query}"></img>

        <p class="tagline" ?hidden="${_query}">
          Search a collection of UK whitewater river guides for kayaking and canoeing.
        </p>
      </section>

      <book-offline
        ?hidden="${!_showOffline}"
        @refresh="${() => store.dispatch(refreshPage())}"
      ></book-offline>
    `;
  }

  static get properties() {
    return {
      _query: { type: String },
      _items: { type: Array },
      _showOffline: { type: Boolean }
    };
  }

  // This is called every time something is updated in the store.
  stateChanged(state) {
    this._query = state.books.query;
    this._items = itemListSelector(state);
    this._showOffline = state.app.offline && state.books.failure;
  }
}

window.customElements.define("book-explore", BookExplore);

export { searchBooks, refreshPage };
