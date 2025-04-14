const recipes = JSON.parse(localStorage.getItem("recipes")) || [];

const recipeInformation = document.getElementById("recipe-information");
const pagination = document.getElementById("pagination");

const recipesPerPage = 6;
let currentPage = 1;

let filteredRecipes = [...recipes];

function renderRecipes(page) {
  const start = (page - 1) * recipesPerPage;
  const end = start + recipesPerPage;
  const currentRecipes = filteredRecipes.slice(start, end);

  const recipesDisplay = currentRecipes.map((value) => {
    return `
    
        <div class="recipe-child">
        <div style="width:40%; height: 100%; background-image: url('${value.img}');   background-position: center;
          background-repeat: no-repeat;
          background-size: cover;">
          <div class="box-community">
            <div class="community">
              <img src="../assets/icons/diversity_3.svg.png" alt="" />
              <p>Community Recipes</p>
            </div>
          </div>
          </div>
          <div class="recipe-content">
            <div class="titlke">
              <h4>${value.name}</h4>
            </div>
            <div class="author-like">
              <p>${value.author}</p>
              <div class="like">
                <img src="../assets/icons/heart.png" alt="" />
                <span>${value.likes}</span>
              </div>
            </div>
            <div class="tag-section">
              <img src="../assets/icons/Vector.png" alt="" />
              <p>${value.category}</p>
            </div>
            <div class="statistical">
              <div><p>by</p><strong>100g</strong></div>
              <div><p>Energy</p><strong>${value.energy} kcal</strong></div>
              <div><p>Fat</p><strong>${value.fat} g</strong></div>
              <div><p>Carbohydrate</p><strong>${value.carbohydrate} g</strong></div>
              <div><p>Protein</p><strong>${value.protein} g</strong></div>
            </div>
          </div>
        </div>
      `;
  });

  recipeInformation.innerHTML = recipesDisplay.join("");
  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const pagination = document.querySelector(".page-recipes");

  pagination.innerHTML = "";

  // Prev
  pagination.insertAdjacentHTML(
    "beforeend",
    `<img class="page-child prev-page" src="../assets/icons/arrow_left.png" alt="Prev" 
      ${
        currentPage === 1 ? 'style="opacity: 0.4; pointer-events: none;"' : ""
      } />`
  );

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    pagination.insertAdjacentHTML(
      "beforeend",
      `<span class="page-child page-number ${
        i === currentPage ? "active" : ""
      }">${i}</span>`
    );
  }

  // Next
  pagination.insertAdjacentHTML(
    "beforeend",
    `<img class="page-child next-page" src="../assets/icons/arrow_right.png" alt="Next"
      ${
        currentPage === totalPages
          ? 'style="opacity: 0.4; pointer-events: none;"'
          : ""
      } />`
  );

  // Gán sự kiện
  pagination.querySelector(".prev-page")?.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderRecipes(currentPage);
    }
  });

  pagination.querySelector(".next-page")?.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderRecipes(currentPage);
    }
  });

  pagination.querySelectorAll(".page-number").forEach((el) => {
    el.addEventListener("click", () => {
      const pageNum = Number(el.innerText);
      if (!isNaN(pageNum)) {
        currentPage = pageNum;
        renderRecipes(currentPage);
      }
    });
  });
}

const sortIcon = document.querySelector(".sort-toggle");
const sortOptions = document.querySelector(".sort-options");
const selectedOption = document.querySelector(".selected-option");

sortIcon.addEventListener("click", () => {
  sortOptions.classList.toggle("hidden");
});

sortOptions.querySelectorAll("li").forEach((li) => {
  li.addEventListener("click", () => {
    selectedOption.textContent = li.textContent;
    sortOptions.classList.add("hidden");
    const sortValue = li.dataset.sort;
    console.log("Đang sắp xếp theo:", sortValue);
    // TODO: Gọi hàm sắp xếp danh sách ở đây nếu cần
  });
});

document.addEventListener("click", (e) => {
  if (!sortIcon.contains(e.target) && !sortOptions.contains(e.target)) {
    sortOptions.classList.add("hidden");
  }
});

// CATEGORY
const categoryDisplay = document.querySelector(".category-display");
const categoryOptions = document.querySelector(".category-options");
const selectedCategory = document.querySelector(".selected-category");

categoryDisplay.addEventListener("click", () => {
  categoryOptions.classList.toggle("hidden");
});

categoryOptions.querySelectorAll("li").forEach((li) => {
  li.addEventListener("click", () => {
    selectedCategory.textContent = li.textContent;
    categoryOptions.classList.remove("hidden");
    const categoryValue = li.dataset.category;
    console.log("Selected category:", categoryValue);
    // TODO: lọc danh sách theo categoryValue nếu cần
  });
});

document.addEventListener("click", (e) => {
  if (!categoryDisplay.contains(e.target)) {
    categoryOptions.classList.add("hidden");
  }
});

renderRecipes(currentPage);

const searchInput = document.querySelector(".search-input");

let currentSort = null;
let currentCategory = null;
let currentSearch = "";

function filterAndSortRecipes() {
  filteredRecipes = recipes
    .filter((r) => {
      const matchCategory = currentCategory
        ? r.category.toLowerCase() === currentCategory.toLowerCase()
        : true;
      const matchSearch = r.name
        .toLowerCase()
        .includes(currentSearch.toLowerCase());
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (currentSort) {
        return b[currentSort] - a[currentSort]; // Descending
      }
      return 0;
    });

  currentPage = 1;
  renderRecipes(currentPage);
}

//  Tìm kiếm
searchInput.addEventListener("input", (e) => {
  currentSearch = e.target.value;
  filterAndSortRecipes();
});

//  Sắp xếp
sortOptions.querySelectorAll("li").forEach((li) => {
  li.addEventListener("click", () => {
    selectedOption.textContent = li.textContent;
    sortOptions.classList.add("hidden");
    currentSort = li.dataset.sort;
    filterAndSortRecipes();
  });
});

//  Lọc
categoryOptions.querySelectorAll("li").forEach((li) => {
  li.addEventListener("click", () => {
    selectedCategory.textContent = li.textContent;
    categoryOptions.classList.remove("hidden");
    currentCategory = li.dataset.category;
    filterAndSortRecipes();
  });
});
