import { LitElement, html, css } from "lit-element";

class BookItem extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        a,
        .placeholder {
          display: flex;
          flex-direction: column;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          color: inherit;
          text-decoration: none;
        }

        .info {
          display: flex;
          flex-direction: row-reverse;
        }

        .desc {
          position: relative;
          flex: 1;
          margin: 8px 12px;
          box-sizing: border-box;
          font-size: 14px;
          font-weight: 300;
          line-height: 1.5;
          overflow: hidden;
        }

        .desc::after {
          content: "";
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 1)
          );
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          height: 40px;
        }

        .info-section {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 8px 8px 8px 16px;
          font-size: 14px;
          font-weight: 300;
          overflow: hidden;
        }

        .title-container {
          display: flex;
        }

        .title {
          position: relative;
          flex: 1;
          margin: 0 6px 0 0;
          box-sizing: border-box;
          font-size: 18px;
          font-weight: 500;
          letter-spacing: 0.1px;
          line-height: 1.2;
        }

        .info-item {
          padding-top: 8px;
        }

        [hidden] {
          display: none !important;
        }

        .placeholder {
          animation: shimmer 1s infinite linear forwards;
          background: #f6f7f8;
          background: linear-gradient(to right, #eee 8%, #ddd 18%, #eee 33%);
          background-size: 800px 104px;
        }

        .placeholder[fadeout] {
          animation-iteration-count: 2;
          transition: 0.5s opacity;
          opacity: 0;
          pointer-events: none;
        }

        @keyframes shimmer {
          0% {
            background-position: -468px 0;
          }
          100% {
            background-position: 468px 0;
          }
        }

        .placeholder-info {
          position: absolute;
          top: 0;
          left: 0;
          width: calc(100% - 96px);
          height: 154px;
          box-sizing: border-box;
          border-top: 8px solid #fff;
          border-right: 30px solid #fff;
          border-bottom: 66px solid #fff;
          border-left: 16px solid #fff;
        }

        .placeholder-info-inner-1 {
          height: 12px;
          margin-top: 24px;
          background: #fff;
        }

        .placeholder-info-inner-2 {
          height: 12px;
          margin-top: 16px;
          background: #fff;
        }

        .placeholder-desc {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: calc(100% - 154px);
          box-sizing: border-box;
          border-top: 8px solid #fff;
          border-right: 30px solid #fff;
          border-bottom: 8px solid #fff;
          border-left: 12px solid #fff;
        }

        /* Wide layout */
        @media (min-width: 648px) {
          .info {
            flex-direction: row;
          }

          .info-section {
            padding: 16px;
          }

          .desc {
            margin: 8px 16px;
          }

          .title {
            font-size: 20px;
          }

          .info-item {
            padding-top: 12px;
          }

          .placeholder-info {
            top: 0;
            right: 0;
            bottom: calc(100% - 205px);
            left: auto;
            width: calc(100% - 128px);
            height: auto;
            border-top: 16px solid #fff;
            border-right: 30px solid #fff;
            border-bottom: 104px solid #fff;
            border-left: 16px solid #fff;
          }

          .placeholder-info-inner-1 {
            height: 12px;
            margin-top: 30px;
            background: #fff;
          }

          .placeholder-info-inner-2 {
            height: 12px;
            margin-top: 16px;
            background: #fff;
          }

          .placeholder-desc {
            height: calc(100% - 205px);
            border-top: 16px solid #fff;
            border-right: 30px solid #fff;
            border-bottom: 30px solid #fff;
            border-left: 16px solid #fff;
          }
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
      ? item.km + "km of " + item.grade + " · " + item.river
      : "";
    const level =
      isLoaded && item.level_label
        ? item.level_label + " (" + item.level_reason + ")"
        : ""; // TODO make this a custom element in it's own right
    const desc = isLoaded ? item.desc : "";

    return html`
      <a href="/detail/${slug}">
        <div class="info">
          <div class="info-section">
            <div class="title-container">
              <h2 class="title">${title}</h2>
              <slot></slot>
            </div>
            <div class="info-item" ?hidden="${!subtitle}">
              ${subtitle}
            </div>
            <div class="info-item" ?hidden="${!level}">
              ${level}
            </div>
          </div>
        </div>
        <div class="desc">${desc}</div>
      </a>

      <div class="placeholder" ?fadeout="${isLoaded}">
        <div class="placeholder-info">
          <div class="placeholder-info-inner-1"></div>
          <div class="placeholder-info-inner-2"></div>
        </div>
        <div class="placeholder-desc"></div>
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
