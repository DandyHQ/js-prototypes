var ipsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nibh nisi, sollicitudin vel magna eget, sagittis semper elit. Vestibulum maximus ullamcorper purus id vehicula. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis rutrum enim sit amet erat gravida, et cursus arcu suscipit. Quisque laoreet lectus sed ex ornare dictum. Donec lacinia felis ac iaculis gravida. Sed in laoreet dolor. Fusce in ipsum vel augue auctor gravida. Cras nec faucibus risus. Proin elementum purus ut congue suscipit. Integer volutpat turpis velit, eget fermentum diam malesuada nec.";

/**
 * Checks whether a string only contains whitespace characters.
 * Empty strings return true
 */
function isWhitespace(text) {
  return /^\s*$/.test(text);
}

/** Holds the reference to the one input object. */
var input;

Scroller = function(element) {
  var element = $(element);

  var isHovering = false;
  var isDown = false;

  var pos =
    { x: 0
    , y: 0
    };
  var oldY = 0;

  //---- INITIALISE ----

  //---- METHODS ----

  function resize() {
    var minimum = 20;

    var trackHeight = 476;
    var windowHeight = 480;
    var contentHeight = input.scrollHeight();

    var newHeight = trackHeight * (windowHeight / contentHeight);
    element.css('height', newHeight);
  }
  this.resize = resize;

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

    $('body').css('user-select', '');
  }
  this.mouseUp = mouseUp;

  function mouseDown(event) {
    pos.x = event.originalEvent.x;
    pos.y = event.originalEvent.y;
    oldY = parseInt(element.css('margin-top'));

    element.css('background-color', '#2a76c6');
    isDown = true;

    $('body').css('user-select', 'none');
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

    var scrollPercent = newY / (480 - element.outerHeight() - 4);
    input.scroll(scrollPercent);
  }
  this.mouseMove = mouseMove;

  /**
   * Position the scrollbar such that it remains in sync with the document.
   */
  function scroll(percent) {
    if (isDown)
      return;

    var newY = percent * (480 - element.outerHeight() - 4);

    // past the top
    if (newY < 0 + 2)
      newY = 0 + 2;
    // past the bottom
    if (newY + element.outerHeight() + 2 > 480)
      newY = 480 - element.outerHeight() - 2;

    element.css('margin-top', newY + 'px');
  }
  this.scroll = scroll;

  //---- EVENTS ----

  element.hover(mouseOver, mouseOut);
  element.mousedown(mouseDown);
}

Input = function(element) {
  var element = $(element);
  var input = element.find('textarea');

  var scroller = new Scroller(element.find('.scroller'));

  //---- INITIALISE ----

  setTimeout(scroller.resize, 0);

  //---- METHODS ----

  /**
   * Return the document text.
   */
  function getValue() {
    return input.text();
  }
  this.getValue = getValue;

  /**
   * Set the document text.
   */
  function setValue(value) {
    input.text(value);
    scroller.resize();
  }
  this.setValue = setValue;

  /**
   * Get the height of the scrollable document.
   */
  function scrollHeight() {
    return input[0].scrollHeight;
  }
  this.scrollHeight = scrollHeight;

  /**
   * Set the scroll position. Takes a float in the range 0-1.
   */
  function scroll(percent) {
    var scroll = percent * (scrollHeight() - 480);
    if (percent * 100 < 1)
      scroll = 0;
    input[0].scrollTop = scroll;
  }
  this.scroll = scroll;

  /**
   * Called when the input is scrolling. Send this message to our custom scrollbar.
   */
  function scrolling() {
    var scrollPercent = input[0].scrollTop / (scrollHeight() - 480);
    scroller.scroll(scrollPercent);
  }

  //---- EVENTS ----

  $(document).mouseup(scroller.mouseUp);
  $(document).mousemove(scroller.mouseMove);
  input.scroll(scrolling);
}


Buttons = function(element) {
  var element = $(element);

  //---- INITIALISE ----

  //---- METHODS ----

  /**
   * Drops either a paragraph or a set number of chars from text.
   *
   * NB This function is pure.
   */
  function dropParagraph(text){
    var split = text.split('\n');
    for (var i = split.length - 1; i >= 0; i--) {
      if (!isWhitespace(split[i]) && typeof split[i-1] !== 'undefined' && isWhitespace(split[i-1])) {
        split = split.slice(0, i-1);
        break;
      }
    }
    var joint = split.join('\n');
    if (joint == text) {
      joint = joint.slice(0, -500);
    }
    return joint;
  }

  function addText(){
    var text = input.getValue();
    text += '\n\n' + ipsum;
    input.setValue(text);
  }

  function delText(){
    var text = input.getValue();
    text = dropParagraph(text);
    input.setValue(text);
  }

  //---- EVENTS ----

  element.find('.more-text').click(addText);
  element.find('.less-text').click(delText);
}




function init() {
  input = new Input($('.input'));
  new Buttons($('.text-control-buttons'));
}
