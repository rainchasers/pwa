import { LitElement, html, css } from "lit-element";

class RiverLevel extends LitElement {
  static get properties() {
    return {
      label: { type: String },
      reason: { type: String }
    };
  }

  constructor() {
    super();
    this.label = "unknown";
    this.reason = "";
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      span {
        display: inline-block;
        padding: 4px;
        border-radius: 4px;
      }
    `;
  }

  render() {
    const { label, reason } = this;

    let color = "";
    switch (label) {
      case "empty":
      case "toohigh":
        color = "#ffbaba";
        break;
      case "huge":
        color = "#e0d6df";
        break;
      case "high":
        color = "#c7e09d";
        break;
      case "medium":
        color = "#dff2bf";
        break;
      case "low":
        color = "#fff5bf";
        break;
      case "scrape":
        color = "#ffd4c5";
        break;
      default:
        // render nothing if no level
        return;
    }

    const desc = label + " (" + reason + ")";

    return html`
      <style>
        span {
          background-color: ${color};
        }
      </style>
      <span>${desc}</span>
    `;
  }
}

window.customElements.define("river-level", RiverLevel);
