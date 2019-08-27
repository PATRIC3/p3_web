$(document).ready(function () {

  // prevent dropdown-menu from closing unexpectedly
  $('.dropdown-menu').not('.dropdown-menu__account').click( function (e) {
    e.stopImmediatePropagation();
  });

  // force the search menu closed when submiting search
  $('.dropdown-menu__search .icon-search').click( function () {
    // console.log('icon-search has been clicked');
    $('.dropdown-menu.show').removeClass('show');
    $('.dropdown.show').removeClass('show');
  });

  // force the account menu closed when the login or register button are clicked
  $('.dropdown-menu__account .dijitButtonNode').click( function () {
    // cconsole.log('login / register button clicked');
    $('.dropdown-menu.show').removeClass('show');
    $('.dropdown.show').removeClass('show');
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
