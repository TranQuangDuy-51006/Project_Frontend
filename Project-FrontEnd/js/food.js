const foods = JSON.parse(localStorage.getItem("foods")) || [];
let currentFoodPage = 1;
const foodsPerPage = 6;
let currentEditIndex = -1;

document.addEventListener("DOMContentLoaded", () => {
  renderFoods();
});

function renderFoods() {
  const boxFood = document.querySelector(".box-food");
  boxFood.innerHTML = "";

  const start = (currentFoodPage - 1) * foodsPerPage;
  const end = start + foodsPerPage;
  const currentFoods = foods.slice(start, end);

  currentFoods.forEach((food) => {
    const foodHTML = `
      <div class="food-child">
        <div class="title-food">
          <b>${food.name}</b>
          <p>${food.source}</p>
        </div>
        <div class="statistical">
          <div><p>Energy</p><strong>${food.energy} kcal</strong></div>
          <div><p>Fat</p><strong>${food.fat} g</strong></div>
          <div><p>Carbohydrate</p><strong>${food.carbohydrate} g</strong></div>
          <div><p>Protein</p><strong>${food.protein} g</strong></div>
        </div>
      </div>`;
    boxFood.insertAdjacentHTML("beforeend", foodHTML);
  });

  boxFood.insertAdjacentHTML(
    "beforeend",
    `
    <div class="create-food" id="create-food">
      <img src="../assets/icons/create-food.png" alt="" />
      <span>Create food</span>
    </div>
  `
  );

  setupFoodEvents();
  renderFoodPagination();
}

function renderFoodPagination() {
  const pagination = document.querySelector(".page-recipes");
  if (!pagination) return;

  const totalPages = Math.ceil(foods.length / foodsPerPage);
  pagination.innerHTML = "";

  const disabledStyle = 'style="opacity: 0.4; pointer-events: none;"';
  pagination.insertAdjacentHTML(
    "beforeend",
    `
    <img class="page-child prev-page" src="../assets/icons/arrow_left.png" alt="Prev" ${
      currentFoodPage === 1 ? disabledStyle : ""
    } />
  `
  );

  for (let i = 1; i <= totalPages; i++) {
    pagination.insertAdjacentHTML(
      "beforeend",
      `
      <span class="page-child page-number ${
        i === currentFoodPage ? "active" : ""
      }">${i}</span>
    `
    );
  }

  pagination.insertAdjacentHTML(
    "beforeend",
    `
    <img class="page-child next-page" src="../assets/icons/arrow_right.png" alt="Next" ${
      currentFoodPage === totalPages ? disabledStyle : ""
    } />
  `
  );

  pagination.querySelector(".prev-page")?.addEventListener("click", () => {
    if (currentFoodPage > 1) {
      currentFoodPage--;
      renderFoods();
    }
  });

  pagination.querySelector(".next-page")?.addEventListener("click", () => {
    if (currentFoodPage < totalPages) {
      currentFoodPage++;
      renderFoods();
    }
  });

  pagination.querySelectorAll(".page-number").forEach((el) => {
    el.addEventListener("click", () => {
      const pageNum = Number(el.innerText);
      if (!isNaN(pageNum)) {
        currentFoodPage = pageNum;
        renderFoods();
      }
    });
  });
}

