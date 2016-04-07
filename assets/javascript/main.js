var height = $(window).height();
var  mn = $(".main-nav");
    mns = "main-nav-scrolled";
    hdr = $('header').height();

(function () {
    $(window).scroll(function () {
        var oVal;
        oVal = $(window).scrollTop() / height * 2;
        return $('.blur').css('opacity', oVal);
    });
}.call(this));

$(window).scroll(function() {
  if( $(this).scrollTop() > hdr ) {
    mn.addClass(mns);
  } else {
    mn.removeClass(mns);
  }
});
