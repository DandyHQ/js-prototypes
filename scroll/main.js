
Scroller = function(element) {
  var element = $(element);

  var isHovering = false;
  var isDown = false;

  var pos =
    { x: 0
    , y: 0
    };
  var oldY = 0;

  function mouseOver(event) {
    if (!isDown)
      element.css('background-color', '#535859');
    isHovering = true;
  }

  function mouseOut(event) {
    if (!isDown)
      element.css('background-color', '#787c7d');
    isHovering = false;
  }

  function mouseUp(event) {
    isDown = false;
    pos.x = 0;
    pos.y = 0;
    oldY = 0;
    if (isHovering)
      mouseOver();
    else
      mouseOut();
  }
  this.mouseUp = mouseUp;

  function mouseDown(event) {
    pos.x = event.originalEvent.x;
    pos.y = event.originalEvent.y;
    oldY = parseInt(element.css('margin-top'));

    element.css('background-color', '#2a76c6');
    isDown = true;
  }

  function mouseMove(event) {
    if (!isDown)
      return;

    var newPos =
      { x: event.originalEvent.x
      , y: event.originalEvent.y
      }

    var newY = oldY + (newPos.y - pos.y);
    // past the top
    if (newY < 0 + 2)
      newY = 0 + 2;
    // past the bottom
    if (newY + element.outerHeight() + 2 > 480)
      newY = 480 - element.outerHeight() - 2;

    element.css('margin-top', newY + 'px');
  }
  this.mouseMove = mouseMove;

  element.hover(mouseOver, mouseOut);
  element.mousedown(mouseDown);
}


function init() {
  var scroller = new Scroller($('.scroller'));
  $(document).mouseup(scroller.mouseUp);
  $(document).mousemove(scroller.mouseMove);
}
