import { LitElement, html, css } from "lit-element";
import "./river-level.js";

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
          padding: 8px 0;
        }

        h2 {
          font-size: 16px;
          margin: 8px 0 4px 0;
        }

        h2,
        p {
          padding: 0 8px;
        }

        p {
          margin: 4px 0;
        }

        p.meta {
          color: #006621;
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
        <river-level
          .label=${item.level_label}
          .reason=${item.level_reason}
          .timestamp=${item.level_timestamp}
        ></river-level>
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
