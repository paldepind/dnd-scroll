(function(exports) {
	exports.dndScroll = function(opts) {
		opts = opts || {};
    var speed = opts.speed || 15;
    var topTriggerId = opts.topTriggerId || 'top-scroll-trigger';
    var bottomTriggerId = opts.bottomTriggerId || 'bottom-scroll-trigger';

    var body = document.body,
        html = document.documentElement;

    var wasAtTop, wasAtBottom;

    function getIsAtTop() {
      return window.scrollY === 0;
    }

    function getIsAtBottom() {
      var height = Math.max(body.scrollHeight, body.offsetHeight,
                            html.clientHeight, html.scrollHeight, html.offsetHeight);
      var bottom = window.innerHeight + window.scrollY;
      return height === bottom;
    }

    function updateClasses() {
      var isAtTop = getIsAtTop();
      var isAtBottom = getIsAtBottom();
      if (isAtTop !== wasAtTop) {
        topTriggerElm.classList.toggle('top-drag-started');
      }
      if (isAtBottom !== wasAtBottom) {
        bottomTriggerElm.classList.toggle('bottom-drag-started');
      }
      wasAtTop = isAtTop;
      wasAtBottom = isAtBottom;
    }

    function doScroll() {
      if (dir === 0) return;
      var y = window.scrollY + dir * speed * scale;
      window.scrollTo(window.scrollX, y);
      updateClasses();
      window.requestAnimationFrame(doScroll);
    }

    var dir = 0, scale = 0;
    function createTrigger(isTop) {
			var elm = document.createElement('div');
      elm.innerHTLM = '&nbsp;';
      elm.id = isTop ? topTriggerId : bottomTriggerId;
    }
    function addListeners(elm, isTop) {
      elm.addEventListener('dragenter', function(e) {
        dir = isTop ? -1 : 1;
        elm.classList.add('drag-hover');
        doScroll();
        return true;
      });
      elm.addEventListener('dragleave', function(e) {
        elm.classList.remove('drag-hover');
        dir = 0;
      });
      elm.addEventListener('dragover', function(e) {
        var rect = elm.getBoundingClientRect();
        var overlap = isTop ? rect.bottom - e.clientY : e.clientY - rect.top;
        scale = overlap / (2*rect.height) + 0.5;
      });
      body.appendChild(elm);
      return elm;
    }
		
		var topTriggerElm = document.getElementById(topTriggerId) || createTrigger(true);
    addListeners(topTriggerElm, true);
		
		var bottomTriggerElm = document.getElementById(bottomTriggerId) || createTrigger(false);
    addListeners(bottomTriggerElm, false);

    document.addEventListener('dragstart', function(e) {
      wasAtTop = true, wasAtBottom = true;
      updateClasses();
    });

    document.addEventListener('dragend', function(e) {
      topTriggerElm.classList.remove('top-drag-started');
      bottomTriggerElm.classList.remove('bottom-drag-started');
    });
	};
})(this);