function setupFoodEvents() {
  const create = document.getElementById("create-food");
  const addContainer = document.getElementById("add-container");
  const coat = document.getElementById("coat");
  const closeFoodAdd = document.getElementById("close-food-add");
  const cancelAdd = document.getElementById("cancel-food-add");
  const cancelFix = document.getElementById("cancel-food-fix");
  const closeFoodFix = document.getElementById("close-food-fix");
  const fixContainer = document.getElementById("fix-container");
  const saveBtn = document.querySelector(".save");
  const saveFixBtn = fixContainer.querySelector(".save-fix");

  create?.addEventListener("click", () => {
    addContainer.classList.add("show");
    coat.classList.add("show");
  });

  [closeFoodAdd, cancelAdd].forEach((btn) => {
    btn?.addEventListener("click", () => {
      addContainer.classList.remove("show");
      coat.classList.remove("show");
    });
  });

  [closeFoodFix, cancelFix].forEach((btn) => {
    btn?.addEventListener("click", () => {
      fixContainer.classList.remove("show");
      coat.classList.remove("show");
    });
  });

  // ADD FUNCTION
  saveBtn?.addEventListener("click", () => {
    const nameLogin = JSON.parse(localStorage.getItem("nameLogin")) || "";
    const inputs = document.querySelectorAll(".add-container input");
    const name = inputs[0].value.trim();
    const source = document.querySelector(".source-food").innerText.trim();
    const category = inputs[1].value.trim();
    const quantity = inputs[2].value.trim();
    const energy = parseFloat(inputs[3].value);
    const fat = parseFloat(inputs[4].value);
    const carbohydrate = parseFloat(inputs[5].value);
    const protein = parseFloat(inputs[6].value);

    inputs.forEach((input) => input.classList.remove("error"));

    let hasError = false;
    if (!name) inputs[0].classList.add("error"), (hasError = true);
    if (!category) inputs[1].classList.add("error"), (hasError = true);
    if (!quantity) inputs[2].classList.add("error"), (hasError = true);
    if (isNaN(energy)) inputs[3].classList.add("error"), (hasError = true);
    if (isNaN(fat)) inputs[4].classList.add("error"), (hasError = true);
    if (isNaN(carbohydrate))
      inputs[5].classList.add("error"), (hasError = true);
    if (isNaN(protein)) inputs[6].classList.add("error"), (hasError = true);

    if (hasError) {
      Swal.fire({
        title: "Vui lòng nhập đầy đủ và hợp lệ các trường bắt buộc.",
        icon: "error",
        draggable: true,
      });
      return;
    }

    const food = {
      name,
      source,
      category,
      quantity,
      energy,
      fat,
      carbohydrate,
      protein,
      author: nameLogin,
      likes: 0,
    };

    const micronutrientNames = [
      "cholesterol",
      "fiber",
      "sodium",
      "water",
      "vitaminA",
      "vitaminB6",
      "vitaminB12",
      "vitaminC",
      "vitaminD",
      "vitaminE",
      "vitaminK",
      "starch",
      "lactose",
      "alcohol",
      "caffeine",
      "sugars",
      "calcium",
      "iron",
      "magnesium",
      "phosphorus",
      "potassium",
      "zinc",
      "copper",
      "fluoride",
      "manganese",
      "selenium",
      "thiamin",
      "riboflavin",
      "niacin",
      "pantothenicAcid",
      "folateTotal",
      "folicAcid",
      "fattyTrans",
      "fattySaturated",
      "fattyMono",
      "fattyPoly",
      "chloride",
    ];

    micronutrientNames.forEach((name, i) => {
      food[name] = parseFloat(inputs[7 + i]?.value) || 0;
    });

    foods.unshift(food);
    Swal.fire({
      title: "Thêm món ăn thành công!",
      icon: "success",
      draggable: true,
    }).then(() => {
      location.reload();
    });
    console.log(foods);

    localStorage.setItem("foods", JSON.stringify(foods));
    renderFoods();

    addContainer.classList.remove("show");
    coat.classList.remove("show");
    inputs.forEach((input) => (input.value = ""));
  });

  document.querySelectorAll(".food-child").forEach((child, index) => {
    child.addEventListener("click", () => {
      currentEditIndex = (currentFoodPage - 1) * foodsPerPage + index;
      const food = foods[currentEditIndex];

      fixContainer.classList.add("show");
      coat.classList.add("show");

      const fixInputs = fixContainer.querySelectorAll("input");
      fixInputs[0].value = food.name || "";
      fixInputs[1].value = food.category || "";
      fixInputs[2].value = food.quantity || "";
      fixInputs[3].value = food.energy || "";
      fixInputs[4].value = food.fat || "";
      fixInputs[5].value = food.carbohydrate || "";
      fixInputs[6].value = food.protein || "";

      const micronutrientNames = [
        "cholesterol",
        "fiber",
        "sodium",
        "water",
        "vitaminA",
        "vitaminB6",
        "vitaminB12",
        "vitaminC",
        "vitaminD",
        "vitaminE",
        "vitaminK",
        "starch",
        "lactose",
        "alcohol",
        "caffeine",
        "sugars",
        "calcium",
        "iron",
        "magnesium",
        "phosphorus",
        "potassium",
        "zinc",
        "copper",
        "fluoride",
        "manganese",
        "selenium",
        "thiamin",
        "riboflavin",
        "niacin",
        "pantothenicAcid",
        "folateTotal",
        "folicAcid",
        "fattyTrans",
        "fattySaturated",
        "fattyMono",
        "fattyPoly",
        "chloride",
      ];

      micronutrientNames.forEach((key, i) => {
        fixInputs[7 + i].value = food[key] || "";
      });
    });
  });

  // SAVE EDITED FOOD
  saveFixBtn?.addEventListener("click", () => {
    const fixInputs = fixContainer.querySelectorAll("input");
    const name = fixInputs[0].value.trim();
    const category = fixInputs[1].value.trim();
    const quantity = fixInputs[2].value.trim();
    const energy = parseFloat(fixInputs[3].value);
    const fat = parseFloat(fixInputs[4].value);
    const carbohydrate = parseFloat(fixInputs[5].value);
    const protein = parseFloat(fixInputs[6].value);

    if (
      !name ||
      !category ||
      !quantity ||
      isNaN(energy) ||
      isNaN(fat) ||
      isNaN(carbohydrate) ||
      isNaN(protein)
    ) {
      Swal.fire({
        title: "Vui lòng nhập đầy đủ và hợp lệ các trường bắt buộc.",
        icon: "error",
        draggable: true,
      });
      return;
    }

    const originalFood = foods[currentEditIndex];
    const updatedFood = {
      name,
      source: originalFood.source,
      category,
      quantity,
      energy,
      fat,
      carbohydrate,
      protein,
    };

    const micronutrientNames = [
      "cholesterol",
      "fiber",
      "sodium",
      "water",
      "vitaminA",
      "vitaminB6",
      "vitaminB12",
      "vitaminC",
      "vitaminD",
      "vitaminE",
      "vitaminK",
      "starch",
      "lactose",
      "alcohol",
      "caffeine",
      "sugars",
      "calcium",
      "iron",
      "magnesium",
      "phosphorus",
      "potassium",
      "zinc",
      "copper",
      "fluoride",
      "manganese",
      "selenium",
      "thiamin",
      "riboflavin",
      "niacin",
      "pantothenicAcid",
      "folateTotal",
      "folicAcid",
      "fattyTrans",
      "fattySaturated",
      "fattyMono",
      "fattyPoly",
      "chloride",
    ];

    micronutrientNames.forEach((key, i) => {
      updatedFood[key] = parseFloat(fixInputs[7 + i].value) || 0;
    });

    foods[currentEditIndex] = updatedFood;
    localStorage.setItem("foods", JSON.stringify(foods));
    renderFoods();
    Swal.fire({
      title: "Cập nhật món ăn thành công!",
      icon: "success",
      draggable: true,
    }).then(() => {
      location.reload();
    });

    fixContainer.classList.remove("show");
    coat.classList.remove("show");
  });
}

