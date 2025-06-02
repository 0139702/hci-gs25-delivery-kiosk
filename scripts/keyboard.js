let activeInput = null;
let inputBuffer = [];
let isShift = false;
let isHangul = true;

const keyMap = {
  'ㄱ': { shift: 'ㄲ' }, 'ㄷ': { shift: 'ㄸ' }, 'ㅂ': { shift: 'ㅃ' },
  'ㅅ': { shift: 'ㅆ' }, 'ㅈ': { shift: 'ㅉ' }
};

window.onload = () => {
  renderHangulKeyboard();
};

function setActiveInput(element) {
    if (activeInput && activeInput !== element) {
      activeInput.classList.remove('input-focus');
      // 입력값이 있을 경우 input-filled 유지
      if (activeInput.value.trim() !== '') {
        activeInput.classList.add('input-filled');
      } else {
        activeInput.classList.remove('input-filled');
      }
    }
  
    activeInput = element;
    inputBuffer = Hangul.disassemble(element.value || '');
  
    element.classList.add('input-focus');
    element.classList.remove('input-filled'); // 입력 중엔 filled 제거
  
    if (element.classList.contains("numeric")) {
      renderNumberPad();
    } else {
      renderKeyboard();
    }
  }

function renderKeyboard() {
  if (isHangul) {
    renderHangulKeyboard();
  } else {
    renderEnglishKeyboard();
  }
}

// 한글 키보드 렌더링
function renderHangulKeyboard() {
  const keyboard = document.getElementById("keyboardContainer");

  const topNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-"];
  const row1 = ["ㅂ", "ㅈ", "ㄷ", "ㄱ", "ㅅ", "ㅛ", "ㅕ", "ㅑ", "ㅐ", "ㅔ", "ㅖ"];
  const row2 = ["ㅁ", "ㄴ", "ㅇ", "ㄹ", "ㅎ", "ㅗ", "ㅓ", "ㅏ", "ㅣ"];
  const row3 = ["ㅋ", "ㅌ", "ㅊ", "ㅍ", "ㅠ", "ㅜ", "ㅡ"];

  keyboard.innerHTML = `
    <div class="keyboard-row top-row">
      ${topNumbers.map(n => keyBtn(n, "key-number")).join("")}
    </div>
    <div class="keyboard-row">
      ${row1.map(k => keyBtnWithSub(k)).join("")}
      ${specialKey("아파트")}
    </div>
    <div class="keyboard-row three-row">
      ${row2.map(k => keyBtnWithSub(k)).join("")}
      <button class="key key-special dong">동</button>
    </div>
    <div class="keyboard-row four-row">
      <button class="key key-func shift" onclick="toggleShift()">
        <img class="shift-icon" src="/hci-gs25-delivery-kiosk/assets/images/buttons_shift.png">
        Shift
      </button>
      ${row3.map(k => keyBtnWithSub(k)).join("")}
      <button class="key key-func back" onclick="backspace()">
        <img class="back-icon" src="/hci-gs25-delivery-kiosk/assets/images/button_backSpace.png">
      </button>
      <button class="key key-special ho">호</button>
    </div>
    <div class="keyboard-row bottom-row">
      <button class="key key-func lang" onclick="toggleLanguage()">한/영</button>
      <button class="key key-space" onclick="insertSpace()">띄움</button>
    </div>
  `;
}

function renderEnglishKeyboard() {
  const keyboard = document.getElementById("keyboardContainer");

  const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const row3 = ["Z", "X", "C", "V", "B", "N", "M"];

  keyboard.innerHTML = `
    <div class="keyboard-row top-row">
      ${["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-"].map(n => keyBtn(n, "key-number")).join("")}
    </div>
    <div class="keyboard-row">${row1.map(k => keyBtn(k)).join("")}</div>
    <div class="keyboard-row">${row2.map(k => keyBtn(k)).join("")}</div>
    <div class="keyboard-row">
      <button class="key key-func" onclick="toggleShift()">Shift</button>
      ${row3.map(k => keyBtn(k)).join("")}
      <button class="key key-func" onclick="backspace()">←</button>
    </div>
    <div class="keyboard-row bottom-row">
      <button class="key key-func" onclick="toggleLanguage()">한/영</button>
      <button class="key key-space" onclick="insertSpace()">띄움</button>
    </div>
  `;
}

