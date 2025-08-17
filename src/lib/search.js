// src/scripts/pagefind-modal.js
import { Instance, Input, ResultList } from "@pagefind/modular-ui";

export function initPagefindModal() {
  const instance = new Instance({ bundlePath: "/pagefind/" });

  instance.add(new Input({
    containerElement: "#searchbox",
    placeholder: "Search this site..."
  }));

  instance.add(new ResultList({
    containerElement: "#searchresults",
    showSubResults: true,
    excerptLength: 20
  }));
}
