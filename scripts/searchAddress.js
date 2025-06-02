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
  const container = document.getElementById('addressResultContainer');
  if (container) container.style.display = "block";
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
  window.location.href = "/hci-gs25-delivery-kiosk/index.html";
}

function backToPrev() {
  window.location.href = "/hci-gs25-delivery-kiosk/index.html";
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