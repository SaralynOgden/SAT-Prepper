let currentQuestion;
let currentAnswer;

// Shuffles an array
const shuffle = function(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const randIndex = getRandomInt(0, 3);
    const temp = arr[randIndex];

    arr[randIndex] = arr[i];
    arr[i] = temp;
  }
};

const heartOfAlgebra = [getSingleLinearEqnQAS];
// const passportToAdvancedMath = [SimplificationQuestion];
// const problemSolving = [];
// const other = [i];
const questionCategories = [heartOfAlgebra];

// Sets the answers for a question
const getNextAnswers = function(answerLabelArr, answerArr) {
  for (let i = 0; i < 4; i++) {
    if (answerArr[i].indexOf('`') !== -1) {
      answerLabelArr[i].style.margin = '25px 0px 25px 0px';
    }
    answerLabelArr[i].innerHTML = answerArr[i];
    if (answerArr[i] === currentAnswer) {
      answerLabelArr[i].id = 'correct-answer';
    }
  }
};

// Generates the question that will be shown the next time the user presses
// the button
const getNextQuestion = function() {
  const questionCategory =
          questionCategories[getRandomInt(0, questionCategories.length - 1)];
  const QuestionSubCategory =
          questionCategory[getRandomInt(0, questionCategory.length - 1)];

  currentQuestion = new QuestionSubCategory();
  const $questionCard = $(`<div class="card">\
    <div class="card-content">\
      <p id="question">${currentQuestion.question}</p>\
      <form>\
        <p class="answer">\
          <input class="with-gap" name="group1" type="radio" id="a" />\
          <label for="a"></label>\
        </p>\
        <p class="answer">\
          <input class="with-gap" name="group1" type="radio" id="b" />\
          <label for="b"></label>\
        </p>\
        <p class="answer">\
          <input class="with-gap red" name="group1" type="radio" id="c"  />\
          <label for="c"></label>\
        </p>\
        <p class="answer">\
          <input class="with-gap" name="group1" type="radio" id="d"/>\
          <label for="d"></label>\
        </p>\
        <button class="waves-effect waves-light btn right disabled card-btn" \
          id="check" type="button" disabled>Check</button>\
      </form>\
    </div>\
  </div>`);

  $('#card-processor').append($questionCard);
  getNextAnswers($('#card-processor label').toArray(),
                    currentQuestion.answerSet);

  const cardProcessor = document.getElementById('card-processor');

  MathJax.Hub.Queue(["Typeset",MathJax.Hub, cardProcessor]);
};

const enableCheckButton = function() {
  $('#check').removeClass('disabled');
  $('#check').prop('disabled', false);
  $(':radio').off('click');
};

// Sets a question to the last question generated
const setQuestion = function() {
  const start = new Date().getTime();

  $('#card-holder').empty().append(
    $(document.getElementById('card-processor').children[0].outerHTML));
  $('#card-processor').empty();
  $('#check').click(checkAnswer(start)).click(getNextQuestion);
  $(':radio').click(enableCheckButton);
};

// Provides feedback to the user if they got the question right or not
const checkAnswer = function(start) {
  return function() {
    $('#check').off('click').text('Next').attr('id', 'next');
    const $userAnswer = $('input:checked').siblings('label');

    $('#correct-answer').css('color', '#22A552');
    if ($userAnswer.attr('id') !== 'correct-answer') {
      $userAnswer.css('color', '#CE1C1C');
    }
    const end = new Date().getTime();
    const $userTime = $(`<p class="right" id="user-time">
                        ${(end - start) / 1000}s</p><br/>`);

    $('#next').before($userTime);
    $('#next').click(setQuestion);
  };
};

// Generate the first question and answer before the user clicks
// into the website to avoid delays caused by slow (2-5s) ajax requests
getNextQuestion();
$('#next').click(setQuestion);
