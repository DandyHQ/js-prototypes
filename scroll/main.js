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

Input = function(element) {
  var element = $(element);
  var input = element.find('textarea');

  var scroller = new Scroller(element.find('.scroller'));

  function getValue(){
    return input.text();
  }
  this.getValue = getValue;

  function setValue(value){
    input.text(value);
  }
  this.setValue = setValue;

  $(document).mouseup(scroller.mouseUp);
  $(document).mousemove(scroller.mouseMove);
}


Buttons = function(element) {
  var element = $(element);

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

  element.find('.more-text').click(addText);
  element.find('.less-text').click(delText);
}




function init() {
  input = new Input($('.input'));
  new Buttons($('.text-control-buttons'));
}
