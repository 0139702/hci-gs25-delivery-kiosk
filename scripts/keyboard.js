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
  activeInput = element;
  inputBuffer = Hangul.disassemble(element.value || '');
  renderKeyboard();

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

// ✅ 한글 키보드 렌더링
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
    <div class="keyboard-row">
      ${row2.map(k => keyBtnWithSub(k)).join("")}
      ${specialKey("동")}
    </div>
    <div class="keyboard-row">
      <button class="key key-func" onclick="toggleShift()">Shift</button>
      ${row3.map(k => keyBtnWithSub(k)).join("")}
      <button class="key key-func" onclick="backspace()">←</button>
      ${specialKey("호")}
    </div>
    <div class="keyboard-row bottom-row">
      <button class="key key-func" onclick="toggleLanguage()">한/영</button>
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
      <div class="keyboard-row">
        ${[1, 2, 3].map(k => numberBtn(k)).join("")}
      </div>
      <div class="keyboard-row">
        ${[4, 5, 6].map(k => numberBtn(k)).join("")}
      </div>
      <div class="keyboard-row">
        ${[7, 8, 9].map(k => numberBtn(k)).join("")}
      </div>
      <div class="keyboard-row">
        <button onclick="pressNumber('010')">010</button>
        ${numberBtn(0)}
        <button onclick="backspace()">←</button>
      </div>
    `;
}

function numberBtn(num) {
    return `<button onclick="pressNumber('${num}')">${num}</button>`;
}
  
function pressNumber(num) {
    if (!activeInput) return;
    inputBuffer.push(num);
    activeInput.value = inputBuffer.join("");
}

function specialKey(label) {
  return `<button class="key key-special" onclick="insertSpecial('${label}')">${label}</button>`;
}

function pressKey(char) {
  if (!activeInput) return;
  inputBuffer.push(char);
  const value = isHangul ? Hangul.assemble(inputBuffer) : inputBuffer.join("");
  activeInput.value = value;
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