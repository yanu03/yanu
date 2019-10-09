/*!
 *
 * Easy Order
 *
 */
$(function() {
  if (typeof webkitSpeechRecognition !== 'function') {
    alert('크롬에서만 동작 합니다.');
    return false;
  }

  let isRecognizing = false;
  let ignoreEndProcess = false;
  let finalTranscript = '';

  const audio = document.querySelector('#audio');
  const recognition = new window.webkitSpeechRecognition();
  const language = 'ko-KR';
  const two_line = /\n\n/g;
  const one_line = /\n/g;
  const first_char = /\S/;

  const $btnMic = $('#btn-mic');
  const $result = $('#result');
  

  recognition.continuous = true;
  recognition.interimResults = true;

  /**
   * 음성 인식 시작 처리
   */
  recognition.onstart = function() {
    console.log('onstart', arguments);
    isRecognizing = true;
    $btnMic.attr('class', 'on');
  };

  /**
   * 음성 인식 종료 처리
   * @returns {boolean}
   */
  recognition.onend = function() {
    console.log('onend', arguments);
    isRecognizing = false;

    if (ignoreEndProcess) {
      return false;
    }

    // DO end process
    $btnMic.attr('class', 'off');
    if (!finalTranscript) {
      console.log('empty finalTranscript');
      return false;
    }
  };

  /**
   * 음성 인식 결과 처리
   * @param event
   */
  recognition.onresult = function(event) {
    console.log('onresult', event);

    let interimTranscript = '';
    if (typeof event.results === 'undefined') {
      recognition.onend = null;
      recognition.stop();
      return;
    }

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    finalTranscript = capitalize(finalTranscript);
    final_span.innerHTML = linebreak(finalTranscript);
    interim_span.innerHTML = linebreak(interimTranscript);

    console.log('finalTranscript', finalTranscript);
    console.log('interimTranscript', interimTranscript);
    fireCommand(interimTranscript);
  };

  /**
   * 음성 인식 에러 처리
   * @param event
   */
  recognition.onerror = function(event) {
    console.log('onerror', event);

    if (event.error.match(/no-speech|audio-capture|not-allowed/)) {
      ignoreEndProcess = true;
    }

    $btnMic.attr('class', 'off');
  };


  /**
   * 개행 처리
   * @param s
   * @returns {string}
   */
  function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
  }

  /**
   * 첫문자를 대문자로 변환
   * @param s
   * @returns {string | void | *}
   */
  function capitalize(s) {
    return s.replace(first_char, function(m) {
      return m.toUpperCase();
    });
  }

  /**
   * 음성 인식 트리거
   * @param event
   */
  function start(event) {
    if (isRecognizing) {
      recognition.stop();
      return;
    }
    recognition.lang = language;
    recognition.start();
    ignoreEndProcess = false;

    finalTranscript = '';
    final_span.innerHTML = '';
    interim_span.innerHTML = '';
  }

  /**
   * 문자를 음성으로 읽어 줍니다.
   * 지원: 크롬, 사파리, 오페라, 엣지
   */
  function textToSpeech(text) {
    console.log('textToSpeech', arguments);

    speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  }
  /**
   * 초기 바인딩
   */
  function initialize() {
    $btnMic.click(start);
    $('#btn-tts').click(function() {
      const text = document.getElementById('final_span2').value || '글을 입력해 주세요.';
      textToSpeech(text);
    });
  }

  initialize();
});
