function openHelp() {
    document.getElementById("helpPopup").style.display = "flex";
}
  
function closeHelp() {
    document.getElementById("helpPopup").style.display = "none";
}

// index.html buttons
function updateActionButtonForIndex() {
    const allInputs = document.querySelectorAll("input[required]");
    const allFilled = Array.from(allInputs).every(input => input.value.trim() !== "");
    const actionButton = document.getElementById("actionButton");
    const label = document.getElementById("actionLabel");

    if (!actionButton || !label) return;
  
    label.textContent = "입력 완료";
    actionButton.disabled = !allFilled;
}

// search.html buttons
  function updateActionButtonForSearch() {
    const selectedAddress = document.querySelector(".address-item.selected");
    const actionButton = document.getElementById("actionButton");
    const label = document.getElementById("actionLabel");

  label.textContent = "선택 완료";
  actionButton.disabled = !selectedAddress;
  actionButton.classList.toggle("active", !!selectedAddress);
}

window.addEventListener('DOMContentLoaded', () => {
    // const confirmBtn = document.querySelector('.next-btn span');
    // if (window.location.pathname.includes('/hci-gs25-delivery-kiosk/search.html')) {
    //     confirmBtn.textContent = '선택 완료';
    // } else {
    //     confirmBtn.textContent = '입력 완료';
    // }

    updateActionButtonForIndex(); // 초기 상태 체크

    document.querySelectorAll("input[required]").forEach(input => {
        input.addEventListener("input", updateActionButtonForIndex);
    });
});

function updateConfirmButtonState() {
    const btn = document.querySelector("#actionButton");
    const span = document.querySelector("#actionLabel");
  
    const isSearchPage = window.location.pathname.includes("/hci-gs25-delivery-kiosk/search.html");
  
    if (isSearchPage) {
      const selectedAddress = document.querySelector('#selectedAddress');
      const isSelected = selectedAddress && selectedAddress.textContent.trim() !== '';
      btn.disabled = !isSelected;
      btn.classList.toggle("active", isSelected);
      span.textContent = "선택 완료";
    } else {
      const inputs = document.querySelectorAll("input[type='text']");
      const allFilled = [...inputs].every(input => input.value.trim() !== '');
      btn.disabled = !allFilled;
      btn.classList.toggle("active", allFilled);
      span.textContent = "입력 완료";
    }
}

document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('input', updateConfirmButtonState);
});
  
  // 주소를 선택했을 때도 호출
function onAddressSelected(address) {
    document.querySelector('#selectedAddress').textContent = address;
    updateConfirmButtonState();
}

function handleActionButtonClick() {
    const isSearchPage = window.location.pathname.includes("/hci-gs25-delivery-kiosk/search.html");
  
    if (isSearchPage) {
      confirmSelection();
    } else {
      goToCompletePageIfValid();
    }
}

function goToCompletePageIfValid() {
    const requiredInputs = document.querySelectorAll("input[required]");
    const allFilled = Array.from(requiredInputs).every(input => input.value.trim() !== "");
  
    if (!allFilled) {
      alert("모든 항목을 입력해 주세요.");
      return;
    }

    window.location.href = "/hci-gs25-delivery-kiosk/complete.html";
}
  
window.onload = function () {
    const data = JSON.parse(sessionStorage.getItem("deliveryForm") || "{}");
    if (!data.senderName) return; // 아무 값 없으면 무시
  
    const content = `
  📦 GS25 편의점 택배 접수 정보
  
  [보내는 사람]
  이름: ${data.senderName}
  전화번호: ${data.senderPhone}
  주소: ${data.senderAddress}
  상세주소: ${data.senderDetail}
  
  [받는 사람]
  이름: ${data.receiverName}
  전화번호: ${data.receiverPhone}
  주소: ${data.receiverAddress}
  상세주소: ${data.receiverDetail}
  
  [접수 시간]
  ${data.selectedTime}
    `;
  
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `택배접수정보_${Date.now()}.txt`;
    link.click();
};