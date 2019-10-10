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

  function hideDropdown() {
    $('.dropdown-menu.show').removeClass('show');
    $('.dropdown.show').removeClass('show');
  }

  function isDropdownOpen() {
    return $('.dropdown.show').length > 0;
  }

  // after click, change on hover
  $('.nav-item').on('click', function (event) {
    $('.nav-item').hover(function () {
      if (!isDropdownOpen()) return;
      hideDropdown();
      $(this).addClass('show');
      $(this).find('.dropdown-menu').addClass('show');
    });
  });
  */

  // Focus on the search input when clicking open search dropdown
  $('#navbarDropdown_search').click(function () {
    var self = this;
    setTimeout(function () {
      var input = $('.dropdown-menu .dijitInputInner');
      input.focus();
    });
  });

  // force the search menu closed when submiting search with Return/enter
  $(this).find('.dropdown-menu .dijitInputInner').keypress(function (e) {
    if (e.which == 13) {
      hideDropdown();
    }
  });

  // force the search menu closed when submiting search
  $('.dropdown-menu__search .icon-search').click( function () {
    hideDropdown();
  });

  // force the account menu closed when the login or register button are clicked
  $('.dropdown-menu__account .dijitButtonNode').click( function () {
    hideDropdown();
  });

  /**
   * "Email PATRIC" form
  */
  var config = window.App;
  var user = config.user.username;

  // remove the email field if logged in
  if (user) $('.contact-patric-email').remove();

  // contact patric form submission event
  $('#contact-patric').submit(function () {
    var self = this;

    var name = $(this).find('#contactName').val();
    var email = $(this).find('#contactEmail').val();
    var subject = $(this).find('#contactSubject').val();
    var msg = $(this).find('#contactMessage').val();
    var fileInput = $(this).find('#contactAttachment');
    var file = fileInput.val() ? fileInput.prop('files')[0] : null;

    var form = new FormData();
    form.append('name', name);
    form.append('email', email || '');
    form.append('subject', subject);
    form.append('content', msg);
    form.append('appVersion', config.appVersion);
    form.append('url', window.location.href);
    form.append('userId', user);
    form.append('attachment', file || '');

    $.ajax({
      url: '/reportProblem',
      data: form,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function (data) {
        $(self).parent().append(
          '<br><div class="alert alert-success" role="alert">' +
            'Thanks for your feedback!<br>' +
            'We will respond within two business days to your inquiry.' +
          '</div>'
        );

        // clear form
        $(self).find('input, textarea').val('');
      },
      error: function (err) {
        $(self).parent().append(
          '<br><div class="alert alert-danger" role="alert">' +
            'Sorry, there was an issue submitting your feedback.<br>' +
            'Please email us at <a href="mailto:help@patricbrc.org">help@patricbrc.org</a>.' +
          '</div>'
        );
        console.log('PATRIC contact form submission failed:', err);
      }
    });

    return false; // no redirect
  });
});
