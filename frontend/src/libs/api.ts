export async function getTarotMasters() {
    // 실제 API 호출을 시뮬레이션하기 위해 setTimeout 사용
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: "타로 마스터 1" },
          { id: 2, name: "타로 마스터 2" },
          { id: 3, name: "타로 마스터 3" },
        ]);
      }, 1000); // 1초 지연
    });
  }