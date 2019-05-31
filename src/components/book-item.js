import { LitElement, html, css } from "lit-element";

class BookItem extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        [hidden] {
          display: none !important;
        }

        div {
          display: block;
          border: solid 1px rgba(0, 0, 0, 0.13);
          border-radius: 8px;
          padding: 8px;
        }

        h2 {
          font-size: 16px;
          margin: 8px 0 4px 0;
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

        .toohigh,
        .empty {
          background-color: #ffbaba;
        }
        .huge {
          background-color: #e0d6df;
        }
        .high {
          background-color: #c7e09d;
        }
        .medium {
          background-color: #dff2bf;
        }
        .low {
          background-color: #fff5bf;
        }
        .scrape {
          background-color: #ffd4c5;
        }
      `
    ];
  }

  render() {
    const { item } = this;
    const isLoaded = item && item.objectID;
    const slug = isLoaded ? item.slug : "";
    const title = isLoaded ? item.section : "";
    const subtitle = isLoaded
      ? item.km + "km of grade " + item.grade + " · " + item.river
      : "";
    const level_class =
      isLoaded && item.level_label != "unknown" ? item.level_label : "";
    const level =
      isLoaded && item.level_label
        ? item.level_label + " (" + item.level_reason + ")"
        : ""; // TODO make this a custom element in it's own right

    // if desc is present, extract the first sentence
    let desc = "";
    if (isLoaded) {
      desc = item.desc.split(". ")[0];
      desc = desc.replace(/\.+$/, ""); // removing trailing periods
      desc = desc ? desc + "." : "";
    }

    return html`
      <div>
        <h2><a href="/detail/${slug}">${title}</a></h2>
        <p class="meta" ?hidden="${!subtitle}">${subtitle}</p>
        <p class="level ${level_class}" ?hidden="${!level_class}">${level}</p>
        <p class="desc">${desc}</p>
      </div>
    `;
  }

  static get properties() {
    return {
      item: { type: Object }
    };
  }
}

window.customElements.define("book-item", BookItem);
