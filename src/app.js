/**
 * Application: Barbell.exe
 * Author: Daniel Streicher <dstreicher@synergybis.com>
 * Description: A weight calculator for determining the disc distribution options on a barbell.
 */

var UI = require('ui');
var Vector2 = require('vector2');

var barValue = [0,0,0];
var barWeight = 45;
var weights = [45, 35, 25, 10, 5, 2.5];
var barKeys = ['digitOne', 'digitTwo', 'digitThree'];
var cursor = 0;
var cursorPosition = [new Vector2(12, 90), new Vector2(60, 90), new Vector2(108, 90)];

var main = new UI.Window();

var elements = {
  background : new UI.Rect({position: new Vector2(0, 0), size: new Vector2(144, 168)}),
  title: new UI.Text({position: new Vector2(0, 10), size: new Vector2(144, 35), font: 'bitham-30-black', color: 'black', text: 'BARMAN', textAlign: 'center'}),
  digitOne: new UI.Text({position: new Vector2(0, 42), size: new Vector2(48, 60), font: 'bitham-42-bold', color: 'black', text: barValue[0], textAlign: 'center'}),
  digitTwo: new UI.Text({position: new Vector2(48, 42), size: new Vector2(48, 60), font: 'bitham-42-bold', color: 'black', text: barValue[1], textAlign: 'center'}),
  digitThree: new UI.Text({position: new Vector2(96, 42), size: new Vector2(48, 60), font: 'bitham-42-bold', color: 'black', text: barValue[2], textAlign: 'center'}),
  digitCursor: new UI.Rect({position: cursorPosition[cursor], size: new Vector2(25, 5), backgroundColor: 'black'}),
  helpText: new UI.Text({position: new Vector2(0, 100), size: new Vector2(144, 60), font: 'gothic-14-bold', color: 'black', text: 'Up/Down: +/- val. Select: next input.', textAlign: 'center'})
};

main.add(elements.background);
main.add(elements.title);
main.add(elements.digitOne);
main.add(elements.digitTwo);
main.add(elements.digitThree);
main.add(elements.digitCursor);
main.add(elements.helpText);
main.show();

main.on('click', 'up', function(e) {
  barValue[cursor]++;
  barValue[cursor] = (barValue[cursor] > 9) ? 0 : barValue[cursor];
  elements[barKeys[cursor]].text(barValue[cursor]);
});

main.on('click', 'down', function(e) {
  barValue[cursor]--;
  barValue[cursor] = (barValue[cursor] < 0) ? 9 : barValue[cursor];
  elements[barKeys[cursor]].text(barValue[cursor]);
});

main.on('click', 'select', function(e) {
  if (cursor === 3) {
    calculateWeights();
  }
  else {
    cursor++;
    elements.digitCursor.position(cursorPosition[cursor]);
  }
});

function calculateWeights() {
  var input = parseInt(barValue.join(''));
  var output = [];
  var left = input - barWeight;
  while (left > 0) {
    var success = false;
    for (var i = 0; i < weights.length; i++) {
      var discs = weights[i] * 2;
      if (discs <= left) {
        left -= discs;
        output.push(weights[i]);
        success = true;
        break;
      }
    }
    if (!success) {
      output.push('Remainder: ' + left);
      break;
    }
  }
  var body = formatResults(output);
  showResults(body);
}

function formatResults(array) {
  var text = '';
  for (var i = 0; i < array.length; i++) {
    text += (array[i] + '\n');
  }
  return text;
}

function showResults(body) {
  var card = new UI.Card({scrollable: true});
  card.title('Barbell Result');
  card.body(body);
  card.show();
}
