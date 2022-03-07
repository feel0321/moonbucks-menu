/*
2. 요구사항
- TODO localStorage Read / Write
ㅇ localStorage에 데이터를 저장
  ㅇ 메뉴를 추가할 때
  ㅇ 메뉴를 수정할 때
  ㅇ 메뉴를 삭제할 때
ㅇ localStorage에 저장된 데이터를 읽어서 새로고침해도 데이터가 남아있게 한다.

- TODO 카테고리별 메뉴판 관리
에스프레소 메뉴판 관리
프라푸치노 메뉴판 관리
블렌디드 메뉴판 관리
티바나 메뉴판 관리
디저트  메뉴판 관리

- TODO 페이지 접근 시 최초 데이터 READ / Rendering
페이지에 최초로 로딩될 때 localStorage의 에스프레소 메뉴 데이터를 읽음
읽어온 에스프레소 메뉴 페이지를 그림

- TODO 품절 상태 관리
품절 버튼 추가
품절 버튼을 클릭하면 localStorage에 상태값이 저장된다
품절은 class에 sold-out을 추가
*/

const $ = (selector) => document.querySelector(selector);

const store = {
  setLocalStorage(menu) {
    localStorage.setItem("menu", JSON.stringify(menu));
  },
  getLocalStorage() {
    return localStorage.getItem("menu");
  },
};

function App() {
  // 상태 (변할 수 있는 데이터): 메뉴명
  // 사용자의 액션에 따라 데이터가 바뀌고, 그에 따라 동적인 화면을 보여주려면 상태가 중요하다
  this.menu = [];
  this.init = () => {
    if (store.getLocalStorage().length > 1) {
      this.menu = JSON.parse(store.getLocalStorage());
    }
    render();
  };

  // template 그리기
  const render = () => {
    const template = this.menu
      .map((menuItem, index) => {
        return `<li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
      <span class="w-100 pl-2 menu-name">${menuItem.name}</span>
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
      })
      .join("");

    $("#espresso-menu-list").innerHTML = template;
    updateMenuCount();
  };

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
    // 상태 menu에 추가
    this.menu.push({ name: espressoMenuName });
    // storage에도 추가를 반영
    store.setLocalStorage(this.menu);
    render();
    // input값 초기화
    $("#espresso-menu-name").value = "";
  };

  // 메뉴 수정
  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    // 상태 menu에 수정
    this.menu[menuId].name = updatedMenuName;
    // storage에 수정 반영
    store.setLocalStorage(this.menu);
    $menuName.innerText = updatedMenuName;
  };

  // 메뉴 삭제
  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu.splice(menuId, 1);
      e.target.closest("li").remove();
      store.setLocalStorage(this.menu);
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
// App();
const app = new App();
app.init();
