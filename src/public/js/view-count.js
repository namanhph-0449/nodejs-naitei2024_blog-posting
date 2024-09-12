window.onbeforeunload = function() {
  window.scrollTo(0, 0);
};

// Increase View Count if
// User read until the end
// and User read at least minReadTime (seconds)
const pageEnd = document.getElementById('checkpoint');
const watcher = scrollMonitor.create(pageEnd);
let postReadTime = 0;
let isFullRead = false;
const startTime = Date.now();
const minReadTime = 30;

watcher.enterViewport(function() {
  isFullRead = true;
});

const intervalId = setInterval(() => {
  postReadTime = (Date.now() - startTime) / 1000;
  if (postReadTime >= minReadTime && isFullRead) {
    clearInterval(intervalId);
    // Increase view count
    const urlPath = window.location.pathname;
    const postId = urlPath.split('/').pop();
    $.post("/increase-view", {
      postId
    }, function (data, status) {
      console.log(data);
    });
    watcher.destroy();
  }
}, 1000); // Check every second
