// Override visibility and focus properties/events for tab/fullscreen bypass
(function() {
  const originalAddEventListener = window.addEventListener;
  window.addEventListener = function(type, listener, options) {
    if (['visibilitychange', 'blur', 'focus', 'webkitvisibilitychange', 'mozvisibilitychange', 'msvisibilitychange'].includes(type)) {
      console.log('Blocked detection event: ' + type);
      return; // Skip registering these
    }
    return originalAddEventListener.call(this, type, listener, options);
  };

  // Force always visible/focused
  Object.defineProperty(document, 'hidden', { value: false, writable: false });
  Object.defineProperty(document, 'visibilityState', { get: () => 'visible', writable: false });
  Object.defineProperty(document, 'webkitHidden', { value: false, writable: false });
  Object.defineProperty(document, 'mozHidden', { value: false, writable: false });
  Object.defineProperty(document, 'msHidden', { value: false, writable: false });

  document.hasFocus = () => true;
  window.onfocus = () => true;
  window.onblur = null;
  document.onvisibilitychange = undefined;

  // Block any lingering events
  ['visibilitychange', 'blur', 'focus', 'webkitvisibilitychange', 'mozvisibilitychange', 'msvisibilitychange'].forEach(eventName => {
    document.addEventListener(eventName, (e) => {
      e.stopImmediatePropagation();
      e.preventDefault();
      return false;
    }, true);
  });

  console.log('Bypass active: Tab switches should be undetectable.');
})();