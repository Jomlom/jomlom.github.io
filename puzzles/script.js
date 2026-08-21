var dark = true;
var views = ['list', 'p1', 'p2', 'p3', 'p4'];
var puzzleIds = ['p1', 'p2', 'p3', 'p4'];
var currentView = 'list';

function toggleTheme() {
  dark = !dark;
  document.body.classList.toggle('light', !dark);
  document.getElementById('tgl').innerHTML = dark ? '&#9790;' : '&#9728;';
}

function show(id) {
  views.forEach(function (v) {
    document.getElementById(v).classList.remove('active');
  });
  var el = document.getElementById(id);
  el.classList.add('active');
  el.querySelectorAll('details[open]').forEach(function (d) {
    d.removeAttribute('open');
  });
  window.scrollTo(0, 0);
  if (puzzleIds.indexOf(currentView) !== -1) {
    PuzzleAnalytics.cancelAttemptTimer();
  }
  currentView = id;
  if (puzzleIds.indexOf(id) !== -1) {
    PuzzleAnalytics.startAttemptTimer(id);
    PuzzleAnalytics.renderCount(id, document.getElementById('attempts-' + id));
  }
}

function showPuzzle(id) { show(id); }
function showList() { show('list'); }

puzzleIds.forEach(function (id) {
  PuzzleAnalytics.renderCount(id, document.getElementById('card-attempts-' + id));
});

document.querySelectorAll('.copy-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    navigator.clipboard.writeText(btn.dataset.copy)
    var original = btn.textContent
    btn.textContent = 'copied'
    setTimeout(function () { btn.textContent = original }, 1500)
  })
})
