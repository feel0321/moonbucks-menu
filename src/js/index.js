/*
1. 요구사항 구현을 위한 전략
TODO 메뉴 추가
ㅇ 메뉴의 이름을 입력 받고 엔터키 입력으로 메뉴를 추가
메뉴의 이름을 입력 받고 확인 버튼을 클릭하면 메뉴를 추가
ㅇ 추가되는 메뉴의 아래 마크업은 <ul id="espresso-menu-list" class="mt-3 pl-0"></ul> 안에 삽입해야 한다
ㅇ 총 메뉴 갯수를 count하여 상단에 노출
ㅇ 메뉴가 추가되고 나면, input은 빈 값으로 초기화
ㅇ 사용자 입력값이 빈 값이면 추가되지 않음

TODO 메뉴 수정
ㅇ 등록된 메뉴의 수정 버튼을 클릭하면, 메뉴 이름을 수정하는 모달창 노출
ㅇ 모달창에서 신규메뉴명을 입력받고, 확인버튼으로 메뉴를 수정

TODO 메뉴 삭제
ㅇ 등록된 메뉴의 삭제 버튼을 클릭하면, confirm 인터페이스로 메뉴 삭제 모달창 노출
ㅇ 모달창에서 확인 버튼을 클릭하면 메뉴가 삭제
ㅇ 총 메뉴 갯수를 count하여 상단에 노출
*/

const $ = (selector) => document.querySelector(selector);

function App() {
  // li 개수 카운트
  const updateMenuCount = () => {
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  // 메뉴 추가
  const addMenuName = () => {
    if (!$("#espresso-menu-name").value.trim()) {
      alert("값을 입력해주세요");
      return;
    }
    const espressoMenuName = $("#espresso-menu-name").value;
    const menuItemTemplate = (espressoMenuName) => {
      return `<li class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
        >
          수정
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
        >
          삭제
        </button>
      </li>`;
    };
    $("#espresso-menu-list").insertAdjacentHTML(
      "beforeend",
      menuItemTemplate(espressoMenuName)
    );
    updateMenuCount();
    // input값 초기화
    $("#espresso-menu-name").value = "";
  };

  // 메뉴 수정
  const updateMenuName = (e) => {
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    $menuName.innerText = updatedMenuName;
  };

  // 메뉴 삭제
  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      e.target.closest("li").remove();
      updateMenuCount();
    }
  };

  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
    }

    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
    }
  });

  // form 태그 자동 전송 막기
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  // 확인 버튼으로 메뉴 추가
  $("#espresso-menu-submit-button").addEventListener("click", addMenuName);

  // 메뉴 이름을 입력받기
  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addMenuName();
    }
  });
}
App();
