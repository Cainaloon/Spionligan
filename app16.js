  /* ---------- Hela fotot syns i bildrutorna (även bilder tagna på höjden) ---------- */
  document.head.insertAdjacentHTML("beforeend", "<style>" +
    ".preview { position: relative; }" +
    ".preview img, .preview video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; background: #02090c; }" +
    "</style>");
  render();
