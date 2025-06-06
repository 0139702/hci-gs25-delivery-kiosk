window.addEventListener("DOMContentLoaded", () => {
    restoreAddressFields();
    showKeyboard();

    const selectedAddress = localStorage.getItem("selectedAddress");
    const targetInputId = localStorage.getItem("targetInputId");
  
    if (selectedAddress && targetInputId) {
      const targetInput = document.getElementById(targetInputId);
      if (targetInput) {
        targetInput.value = selectedAddress;
        targetInput.classList.add("input-filled");
      }
      // 사용 후 제거 (중복 방지)
      localStorage.removeItem("selectedAddress");
      localStorage.removeItem("targetInputId");
    }
});
  
function restoreAddressFields() {
    const selectedAddress = sessionStorage.getItem("selectedAddress");
    const addressTarget = sessionStorage.getItem("addressTarget");

    // 주소 필드 복원
    if (selectedAddress && addressTarget) {
        const targetInput = document.getElementById(addressTarget);
        if (targetInput) {
        targetInput.value = selectedAddress;

        if (selectedAddress.trim()) {
            targetInput.classList.add("input-filled");
            targetInput.classList.remove("input-focus");
        }

        // 값 반영된 후에 제거
        sessionStorage.removeItem("selectedAddress");
        sessionStorage.removeItem("addressTarget");
        }
    }

    // 나머지 필드 복원
    const fieldsToRestore = [
        "senderName", "senderPhone", "receiverName", "receiverPhone",
        "senderDetailAddress", "senderMainAddress",
        "receiverDetailAddress", "receiverMainAddress"
    ];

    fieldsToRestore.forEach(id => {
        const saved = sessionStorage.getItem(id);
        const el = document.getElementById(id);
        if (saved && el) {
            el.value = saved;

            // 스타일 적용
            if (saved.trim()) {
                el.classList.add("input-filled");
                el.classList.remove("input-focus");
            }
        }
    });
}
  
function showKeyboard() {
    document.getElementById("keyboardContainer").style.display = "block";
    if (keyboard) {
        keyboard.style.display = "block";
        renderKeyboard();
    }
}

// 주소 검색 페이지로 이동할 때 현재 필드 저장
function goToSearchPage(inputId) {
    sessionStorage.setItem("addressTarget", inputId);

    const fieldsToSave = [
      "senderName", "senderPhone", "receiverName", "receiverPhone",
      "senderDetailAddress", "senderMainAddress",
      "receiverDetailAddress", "receiverMainAddress"
    ];
    fieldsToSave.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        sessionStorage.setItem(id, el.value);
      }
    });

    window.location.href = `/hci-gs25-delivery-kiosk/search.html?target=${inputId}`;
    // window.location.href = "/hci-gs25-delivery-kiosk/search.html";
}

// function confirmSelection() {
//     const selectedAddress = document.getElementById("selectedAddress").textContent;
//     const urlParams = new URLSearchParams(window.location.search);
//     const targetInputId = urlParams.get("target");
  
//     if (selectedAddress && targetInputId) {
//       localStorage.setItem("selectedAddress", selectedAddress);
//       localStorage.setItem("targetInputId", targetInputId);
//       window.location.href = "/hci-gs25-delivery-kiosk/index.html"; // 또는 sender.html 등 원래 페이지
//     }
// }

window.goToSearchPage = goToSearchPage;