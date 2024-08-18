$(document).ready(function() {
  $('.edit-profile-link').click(function(event) {
    event.preventDefault();
    $('#edit-profile-form, #update-password-form, .blog-list').toggleClass('d-none');
  });
  
  $('.like-button').click(function() {
    const button = $(this);
    const urlPath = window.location.pathname;
    const postId = urlPath.split('/').pop();
    $.ajax({
      type: 'POST',
      url: `/like/${postId}`,
      contentType: 'application/json',
      success: function(response) {
        if (response.success) {
          button.text(response.message);
        } else {
          console.error('Like failed:', response.message);
        }
      },
      error: function(error) {
        console.error('AJAX error:', error);
      }
    });
  });

  $('.bookmark-button').click(function() {
    const button = $(this);
    const urlPath = window.location.pathname;
    const postId = urlPath.split('/').pop();
    $.ajax({
      type: 'POST',
      url: `/bookmark/${postId}`,
      contentType: 'application/json',
      success: function(response) {
        if (response.success) {
          button.text(response.message);
        } else {
          console.error('Bookmark failed:', response.message);
        }
      },
      error: function(error) {
        console.error('AJAX error:', error);
      }
    });
  });
});