function renderFoods() {}

// sort

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

let currentSearchKeyword = "";
let currentCategoryFilter = "";
let currentSortField = "";

// Cập nhật renderFoods để áp dụng tìm kiếm, lọc, sắp xếp
function renderFoods() {
  const boxFood = document.querySelector(".box-food");
  boxFood.innerHTML = "";

  // 1. Lọc theo category
  let filteredFoods = [...foods];
  if (currentCategoryFilter) {
    filteredFoods = filteredFoods.filter(
      (f) => f.category?.toLowerCase() === currentCategoryFilter.toLowerCase()
    );
  }

  // 2. Tìm kiếm theo tên
  if (currentSearchKeyword) {
    filteredFoods = filteredFoods.filter((f) =>
      f.name.toLowerCase().includes(currentSearchKeyword.toLowerCase())
    );
  }

  // 3. Sắp xếp
  if (currentSortField) {
    filteredFoods.sort((a, b) => {
      const valA = parseFloat(a[currentSortField]) || 0;
      const valB = parseFloat(b[currentSortField]) || 0;
      return valB - valA;
    });
  }

  // 4. Phân trang
  const totalPages = Math.ceil(filteredFoods.length / foodsPerPage);
  if (currentFoodPage > totalPages) currentFoodPage = totalPages || 1;
  const start = (currentFoodPage - 1) * foodsPerPage;
  const end = start + foodsPerPage;
  const currentFoods = filteredFoods.slice(start, end);

  currentFoods.forEach((food) => {
    const foodHTML = `
      <div class="food-child">
        <div class="title-food">
          <b>${food.name}</b>
          <p>${food.source}</p>
        </div>
        <div class="statistical">
          <div><p>Energy</p><strong>${food.energy} kcal</strong></div>
          <div><p>Fat</p><strong>${food.fat} g</strong></div>
          <div><p>Carbohydrate</p><strong>${food.carbohydrate} g</strong></div>
          <div><p>Protein</p><strong>${food.protein} g</strong></div>
        </div>
      </div>`;
    boxFood.insertAdjacentHTML("beforeend", foodHTML);
  });

  boxFood.insertAdjacentHTML(
    "beforeend",
    `<div class="create-food" id="create-food">
      <img src="../assets/icons/create-food.png" alt="" />
      <span>Create food</span>
    </div>`
  );

  setupFoodEvents();
  renderFoodPagination(filteredFoods.length);
}

