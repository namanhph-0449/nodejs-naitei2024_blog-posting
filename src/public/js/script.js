$(document).ready(function() {
  $('.edit-profile-link').click(function(event) {
    event.preventDefault();
    $('#edit-profile-form, #update-password-form, .blog-list').toggleClass('d-none');
  });
});
