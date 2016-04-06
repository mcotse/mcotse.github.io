var height = $(window).height();
(function () {
    $(window).scroll(function () {
        var oVal;
        oVal = $(window).scrollTop() / height;
        return $('.blur').css('opacity', oVal);
    });
}.call(this));
