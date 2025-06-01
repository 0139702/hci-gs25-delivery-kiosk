// let currentPage = 1;
// let totalPages = 1;
// let jusoList = [];
// let activeInput = null;
// let inputBuffer = [];

// function setActiveInput(element) {
//   activeInput = element;
//   inputBuffer = Hangul.disassemble(element.value || '');
//   renderHangulKeyboard();
// }

// function renderHangulKeyboard() {
//   const keyboard = document.getElementById("keyboardContainer");
//   keyboard.innerHTML = `
//     <div class="keyboard-row">
//       ${["ㅂ", "ㅈ", "ㄷ", "ㄱ", "ㅅ", "ㅛ", "ㅕ", "ㅑ", "ㅐ", "ㅔ"].map(k => keyBtn(k)).join('')}
//     </div>
//     <div class="keyboard-row">
//       ${["ㅁ", "ㄴ", "ㅇ", "ㄹ", "ㅎ", "ㅗ", "ㅓ", "ㅏ", "ㅣ"].map(k => keyBtn(k)).join('')}
//     </div>
//     <div class="keyboard-row">
//       ${["ㅋ", "ㅌ", "ㅊ", "ㅍ", "ㅠ", "ㅜ", "ㅡ"].map(k => keyBtn(k)).join('')}
//       <button class="key" onclick="backspace()">←</button>
//       <button class="key" onclick="insertSpace()">띄움</button>
//     </div>
//   `;
// }

// function keyBtn(char) {
//   return `<button class="key" onclick="pressKey('${char}')">${char}</button>`;
// }

// function pressKey(jamo) {
//   if (!activeInput) return;
//   inputBuffer.push(jamo);
//   activeInput.value = isHangul.assemble(inputBuffer);
// }

// function backspace() {
//   if (!activeInput) return;
//   inputBuffer.pop();
//   activeInput.value = Hangul.assemble(inputBuffer);
// }

// function insertSpace() {
//   if (!activeInput) return;
//   inputBuffer.push(" ");
//   activeInput.value = Hangul.assemble(inputBuffer);
// }

// function searchAddress() {
//   const keyword = document.getElementById("keyword").value.trim();
//   if (!keyword) {
//     alert("검색어를 입력하세요.");
//     return;
//   }

//   $.ajax({
//     url: "https://business.juso.go.kr/addrlink/addrLinkApiJsonp.do",
//     type: "post",
//     data: {
//       keyword: keyword,
//       confmKey: "devU01TX0FVVEgyMDI1MDUyNzE2NTkwMjExNTc5MDQ=",
//       currentPage: 1,
//       countPerPage: 1600,
//       resultType: "json"
//     },
//     dataType: "jsonp",
//     success: function (response) {
//       jusoList = response.results.juso;
//       totalPages = Math.ceil(jusoList.length / 7);
//       currentPage = 1;
//       showPage(currentPage);
//     },
//     error: function () {
//       alert("주소 검색 실패");
//     }
//   });
// }

// const pageNumberEl = document.querySelector(".page-number");
// const pageTotalEl = document.querySelector(".page-total");

// pageNumberEl.textContent = 1;
// pageTotalEl.textContent = 1;
// pageNumberEl.classList.remove("active");

// function showPage(pageNum) {
//   const resultsDiv = document.getElementById("results");
//   resultsDiv.innerHTML = "";

//   const start = (pageNum - 1) * 7;
//   const end = Math.min(start + 7, jusoList.length);
//   const slice = jusoList.slice(start, end);

  // const pageInfo = document.getElementById("page-info");
  // pageInfo.innerHTML = `
  //   <span class="page-number active">${pageNum}</span>
  //   <span class="spliter">/</span>
  //   <span class="page-total">${totalPages}</span>
  // `;
  
  // const pageNumberEl = document.querySelector(".page-number");
  // const pageTotalEl = document.querySelector(".page-total");

  // pageNumberEl.textContent = pageNum;
  // pageTotalEl.textContent = totalPages;

  // pageNumberEl.classList.remove("active");

//   pageNumberEl.textContent = pageNum;
//   pageTotalEl.textContent = totalPages;
//   pageNumberEl.classList.add("active");

//   slice.forEach(item => {
//     const box = document.createElement("div");
//     box.className = "address-item";
//     box.innerHTML = `
//       <strong>도로명 주소:</strong> ${item.roadAddr}<br>
//       <strong>지번 주소:</strong> ${item.jibunAddr}<br>
//       <strong>우편번호:</strong> ${item.zipNo}<br>
//       <button onclick="selectAddress('${item.roadAddr.replace(/'/g, "\\'")}')">선택</button>
//     `;
//     resultsDiv.appendChild(box);
//   });

