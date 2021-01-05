import "@ryangjchandler/spruce";
import "alpinejs";
import focusLock from "dom-focus-lock";

window.focusLock = focusLock;

window.Spruce.store("navigation", {
  open: false,
  triggerEl: null,
});

window.Spruce.watch("navigation.open", (value) => {
  const store = window.Spruce.store("navigation");
  const el = document.querySelector("#mobile-navigation");
  if (value) {
    focusLock.on(el);
  } else {
    focusLock.off(el);
    if (store.triggerEl) {
      store.triggerEl.focus();
      setTimeout(() => {
        store.triggerEl = null;
      });
    }
  }
});

export default {
  init() {
    // JavaScript to be fired on all pages
  },
  finalize() {
    // JavaScript to be fired on all pages, after page specific JS is fired
  },
};
