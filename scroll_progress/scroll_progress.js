// (Copied from underscore.js)
// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
function throttle(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  options || (options = {});
  var later = function() {
    previous = options.leading === false ? 0 : new Date();
    timeout = null;
    result = func.apply(context, args);
  };
  return function() {
    var now = new Date();
    if (!previous && options.leading === false) {
      previous = now;
    }
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0) {
      clearTimeout(timeout);
      timeout = null;
      previous = now;
      result = func.apply(context, args);
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}

// (Copied from underscore.js)
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var result;
  var timeout = null;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
    }
    return result;
  };
}

// スクロール率
var progress = 0;

// Creates the indicator, which is a small div lying in the lower left corner
// of the window, showing the scroll progress.
var indicator = document.createElement('div');
indicator.setAttribute('id', 'extention-scroll_progress');
indicator.innerHTML = progress + ' %';
indicator.style.position = 'fixed';
indicator.style.left = '0';
indicator.style.bottom = '0';
indicator.style.zIndex = '99999999';
indicator.style.padding = '3px';
indicator.style.fontSize = '9px';
indicator.style.lineHeight = '1.2';
indicator.style.background = '#eee';
indicator.style.border = '1px solid #aaa';
indicator.style.borderRadius = '0 3px 0 0';

// Creates a debounced version of the hide function, so that the indicator
// should be hide only when there's no scroll activity for 300ms.

function scrollHandler() {
  scroll_top = document.scrollingElement.scrollTop;
  degree_height = (document.body.scrollHeight - window.innerHeight);
  // console.log("scroll_top: " + scroll_top);
  // console.log("document.body.scrollHeight: " + document.body.scrollHeight);
  // console.log("window.innerHeight:" + window.innerHeight);
  // console.log("degree_height: " +degree_height);

  if ( degree_height === 0) {
    return false;
  }

  if ( !document.getElementById('extention-scroll_progress') ) {
    document.body.appendChild(indicator);
  }

  progress = scroll_top / degree_height * 100;
  progress = Math.round(Math.max(Math.min(progress, 100), 0));
  indicator.innerHTML = progress + ' %';

  // console.log(progress);
}

// bodyがスクロールできる時のみ動作させる
if (getComputedStyle(document.body).overflowY != 'auto') {
  // 「window」for 'load' of webkit. 「document」 is not wokr 'load' on webkit.
  window.addEventListener('load', throttle(scrollHandler, 0));
  window.addEventListener('scroll', throttle(scrollHandler, 100));
}