//   document.getElementById("page-info").innerText = `${pageNum}/${totalPages}`;
// }

// function nextPage() {
//   if (currentPage < totalPages) {
//     currentPage++;
//     showPage(currentPage);
//   }
// }

// function prevPage() {
//   if (currentPage > 1) {
//     currentPage--;
//     showPage(currentPage);
//   }
// }

// function selectAddress(addr) {
//   localStorage.setItem("selectedAddress", addr);
//   window.location.href = "sender.html";
// }

let currentPage = 1;
let totalPages = 1;
let jusoList = [];
// let activeInput = null;
let chosenAddress = null;
let pageNumberEl;
let pageTotalEl;

function searchAddress() {
  const keyword = document.getElementById("keyword").value.trim();
  if (!keyword) {
    alert("검색어를 입력하세요.");
    return;
  }

  document.getElementById("results").innerHTML = "";
  document.getElementById("page-info").innerText = "";
  chosenAddress = null;

  document.getElementById("keyboardContainer").style.display = "none";
  document.getElementById("pagination").style.display = "flex";

  $.ajax({
    url: "https://business.juso.go.kr/addrlink/addrLinkApiJsonp.do",
    type: "post",
    data: {
      keyword: keyword,
      confmKey: "devU01TX0FVVEgyMDI1MDUyNzE2NTkwMjExNTc5MDQ=",
      currentPage: 1,
      countPerPage: 1600,
      resultType: "json"
    },
    dataType: "jsonp",
    success: function (response) {
      jusoList = response.results.juso;
      totalPages = Math.ceil(jusoList.length / 6);
      currentPage = 1;
      showPage(currentPage);
    },
    error: function () {
      alert("주소 검색 실패");
    }
  });
}

function setActiveInput(element) {
  activeInput = element;
  inputBuffer = Hangul.disassemble(element.value || '');

  // 키보드 다시 보여줌
  document.getElementById("keyboardContainer").style.display = "block";
  document.getElementById("pagination").style.display = "none";
  // 키보드 렌더링
  renderKeyboard();
}

function initializeSearchPage() {
  document.getElementById("keyboardContainer").style.display = "block";
  document.getElementById("pagination").style.display = "none";

  pageNumberEl = document.querySelector(".page-number");
  pageTotalEl = document.querySelector(".page-total");

  if (pageNumberEl && pageTotalEl) {
    pageNumberEl.textContent = 1;
    pageTotalEl.textContent = 1;
    pageNumberEl.classList.remove("active");
  }
}

document.addEventListener("DOMContentLoaded", initializeSearchPage);

function showPage(pageNum) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  const start = (pageNum - 1) * 6;
  const end = Math.min(start + 6, jusoList.length);
  const slice = jusoList.slice(start, end);

  pageNumberEl.textContent = pageNum;
  pageTotalEl.textContent = totalPages;
  pageNumberEl.classList.add("active");

  slice.forEach(item => {
    const box = document.createElement("div");
    box.className = "address-item";
    box.dataset.address = item.roadAddr;
  
    box.innerHTML = `
      <div class="address-header">
        <span class="label road-label">도로명 주소</span>
        <span class="value road-value">${item.roadAddr}</span>
        <span class="label zip-label">우편번호</span>
      </div>
      <div class="address-sub">
        <span class="label">지번 주소</span>
        <span class="value">${item.jibunAddr}</span>
        <span class="value zip-value">${item.zipNo}</span>
      </div>
    `;

    box.addEventListener("click", () => {
      document.querySelectorAll(".address-item").forEach(el => el.classList.remove("selected"));
      box.classList.add("selected");

      chosenAddress = item.roadAddr;
    });

    resultsDiv.appendChild(box);
  });

  document.getElementById("page-info").innerText = `${pageNum}/${totalPages}`;
}

function confirmSelection() {
  if (!chosenAddress) {
    alert("주소를 선택해 주세요.");
    return;
  }

  sessionStorage.setItem("selectedAddress", chosenAddress);
  window.location.href = "index.html";
}

function backToPrev() {
  window.location.href = "index.html";
}

function nextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    showPage(currentPage);
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    showPage(currentPage);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const senderMain = document.getElementById("senderMainAddress");
  if (senderMain && sessionStorage.getItem("savedSenderMainAddress")) {
    senderMain.value = sessionStorage.getItem("savedSenderMainAddress");
  }
});