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
    //error dectection
    // console.log("activeInput ID:", element.id);
    // console.log("classList:", element.classList);
    // console.log("Contains 'numeric'?", element.classList.contains('numeric'));
    // console.log("classList (array):", [...element.classList]);

    const keyboard = document.getElementById("keyboardContainer");
    if (keyboard) {
      keyboard.style.display = "block";
    } else {
      console.warn("keyboardContainer를 찾지 못함");
    }

    if (activeInput) {
      activeInput.classList.remove("input-focus");
    }
  
    activeInput = element;
    inputBuffer = Hangul.disassemble(element.value || '');
    element.classList.add("input-focus");
  
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
    console.log("한글 키패드 렌더링");
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
        ${specialKey("동")}
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
        ${specialKey("호")}
    </div>
    <div class="keyboard-row bottom-row">
        <button class="key key-func lang" onclick="toggleLanguage()">한/영</button>
        <button class="key key-space" onclick="insertSpace()">띄움</button>
    </div>
    `;
}

function renderNumberPad() {
    console.log("숫자 키패드 렌더링");
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

function initInputFocusEvents() {
    const inputs = document.querySelectorAll("input[type='text']");
    inputs.forEach(input => {
        input.addEventListener("click", () => setActiveInput(input));
        input.addEventListener("input", () => {
          updateConfirmButtonState();
        });
      });
}

function renderEnglishKeyboard() {
  console.log("영어 키패드 렌더링");
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
      <button class="key key-func shift" onclick="toggleShift()">
            <img class="shift-icon" src="/hci-gs25-delivery-kiosk/assets/images/buttons_shift.png">
            Shift
        </button>
      ${row3.map(k => keyBtn(k)).join("")}
      <button class="key key-func back" onclick="backspace()">
            <img class="back-icon" src="/hci-gs25-delivery-kiosk/assets/images/button_backSpace.png">
        </button>
    </div>
    <div class="keyboard-row bottom-row">
      <button class="key key-func lang" onclick="toggleLanguage()">한/영</button>
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

function numberBtn(num) {
    return `<button class="numBtn" onclick="pressNumber('${num}')">${num}</button>`;
}
  
function pressNumber(num) {
    if (!activeInput) return;
    // inputBuffer.push(num);
    // const value = inputBuffer.join("");
    // activeInput.value = inputBuffer.join("");
    // 숫자만 추출 (하이픈 제외)
    let raw = inputBuffer.filter(c => /\d/.test(c)).join("");

    // 11자리 이상이면 입력 안 받음
    if (raw.length >= 11) return;

    raw += num;

    // 하이픈 형식 적용
    let formatted = raw;
    if (raw.length <= 3) {
        formatted = raw;
    } else if (raw.length <= 7) {
        formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
    } else {
        formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7)}`;
    }

    // inputBuffer 갱신 (하이픈 포함)
    inputBuffer = formatted.split("");
    activeInput.value = formatted;

    if (formatted.trim()) {
        activeInput.classList.add("input-filled");
        activeInput.classList.remove("input-focus");
    } else {
        activeInput.classList.remove("input-filled");
        activeInput.classList.add("input-focus");
    }

    activeInput.dispatchEvent(new Event("input"));

    // 11자리 입력 끝나면 다음 input으로 자동 포커스 이동
    // if (raw.length === 11) {
    //     const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
    //     const currentIndex = inputs.indexOf(activeInput);
    //     if (currentIndex >= 0 && currentIndex < inputs.length - 1) {
    //         inputs[currentIndex + 1].focus();
    //         setActiveInput(inputs[currentIndex + 1]);
    //     }
    // }
}

function specialKey(originalLabel) {
    let displayLabel = originalLabel;
    let inputValue = originalLabel;
    let extraClass = "";

    const isSearchPage = window.location.pathname.includes("/hci-gs25-delivery-kiosk/search.html");

    if (originalLabel === "동") {
        if (isSearchPage) {
            displayLabel = "길";
            inputValue = "길";
        }
        extraClass = "dong";
    } else if (originalLabel === "호") {
        if (isSearchPage) {
            displayLabel = "로";
            inputValue = "로";
        }
        extraClass = "ho";
    }

    return `<button class="key key-special ${extraClass}" onclick="pressKey('${inputValue}')">${displayLabel}</button>`;
}

function pressKey(char) {
    if (!activeInput || activeInput.tagName !== 'INPUT') return;
    
    inputBuffer.push(char);
    const value = isHangul ? Hangul.assemble(inputBuffer) : inputBuffer.join("");
    activeInput.value = value;
    
    if (value.trim()) {
        activeInput.classList.add("input-filled");
        activeInput.classList.remove("input-focus");
    } else {
        activeInput.classList.remove("input-filled");
        activeInput.classList.add("input-focus");
    }
    
    activeInput.dispatchEvent(new Event("input"));
}

function insertSpecial(word) {
  if (!activeInput) return;
  for (const c of word) inputBuffer.push(c);
  activeInput.value = Hangul.assemble(inputBuffer);

  if (value.trim()) {
    activeInput.classList.add("input-filled");
    activeInput.classList.remove("input-focus");
  } else {
    activeInput.classList.remove("input-filled");
    activeInput.classList.add("input-focus");
  }
}

function backspace() {
    if (!activeInput) return;
    inputBuffer.pop();
    const value = isHangul ? Hangul.assemble(inputBuffer) : inputBuffer.join("");
    activeInput.value = value;
  
    if (value.trim()) {
      activeInput.classList.add("input-filled");
      activeInput.classList.remove("input-focus");
    } else {
      activeInput.classList.remove("input-filled");
      activeInput.classList.add("input-focus");
    }
  
    activeInput.dispatchEvent(new Event("input"));
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

window.addEventListener("DOMContentLoaded", () => {
    initInputFocusEvents();
});

window.setActiveInput = setActiveInput;
window.renderKeyboard = renderKeyboard;
window.pressKey = pressKey;