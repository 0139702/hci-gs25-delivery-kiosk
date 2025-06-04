// addressSearch.js
async function searchAddress() {
    const keyword = document.getElementById("keyword").value;
    const resultDiv = document.getElementById("result");
  
    if (!keyword.trim()) {
      alert("주소를 입력해 주세요.");
      return;
    }
  
    // const confmKey = "발급받은_본인_API_KEY"; // 여기에 네 키 넣기
    const apiUrl = `https://business.juso.go.kr/addrlink/addrLinkApi.do?confmKey=${confmKey}&currentPage=1&countPerPage=10&keyword=${encodeURIComponent(keyword)}&resultType=json`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      const jusoList = data.results.juso;
  
      if (jusoList.length === 0) {
        resultDiv.innerHTML = "<p>검색 결과가 없습니다.</p>";
        return;
      }
  
      // 결과 표시
      resultDiv.innerHTML = jusoList.map(juso => `
        <div class="address-result">
          <p><strong>${juso.roadAddr}</strong></p>
          <p>지번: ${juso.jibunAddr}</p>
          <p>우편번호: ${juso.zipNo}</p>
        </div>
      `).join("");
  
    } catch (error) {
      console.error("주소 검색 실패:", error);
      resultDiv.innerHTML = "<p>주소 검색 중 오류가 발생했습니다.</p>";
    }
  }
  