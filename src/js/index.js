/*
3. 요구사항
 ㅇ 링크에 있는 웹 서버 저장소를 clone하여 로컬에서 웹 서버를 실행시킨다.

 - 서버 요청 부분
 ㅇ 웹 서버를 띄운다
 ㅇ 메뉴 생성하기 (서버에 새로운 메뉴명을 추가하도록 요청)
 ㅇ 카테고리별 메뉴 불러오기 (서버에 저장된 메뉴를 카테고리별로 요청)
 ㅇ 메뉴 이름 수정하기 (서버에 저장된 메뉴의 이름을 수정)
 ㅇ 메뉴 품절 처리하기 (서버에 저장된 메뉴를 품절 / 품절 취소 처리)
 메뉴 삭제하기 (서버에 저장된 메뉴를 삭제)

 - 리팩터링 부분
 ㅇ localStorage에 저장하는 로직은 지운다.
 ㅇ fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.
 API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 alert으로 예외처리를 진행한다.
 ㅇ 중복되는 메뉴는 추가할 수 없다.
*/
import { $ } from "./utils/dom.js";
import store from "./store/index.js";
import MenuApi from "./api/index.js";

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
  this.init = async () => {
    render();
    initEventListeners();
  };

  // template 그리기
  const render = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    const template = this.menu[this.currentCategory]
      .map((menuItem) => {
        return `<li data-menu-id="${
          menuItem.id
        }" class="menu-list-item d-flex items-center py-2">
      <span class="${menuItem.isSoldOut && "sold-out"} w-100 pl-2 menu-name">${
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
  const addMenuName = async () => {
    if (!$("#menu-name").value.trim()) {
      alert("값을 입력해주세요");
      return;
    }

    const duplicatedItem = this.menu[this.currentCategory].find(
      (menuItem) => menuItem.name === $("#menu-name").value
    );
    if (duplicatedItem) {
      alert("이미 등록된 메뉴입니다. 다시 입력해주세요.");
      $("#menu-name").value = "";
      return;
    }

    const menuName = $("#menu-name").value;
    await MenuApi.createMenu(this.currentCategory, menuName);
    render();
    $("#menu-name").value = "";
  };

  // 메뉴 수정
  const updateMenuName = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    await MenuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);
    render();
  };

  // 메뉴 삭제
  const removeMenuName = async (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      await MenuApi.deleteMenu(this.currentCategory, menuId);
      this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
        this.currentCategory
      );
      render();
    }
  };

  const soldOutMenu = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
    render();
  };

  const changeCategory = (e) => {
    const isCategoryButton = e.target.classList.contains("cafe-category-name");
    if (isCategoryButton) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
      render();
    }
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

    $("nav").addEventListener("click", changeCategory);
  };
}
// App();
const app = new App();
app.init();
