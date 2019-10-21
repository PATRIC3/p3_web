$(document).ready(function () {


  $('.list-group-item-action.external-link').mouseenter(function () {
    $(this).append('<i class="icon-external-link"></i>');
  });

  $('.list-group-item-action.external-link').mouseleave(function () {
    $(this).find('.icon-external-link').remove();
  });


  /*
   * This is commented out because it's not quite right
   * and there's still usability issues (hover tunnel!)
   *
   */

  // function hideDropdown() {
  //   $('.dropdown-menu.show').removeClass('show');
  //   $('.dropdown.show').removeClass('show');
  // }

  // function isDropdownOpen() {
  //   return $('.dropdown.show').length > 0;
  // }

  // after click, change on hover
  // $('.nav-item').on('click', function (event) {
  //   $('.nav-item').hover(function () {
  //     if (!isDropdownOpen()) return;
  //     hideDropdown();
  //     $(this).addClass('show');
  //     $(this).find('.dropdown-menu').addClass('show');
  //   });
  // });


  // Focus on the search input when clicking open search dropdown
  // $('#navbarDropdown_search').click(function () {
  //   var self = this;
  //   setTimeout(function () {
  //     var input = $('.dropdown-menu .dijitInputInner');
  //     input.focus();
  //   });
  // });

  // force the search menu closed when submiting search with Return/enter
  // $(this).find('.dropdown-menu .dijitInputInner').keypress(function (e) {
  //   if (e.which == 13) {
  //     hideDropdown();
  //   }
  // });

  // force the search menu closed when submiting search
  // $('.dropdown-menu__search .icon-search').click( function () {
  //   hideDropdown();
  // });

  // force the account menu closed when the login or register button are clicked
  // $('.dropdown-menu__account .dijitButtonNode').click( function () {
  //   hideDropdown();
  // });
});
