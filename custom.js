function injectStatusBadge() {
  const style = document.getElementById("contextgpt-status-style");
  if (!style) {
    const s = document.createElement("style");
    s.id = "contextgpt-status-style";
    s.textContent = `
      @keyframes contextgpt-pulse {
        0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.6); }
        70% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
        100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
      }
      .contextgpt-status-dot {
        display: inline-block;
        flex-shrink: 0;
        width: 8px;
        height: 8px;
        min-width: 8px;
        border-radius: 50%;
        background: #22c55e;
        animation: contextgpt-pulse 2s infinite;
      }
    `;
    document.head.appendChild(s);
  }

  const anchors = Array.from(
    document.querySelectorAll("a[href='https://status.contextgpt.co']")
  ).filter((el) => el.textContent.includes("System Status") && !el.dataset.statusEnhanced);

  if (anchors.length === 0) {
    setTimeout(injectStatusBadge, 500);
    return;
  }

  anchors.forEach((anchor) => {
    anchor.dataset.statusEnhanced = "true";

    const iconWrapper = anchor.querySelector("div");
    const wrapper = document.createElement("div");
    wrapper.className =
      "mr-4 rounded-md p-1 dark:bg-background-dark dark:brightness-[1.35] ring-1 ring-gray-950/[0.07] dark:ring-gray-700/40 flex items-center justify-center";
    wrapper.style.width = "24px";
    wrapper.style.height = "24px";

    const dot = document.createElement("span");
    dot.className = "contextgpt-status-dot";
    wrapper.appendChild(dot);

    if (iconWrapper) {
      iconWrapper.replaceWith(wrapper);
    } else {
      anchor.prepend(wrapper);
    }
  });
}

window.addEventListener("load", injectStatusBadge);

// Mintlify is SPA
new MutationObserver(() => injectStatusBadge()).observe(document.body, {
  childList: true,
  subtree: true,
});
