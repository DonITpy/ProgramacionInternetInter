(function () {
  "use strict";

  function svgPlaceholder(text) {
    var safe = String(text || "Imagen").replace(/&/g, "y").slice(0, 28);
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="650">' +
        '<defs>' +
          '<linearGradient id="g" x1="0" x2="1" y1="0" y2="1">' +
            '<stop offset="0" stop-color="#f97316"/>' +
            '<stop offset="1" stop-color="#ea580c"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<rect width="100%" height="100%" fill="url(#g)"/>' +
        '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"' +
          ' font-family="system-ui,Segoe UI,Roboto,Arial" font-size="56" fill="#ffffff" font-weight="700">' +
          safe +
        '</text>' +
      '</svg>';

    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  function initSliderWhenReady() {
    var $galeria = $(".galeria");
    if (!$galeria.length || !$.fn.bxSlider) return;

    // Evita doble inicialización
    if ($galeria.data("bx-init")) return;

    var $imgs = $galeria.find("img");
    var total = $imgs.length;
    if (!total) return;

    var remaining = total;
    var started = false;

    // Si una imagen falla, la reemplaza por placeholder
    $imgs.each(function (idx) {
      var img = this;
      var title = img.getAttribute("title") || ("Imagen " + (idx + 1));
      $(img).one("error", function () {
        console.warn("Imagen no cargó (revisa ruta):", img.getAttribute("src"));
        img.setAttribute("src", svgPlaceholder(title));
      });
    });

    function startSlider() {
      if (started) return;
      started = true;
      $galeria.data("bx-init", true);

      var $controls = null;
      var lockControls = function (locked) {
        if (!$controls) $controls = $(".bx-wrapper .bx-controls-direction a");
        if (!$controls.length) return;
        $controls.css("pointer-events", locked ? "none" : "auto");
      };

      $galeria.bxSlider({
        mode: "horizontal",
        captions: true,

        // Auto, pero sin brincos cuando el usuario hace click
        auto: true,
        pause: 3800,
        speed: 650,
        stopAutoOnClick: true, // clave: evita doble avance (auto + click)
        autoHover: true,       // pausa auto al pasar el mouse

        // Fuerza avance de 1 en 1
        moveSlides: 1,
        minSlides: 1,
        maxSlides: 1,
        slideMargin: 0,

        // Estabilidad visual
        adaptiveHeight: false,
        adaptiveHeightSpeed: 0,
        preloadImages: "all",
        responsive: true,

        controls: true,
        pager: true,
        touchEnabled: true,
        infiniteLoop: true,

        // desactiva clicks durante la animación
        onSlideBefore: function () {
          lockControls(true);
        },
        onSlideAfter: function () {
          lockControls(false);
        }
      });

      // Asegura que los controles queden activos al inicio
      setTimeout(function () { lockControls(false); }, 50);
    }

    $imgs.each(function () {
      if (this.complete) {
        remaining--;
      } else {
        $(this).one("load error", function () {
          remaining--;
          if (remaining <= 0) startSlider();
        });
      }
    });

    if (remaining <= 0) startSlider();
    setTimeout(startSlider, 1500);
  }

  $(window).on("load", function () {
    initSliderWhenReady();

    // Botón "Ir arriba" con scroll suave
    var $btnSubir = $(".subir");
    if ($btnSubir.length) {
      $btnSubir.hide();

      $btnSubir.on("click", function (e) {
        e.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, 500);
      });

      $(window).on("scroll", function () {
        if ($(this).scrollTop() > 220) $btnSubir.fadeIn(180);
        else $btnSubir.fadeOut(180);
      });
    }
  });

})();
