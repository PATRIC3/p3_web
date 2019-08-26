$(document).ready(function () {

  /**
   * Menu functionality and behavior
   * Open: menu opens on :hover of menu link
   * Stay Open: onClick of menu link, and if using menu
   * Closes: click anywhere off menu, click link in menu
  */

  // this is specifically so that the menu will remain open even if user loses :focus while using dropdown menu in search or filling out contact form.
  $('.dropdown-menu').hover(function () {
    $(this).addClass('show');
  });

  // Click anywhere on the page not the menu to close it
  $('body').on('click', function (e) {
    if (!$('.dropdown-menu').is(e.target)
        && $('.dropdown-menu').has(e.target).length === 0
        && $('.show').has(e.target).length === 0
    ) {
      $('.dropdown').removeClass('show');
      $('.dropdown-menu').removeClass('show');
    }
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