function renderFoodPagination(totalItems) {
  const pagination = document.querySelector(".page-recipes");
  if (!pagination) return;

  const totalPages = Math.ceil(totalItems / foodsPerPage);
  pagination.innerHTML = "";

  const disabledStyle = 'style="opacity: 0.4; pointer-events: none;"';
  pagination.insertAdjacentHTML(
    "beforeend",
    `<img class="page-child prev-page" src="../assets/icons/arrow_left.png" alt="Prev" ${
      currentFoodPage === 1 ? disabledStyle : ""
    } />`
  );

  for (let i = 1; i <= totalPages; i++) {
    pagination.insertAdjacentHTML(
      "beforeend",
      `<span class="page-child page-number ${
        i === currentFoodPage ? "active" : ""
      }">${i}</span>`
    );
  }

  pagination.insertAdjacentHTML(
    "beforeend",
    `<img class="page-child next-page" src="../assets/icons/arrow_right.png" alt="Next" ${
      currentFoodPage === totalPages ? disabledStyle : ""
    } />`
  );

  pagination.querySelector(".prev-page")?.addEventListener("click", () => {
    if (currentFoodPage > 1) {
      currentFoodPage--;
      renderFoods();
    }
  });

  pagination.querySelector(".next-page")?.addEventListener("click", () => {
    if (currentFoodPage < totalPages) {
      currentFoodPage++;
      renderFoods();
    }
  });

  pagination.querySelectorAll(".page-number").forEach((el) => {
    el.addEventListener("click", () => {
      const pageNum = Number(el.innerText);
      if (!isNaN(pageNum)) {
        currentFoodPage = pageNum;
        renderFoods();
      }
    });
  });
}

// Bắt sự kiện tìm kiếm
const searchInput = document.querySelector(".search-input");
searchInput?.addEventListener("input", (e) => {
  currentSearchKeyword = e.target.value.trim();
  currentFoodPage = 1;
  renderFoods();
});

// Bắt sự kiện chọn sắp xếp
sortOptions.querySelectorAll("li").forEach((li) => {
  li.addEventListener("click", () => {
    selectedOption.textContent = li.textContent;
    sortOptions.classList.add("hidden");
    currentSortField = li.dataset.sort;
    currentFoodPage = 1;
    renderFoods();
  });
});

// Bắt sự kiện chọn danh mục
categoryOptions.querySelectorAll("li").forEach((li) => {
  li.addEventListener("click", () => {
    selectedCategory.textContent = li.textContent;
    categoryOptions.classList.add("hidden");
    currentCategoryFilter = li.dataset.category || "";
    currentFoodPage = 1;
    renderFoods();
  });
});
