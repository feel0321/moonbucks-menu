/*
2. 요구사항
- TODO localStorage Read / Write
ㅇ localStorage에 데이터를 저장
  ㅇ 메뉴를 추가할 때
  ㅇ 메뉴를 수정할 때
  ㅇ 메뉴를 삭제할 때
ㅇ localStorage에 저장된 데이터를 읽어서 새로고침해도 데이터가 남아있게 한다.

- TODO 카테고리별 메뉴판 관리
ㅇ 에스프레소 메뉴판 관리
ㅇ 프라푸치노 메뉴판 관리
ㅇ 블렌디드 메뉴판 관리
ㅇ 티바나 메뉴판 관리
ㅇ 디저트  메뉴판 관리

- TODO 페이지 접근 시 최초 데이터 READ / Rendering
ㅇ 페이지에 최초로 로딩될 때 localStorage의 에스프레소 메뉴 데이터를 읽음
ㅇ 읽어온 에스프레소 메뉴 페이지를 그림

- TODO 품절 상태 관리
ㅇ 품절 버튼 추가
ㅇ 품절 버튼을 클릭하면 localStorage에 상태값이 저장된다
ㅇ 품절은 class에 sold-out을 추가
*/
import { $ } from "./utils/dom.js";
import store from "./store/index.js";

function App() {
  // 상태 (변할 수 있는 데이터): 메뉴명
  // 사용자의 액션에 따라 데이터가 바뀌고, 그에 따라 동적인 화면을 보여주려면 상태가 중요하다
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = "espresso";
  this.init = () => {
    if (store.getLocalStorage()) {
      this.menu = JSON.parse(store.getLocalStorage());
    }
    render();
    initEventListeners();
  };

  // template 그리기
  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((menuItem, index) => {
        return `<li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
      <span class="${menuItem.soldOut && "sold-out"} w-100 pl-2 menu-name">${
          menuItem.name
        }</span>
      <button
    type="button"
    class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
  >
    품절
  </button>
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

    $("#menu-list").innerHTML = template;
    updateMenuCount();
  };

  // li 개수 카운트
  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  // 메뉴 추가
  const addMenuName = () => {
    if (!$("#menu-name").value.trim()) {
      alert("값을 입력해주세요");
      return;
    }
    const menuName = $("#menu-name").value;
    // 상태 menu에 추가
    this.menu[this.currentCategory].push({ name: menuName });
    // storage에도 추가를 반영
    store.setLocalStorage(this.menu);
    render();
    // input값 초기화
    $("#menu-name").value = "";
  };

  // 메뉴 수정
  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    // 상태 menu에 수정
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    // storage에 수정 반영
    store.setLocalStorage(this.menu);
    render();
  };

  // 메뉴 삭제
  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      render();
    }
  };

  const soldOutMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  };

  const initEventListeners = () => {
    $("#menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
      }
    });

    // form 태그 자동 전송 막기
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    // 확인 버튼으로 메뉴 추가
    $("#menu-submit-button").addEventListener("click", addMenuName);

    // 메뉴 이름을 입력받기
    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        addMenuName();
      }
    });

    $("nav").addEventListener("click", (e) => {
      const isCategoryButton =
        e.target.classList.contains("cafe-category-name");
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
        render();
      }
    });
  };
}
// App();
const app = new App();
app.init();
