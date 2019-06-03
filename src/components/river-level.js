import { LitElement, html, css } from "lit-element";

function relativeTimeInWords(timestamp) {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const elapsed = Date.now() - timestamp.getTime();

  if (elapsed < 5 * msPerMinute) {
    return "a few minutes ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  } else if (elapsed < msPerDay) {
    const hourPlural = Math.round(elapsed / msPerHour) > 1 ? "s" : "";
    return Math.round(elapsed / msPerHour) + " hour" + hourPlural + " ago";
  }
  const dayPlural = Math.round(elapsed / msPerDay) > 1 ? "s" : "";
  return Math.round(elapsed / msPerDay) + " day" + dayPlural + " ago";
}

class RiverLevel extends LitElement {
  static get properties() {
    return {
      label: { type: String },
      reason: { type: String },
      timestamp: { type: String }
    };
  }

  constructor() {
    super();
    this.label = "unknown";
    this.reason = "";
    this.timestamp = Date.now();
  }

  static get styles() {
    // TODO: refactor styles into this method
    return css`
      :host {
        display: block;
      }
    `;
  }

  render() {
    const { label, reason, timestamp } = this;

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
        return html``;
    }

    const relativeTime = relativeTimeInWords(new Date(timestamp));

    return html`
      <style>
        p {
          background-color: ${color};
        }

        p {
          display: block;
          padding: 8px;
          margin: 0;
        }

        span {
          display: block;
        }
      </style>
      <p>
        <span>${label} ${relativeTime}</span>
        <span>${reason}</span>
      </p>
    `;
  }
}

window.customElements.define("river-level", RiverLevel);
