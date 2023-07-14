
function loadScript(url, callback) {
  var script = document.createElement('script');
  script.src = url;
  script.onload = callback;
  document.head.appendChild(script);
}

function loadjquery() {
  if (navigator.onLine) {
    // Online: Load jQuery from CDN
    loadScript('https://code.jquery.com/jquery-3.6.0.min.js', function() {
      // jQuery loaded, you can start using it
      console.log('jQuery loaded from CDN');
    });
  } else {
    // Offline: Load jQuery locally
    loadScript('path/to/jquery-3.6.0.min.js', function() {
      // jQuery loaded, you can start using it
      console.log('jQuery loaded locally');
    });
  }
}

loadjquery();

// <script src="assets/js/loadjquery.js"></script>