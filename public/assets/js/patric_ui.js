$(document).ready(function () {

    $('#navbarDropdown_search').on('click', function (event) {
        $(this).parent().toggleClass('show');
        $(this).parent().find(".dropdown-menu").toggleClass("show");
    });

    // when you hover a toggle show its dropdown menu
    $("#navbarDropdown_search").hover(function () {
        if (!$(this).parent().find(".show")) {
            $(this).parent().toggleClass("show");
            $(this).parent().find(".dropdown-menu").toggleClass("show");
        }

    });

    // when you submit the search, hide the dropdown
    $(".gs-advanced-search").click(function () {
            $(".dropdown").removeClass("show");
            $(".dropdown-menu").removeClass("show");
    });


    $('body').on('click', function (e) {
        if (!$('.dropdown-menu').is(e.target)
            && $('.dropdown-menu').has(e.target).length === 0
            && $('.show').has(e.target).length === 0
        ) {
            $('.dropdown').removeClass('show');
            $('.dropdown-menu').removeClass('show');
        }
    });

});