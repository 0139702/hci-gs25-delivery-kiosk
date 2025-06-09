let currentPage = 1;
let totalPages = 1;
let jusoList = [];
// let activeInput = null;
let chosenAddress = null;
let pageNumberEl;
let pageTotalEl;

function searchAddress() {
  resetErrorUI();

  const keyword = document.getElementById("keyword").value.trim();
  if (!keyword) {
    alert("검색어를 입력하세요.");
    return;
  }

  const noResultBox = document.getElementById("noResultInfo");
  if (noResultBox) noResultBox.classList.remove("show");

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
      jusoList = response.results.juso || [];
      totalPages = Math.ceil(jusoList.length / 6);
      currentPage = 1;

      if (jusoList.length === 0) {
        showNoResultUI(keyword);
        return;
      }
    
      showPage(currentPage);
    }, 
    error: function () {
      alert("주소 검색 실패");
    }
  });
}

function showNoResultUI(keyword) {
  document.getElementById("results").innerHTML = `
    <div class="no-result-message">
      조회된 주소가 없습니다.<br>검색하려는 주소를 정확하게 입력해 주세요.
    </div>
  `;
  document.getElementById("page-info").innerText = "0/0";
  document.getElementById("keyboardContainer").style.display = "none";
  document.getElementById("keyword").classList.add("input-error");

  const keywordBox = document.getElementById("enteredKeyword");
  if (keywordBox) {
    keywordBox.style.display = "block";
    keywordBox.classList.add("error");
    keywordBox.innerHTML = `<strong style="color:#CC0000">${keyword}</strong> 에 대한 주소를 찾을 수 없습니다.`;
  }

  const noResultInfo = document.getElementById("noResultInfo");
  if (noResultInfo) {
    noResultInfo.style.display = "flex";
  }
}

function resetErrorUI() {
  const keywordBox = document.getElementById("enteredKeyword");
  if (keywordBox) {
    keywordBox.style.display = "none";
    keywordBox.innerHTML = "";
    keywordBox.classList.remove("error");
  }

  const noResultInfo = document.getElementById("noResultInfo");
  if (noResultInfo) noResultInfo.style.display = "none";

  const resultMessage = document.querySelector(".no-result-message");
  if (resultMessage) resultMessage.remove();

  const keywordInput = document.getElementById("keyword");
  if (keywordInput) keywordInput.classList.remove("input-error");
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
  // document.getElementById("keyboardContainer").style.display = "block";
  const container = document.getElementById("keyboardContainer");
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
  const keywordBox = document.getElementById("enteredKeyword");
  if (keywordBox) {
    keywordBox.style.display = "none";
    keywordBox.innerHTML = "";
    keywordBox.classList.remove("error");
  }

  const noResultInfo = document.getElementById("noResultInfo");
  if (noResultInfo) noResultInfo.style.display = "none";

  const resultMessage = document.querySelector(".no-result-message");
  if (resultMessage) resultMessage.remove();

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
    
      const selectedEl = document.querySelector("#selectedAddress");
      if (selectedEl) selectedEl.textContent = chosenAddress;
    
      updateConfirmButtonState();
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

  const urlParams = new URLSearchParams(window.location.search);
  const targetInputId = urlParams.get("target");

  if (targetInputId) {
    sessionStorage.setItem("addressTarget", targetInputId);
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