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

  $('.reply-button').on('click', function() {
    // Get the ID of the clicked reply button
    var buttonId = $(this).attr('id');
    var commentId = buttonId.split('-')[1]; // Extract commentId from button ID

    $('.reply-form').hide();
    var replyForm = $('#replyForm-' + commentId);
    replyForm.toggle();
    replyForm.find('input[name="parentCommentId"]').val(parseInt(commentId));

    if (replyForm.is(':visible')) {
      $('html, body').animate({
        scrollTop: replyForm.offset().top - 100
      }, 500);
    }
  });

  // Toggle display of replies section
  $('.reply-button').on('click', function() {
    var commentId = $(this).data('comment-id');
    var repliesSection = $('#replies-' + commentId);

    // Toggle the replies section visibility
    repliesSection.toggle();
  });

  $('#toggleCommentForm').click(function() {
    $('#commentForm').toggle();
  });

});