function keyBtn(char, extraClass = "") {
  return `<button class="key ${extraClass}" onclick="pressKey('${char}')">${char}</button>`;
}

function keyBtnWithSub(char) {
  const sub = keyMap[char]?.shift || '';
  const display = isShift && sub ? sub : char;

  const subTag = (!isShift && sub) ? `<div class="key-sub">${sub}</div>` : '';
  return `
    <button class="key" onclick="pressKey('${display}')">
      ${display}
      ${subTag}
    </button>
  `;
}

function renderNumberPad() {
    const keyboard = document.getElementById("keyboardContainer");
    keyboard.innerHTML = `
      <div class="keyboard-row numPad first-num">
        ${[1, 2, 3].map(k => numberBtn(k)).join("")}
      </div>
      <div class="keyboard-row numPad second-num">
        ${[4, 5, 6].map(k => numberBtn(k)).join("")}
      </div>
      <div class="keyboard-row numPad third-num">
        ${[7, 8, 9].map(k => numberBtn(k)).join("")}
      </div>
      <div class="keyboard-row">
        <button class="key key-func zeros" onclick="pressNumber('010')">010</button>
        ${numberBtn(0)}
        <button class="key key-func backback" onclick="backspace()">
            <img class="back-icon" src="/hci-gs25-delivery-kiosk/assets/images/button_backSpace.png">
        </button>
      </div>
    `;
}

window.addEventListener('DOMContentLoaded', () => {
    initInputFocusEvents();
});

function numberBtn(num) {
    return `<button class="numBtn" onclick="pressNumber('${num}')">${num}</button>`;
}
  
function pressNumber(num) {
    if (!activeInput) return;
    inputBuffer.push(num);
    activeInput.value = inputBuffer.join("");
}

function specialKey(label) {
    let extraClass = "";
    if (label === "동") extraClass = "dong";
    else if (label === "호") extraClass = "ho";
  
    return `<button class="key key-special ${extraClass}" onclick="insertSpecial('${label}')">${label}</button>`;
}

function pressKey(char) {
    if (!activeInput || activeInput.tagName !== 'INPUT') return;
  
    inputBuffer.push(char);
    const value = isHangul ? Hangul.assemble(inputBuffer) : inputBuffer.join("");
    activeInput.value = value;
  
    if (value.trim()) {
      activeInput.classList.add("input-filled");
    } else {
      activeInput.classList.remove("input-filled");
    }
}

function insertSpecial(word) {
  if (!activeInput) return;
  for (const c of word) inputBuffer.push(c);
  activeInput.value = Hangul.assemble(inputBuffer);
}

function backspace() {
  if (!activeInput) return;
  inputBuffer.pop();
  activeInput.value = isHangul ? Hangul.assemble(inputBuffer) : inputBuffer.join("");
}

function insertSpace() {
  if (!activeInput) return;
  inputBuffer.push(" ");
  activeInput.value = isHangul ? Hangul.assemble(inputBuffer) : inputBuffer.join("");
}

function toggleShift() {
  isShift = !isShift;
  renderKeyboard();
}

function toggleLanguage() {
  isHangul = !isHangul;
  inputBuffer = [];
  if (activeInput) activeInput.value = '';
  renderKeyboard();
}

window.setActiveInput = setActiveInput;
window.renderKeyboard = renderKeyboard;
window.pressKey = pressKey;

window.addEventListener("DOMContentLoaded", () => {
    initInputFocusEvents();
});