window.addEventListener("DOMContentLoaded", () => {
    restoreAddressFields();
    showKeyboard();
});
  
function restoreAddressFields() {
    const selectedAddress = sessionStorage.getItem("selectedAddress");
    const addressTarget = sessionStorage.getItem("addressTarget");

    // 주소 필드 복원
    if (selectedAddress && addressTarget) {
        const targetInput = document.getElementById(addressTarget);
        if (targetInput) {
        targetInput.value = selectedAddress;

        // 값 반영된 후에 제거
        sessionStorage.removeItem("selectedAddress");
        sessionStorage.removeItem("addressTarget");
        }
    }

    // 나머지 필드 복원
    const fieldsToRestore = [
        "senderName", "senderPhone", "receiverName", "receiverPhone",
        "detailAddress", "senderMainAddress", "receiverMainAddress"
    ];
    fieldsToRestore.forEach(id => {
        const saved = sessionStorage.getItem(id);
        const el = document.getElementById(id);
        if (saved && el) el.value = saved;
    });
}
  
function showKeyboard() {
    document.getElementById("keyboardContainer").style.display = "block";
    renderKeyboard();
}

// 주소 검색 페이지로 이동할 때 현재 필드 저장
function goToSearchPage(targetFieldId) {
    sessionStorage.setItem("addressTarget", targetFieldId);
  
    const fieldsToSave = [
      "senderName", "senderPhone", "receiverName", "receiverPhone",
      "detailAddress", "senderMainAddress", "receiverMainAddress"
    ];
    fieldsToSave.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        sessionStorage.setItem(id, el.value);
      }
    });
  
    window.location.href = "/pages/search.html";
}