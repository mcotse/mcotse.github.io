//nav-scrolling
$("#about-nav").click(function() {
    $('html, body').animate({
        scrollTop: $("#about").offset().top
    }, 700);
});
$("#work-nav").click(function() {
    $('html, body').animate({
        scrollTop: $("#work").offset().top
    }, 700);
});
$("#contact-nav").click(function() {
    $('html, body').animate({
        scrollTop: $("#contact").offset().top
    }, 700);
});

$('[data-typer-targets]').typer()
