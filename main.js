$(document).ready(function(){

  // bxSlider
  $('.galeria').bxSlider({
    mode: 'fade',
    captions: true,
    auto: true,
    pause: 4000
  });

  // Botón "Ir arriba"
  $('.subir').click(function(e){
    e.preventDefault();
    $('html, body').animate({
      scrollTop: 0
    }, 500);
  });

});
