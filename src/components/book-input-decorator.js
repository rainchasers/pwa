import { LitElement, html, css } from "lit-element";
import { searchIcon } from "./book-icons.js";

class BookInputDecorator extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          border: solid 1px rgba(0, 0, 0, 0.13);
          border-radius: 8px;
          display: flex;
          flex-flow: row nowrap;
        }

        .icon {
          display: inline-block;
          width: 40px;
          height: 40px;
          padding: 8px;
          box-sizing: border-box;
        }

        ::slotted(input) {
          flex-grow: 1;
          height: 40px;
          font-size: 1em;
          border: none;
          background: transparent;
          font-family: inherit;
          outline: none;
          -webkit-appearance: none;
        }
      `
    ];
  }

  render() {
    const { _focused } = this;
    return html`
      <span class="icon">${searchIcon}</span>
      <slot id="input-slot" name="input"></slot>
      <slot name="button"></slot>
    `;
  }

  static get properties() {
    return {
      _focused: { type: Boolean }
    };
  }

  firstUpdated() {
    // after the first render, assume the input is in the slot
    this._input = this.shadowRoot
      .querySelector("#input-slot")
      .assignedNodes({ flatten: true })[0];
    this._input.addEventListener("focus", () => (this._focused = true));
    this._input.addEventListener("blur", () => (this._focused = false));
  }
}

window.customElements.define("book-input-decorator", BookInputDecorator);
