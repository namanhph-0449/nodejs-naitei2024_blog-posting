$(function() {
  // load available tags
  $.ajax({
    type: 'GET',
    url: '/tags',
    dataType: 'json',
    success: function(data) {
      const availableTags = data;
      $("#textBox").autocomplete({
        source: availableTags
      });
    }
  });
  // get tags of this post
  var tags = [];
  const urlPath = window.location.pathname;
  const postId = urlPath.split('/').pop();
  if (postId) {
    $.ajax({
      type: 'GET',
      url: `/posts/detail/${postId}/tags`,
      dataType: 'json'
    }).then(function(data) {
      tags = data;
      $.each(tags, function(index, tag) {
        $(".target").append("<a href='#' class='tag'>" + tag + '<span class="cross">X</span>' + "</a>");
      });
      $('#hiddenTags').val(tags);
    });
  }

  $('body').on('click', 'span.cross', function () {
    var removedItem = $(this).parent().contents().filter(function () {
      return this.nodeType === 3; // 3 is the nodeType for text nodes
    }).text();
    $(this).parent().remove();
    tags = $.grep(tags, function (value) {
      return value != removedItem;
    });
    $('#hiddenTags').val(tags);
  });
  $("#textBox").keypress(function (e) {
    if (e.which === 13) { // add new tag
      $(".target").append("<a href='#' class='tag'>" + this.value + '<span class="cross">X</span>' + "</a>");
      tags.push(this.value);
      this.value = "";
    }
    $('#hiddenTags').val(tags);
  });

  const form = document.getElementById('edit-post-form');
  form.addEventListener('submit', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      return;
    }
  });
});
