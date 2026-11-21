  /* ---------- Riktig logga i sidhuvudet och ny favicon ---------- */
  var LOGO_OK = false, logoImg = new Image();
  logoImg.onload = function () { LOGO_OK = true; render(); };
  logoImg.src = "logo.webp";
  (function () {
    var l = document.querySelector('link[rel="icon"]');
    if (l) { l.type = "image/webp"; l.href = "data:image/webp;base64,UklGRkIFAABXRUJQVlA4IDYFAAAQFwCdASpAAEAAPm0qjkWkIiEYDf2AQAbEtgBajVefG+G8zGs/6HbokRQotuV5gPOu9HnnHdRf6AHSlfu16N1Yg5T/bMpe4X6vBkXIufRgA+p3ExpL/jnQbZ3Hqv2Buk6w/mVidZEbcnAZmfWmuR7CxGLN6RFL5wKf16sIo7AH0uw7ihkSuHKh5OIiG33dsJvViB+GK6ZYtZK4PkGU1IU9aP+s5sy1thjQ4UJCsY7W3ezxOxDzCTNrbm8CrxV8/dwAAP7/uWnIQsK4go9lafl17cLu3ENHid2wmdDBrKKkyY0qOxkuhSOSTrWEUHrYgdl2wDS5h/Nz7ZM8uJxTaXWgAoI6/1hC92VFjhaKz1LfQwBesFYr0O+EzqTB9HWCHJ8otaKXbwZLuf+L78zp+tSnwZwb7ZVfU5tlKbQPZRNYz/K/iIZ+q0KMTCo6dWRLqHNoZgVfXaZFwzoftua9+tFE1XPLzwW0W61eZrhJBDOoNCTXaZSfnt3OHFxPfn+GQRamC0BvhAWf0bOv9KLJSaEt6v+jVa88ap+hhoKJ/KBGGEj45D8PTI8Rl+INOM9tmvGUDRVx/cb76qRgJvt3N1WudjZBtkAgUZucYfdUDC0M2iWDn2oBORvVuLquMh6zz1BFvygKCqgAP2SKPBN3tXJHjB20POYz/u29QyRjazYnGRH44ERzXhPHKvM5i8sEc4DX3AlYwloF2XqZ4iiwF/+y9BZ8cd1+mA8lSVtyxoFFsax7iI9MvVmmnIzRG6MbRgT5UqmJNENtXwbHNQQBOUZzI7UG8xZFG8M/Af9eUYcxRxIEfhcteakL9FG5eNgc40hrggkEiTON8hPQXvtqgRsznlKFJphFim4hXJyJ0xb1OhaZdUfLrjujLUOyZQO9bXGIy6cw/kmdCR+R31k9+7soGNXCSwkm1XSLpPbtz27rgsxHPagKP4/LByq3L0IL+tsTXz/wkIaedmDxCJPIi6//33sA3VoA1LzwQ/n+zt1YLj0orZygLpF/2r5vkT2cB13VTppRSXEqyJf24ak6bFhIbUWPhGbOszzTUlor2rggUR6EbclUdcFMjVAsRRKcGtXVChcyrlwI7wVS5ehkqQ3JG/+g31D4mmOt1OQ3PAv36Bb69D2QD9yxQ/Kh7lkf9tmE20DYCNGj83LaAOdGLI50IhD7CbaegJsedqjSJ9yPyWJ7I03DZkAWZKyaCWMb7nTkd7we19GhBsjRF3CxUiyyNrhtGGvn/pn0LxStQUzY98Qgb+wNeearTOvYYu10pOocARsd/dGs+SJtdiQLVDn8SgklgbjrQbWYNkI+lY4n4OyITsOHvDYq6bFl16N2+scIuUWsPr++VES2AELOQRjGnzd3wbRvCQCxniLZA8F85rF9jm3Zy9B0r30QMdIpKBdRVgl7Dg617dCLY2hTSc8KkJilvsSmzapVJ8JiJjUIn7yyt8381RtsuUkDfX4MKqcetdtBMdudHZR2/ykw847C1yJcUEuUZN6qzUi+IPvCz2WHbnYRD0zm6sYUugDNZSYTtqZuctSGQSY+mm7jggfp/l3+hYxZ0g3yHvvWUbH0Fdll1gnVxf2qHHnJsnbfv7+LkuDX9hzicgkAA8tgyxwSmeB8lp3rGuKWucDTPk4G6iR9JrOpJY0+NcxBJz6oAyLfu18P1qI+Sz0q4+YfV+hCGU0FCtGHarHMEl4SBhmsKnV+Ro2zB5x1AUEjJbvcTCMsvvAWXooN2Z2TjIJkXJD0Tpzui6Cl0qtkCpbqxOzkJhmRsAAAAA=="; }
  })();

  var _render10 = render;
  render = function () {
    _render10.apply(this, arguments);
    if (!LOGO_OK) return;
    document.querySelectorAll("#app .brand").forEach(function (b) {
      if (b.querySelector(".logo-img")) return;
      var svg = b.querySelector("svg.logo"); if (svg) svg.remove();
      var h1 = b.querySelector("h1"); if (h1) h1.classList.add("sr-only");
      b.insertAdjacentHTML("afterbegin", '<img class="logo-img" src="logo.webp" alt="Spionligan">');
    });
  };

  document.head.insertAdjacentHTML("beforeend", "<style>" +
    ".logo-img { display: block; width: clamp(230px, 62vw, 420px); height: auto; }" +
    ".sr-only { position: absolute !important; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }" +
    "</style>");
  render();
