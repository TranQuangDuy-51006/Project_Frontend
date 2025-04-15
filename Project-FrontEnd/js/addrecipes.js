const foods = JSON.parse(localStorage.getItem("foods")) || [];
const recipes = JSON.parse(localStorage.getItem("recipes")) || [];

const recipesPerPage = 6;
let currentPage = 1;
let ingredientsArrayAdd = [];
let filteredFoods = [...foods];

const container = document.querySelector(".nutritional_table");
const searchInput = document.querySelector(".search-input");
const sortSelect = document.querySelector(".sort-select");
const categorySelect = document.querySelector(".category-select");
const paginationContainer = document.querySelector(".page-recipes");

function renderFoods(page) {
  const start = (page - 1) * recipesPerPage;
  const end = start + recipesPerPage;
  const currentFoods = filteredFoods.slice(start, end);

  container.innerHTML = `
                <div class="table_head">
                  <span>Nutritional Information</span>
                  <span>Energy</span>
                  <span>Fat</span>
                  <span>Carboh... </span>
                  <span>Protein</span>
                  <span> </span>
                </div>
                `;
  currentFoods.forEach((food) => {
    const tableBody = document.createElement("div");
    tableBody.className = "table_body";

    tableBody.innerHTML = `
        <div class="row">
          <span class="title-food-recipes">${food.name}</span>
          <span class="title-food-recipes">${food.source}</span>
          <div class="row_input">
            <span>1</span>
            <span>portion(${food.quantity}g)</span>
            <span>${food.quantity}g</span>
          </div>
        </div>
        <div class="number">
          <span>${food.energy} kcal</span>
          <span>${food.fat}g</span>
          <span>${food.carbohydrate}g</span>
          <span>${food.protein}g</span>
        </div>
        <div class="add bg-none">
          <span>+</span>
        </div>
      `;

    container.appendChild(tableBody);
  });
  addList();
  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(filteredFoods.length / recipesPerPage);

  paginationContainer.innerHTML = "";

  
  paginationContainer.insertAdjacentHTML(
    "beforeend",
    `<img class="page-child prev-page page-img-button" src="../assets/icons/arrow_left.png" alt="Prev"
        ${
          currentPage === 1 ? 'style="opacity: 0.4; pointer-events: none;"' : ""
        } />`
  );


  for (let i = 1; i <= totalPages; i++) {
    paginationContainer.insertAdjacentHTML(
      "beforeend",
      `<span class="page-child page-number page-button ${
        i === currentPage ? "active" : ""
      }">${i}</span>`
    );
  }

  paginationContainer.insertAdjacentHTML(
    "beforeend",
    `<img class="page-child next-page page-img-button" src="../assets/icons/arrow_right.png" alt="Next"
        ${
          currentPage === totalPages
            ? 'style="opacity: 0.4; pointer-events: none;"'
            : ""
        } />`
  );

  paginationContainer
    .querySelector(".prev-page")
    ?.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderFoods(currentPage);
      }
      addList();
    });

  paginationContainer
    .querySelector(".next-page")
    ?.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderFoods(currentPage);
      }
      addList();
    });

  paginationContainer.querySelectorAll(".page-number").forEach((el) => {
    el.addEventListener("click", () => {
      const pageNum = Number(el.innerText);
      if (!isNaN(pageNum)) {
        currentPage = pageNum;
        renderFoods(currentPage);
      }
    });
  });
}

function filterAndSortFoods() {
  const searchQuery = searchInput.value.toLowerCase();
  const selectedCategory = categorySelect.value;
  const sortValue = sortSelect.value;

  filteredFoods = foods
    .filter((food) => {
      const matchName = food.name.toLowerCase().includes(searchQuery);
      const matchCategory = selectedCategory
        ? food.source === selectedCategory
        : true;
      return matchName && matchCategory;
    })
    .sort((a, b) => {
      if (sortValue === "energy") {
        return b.energy - a.energy;
      }
      if (sortValue === "fat") {
        return b.fat - a.fat;
      }
      if (sortValue === "carbohydrate") {
        return b.carbohydrate - a.carbohydrate;
      }
      if (sortValue === "protein") {
        return b.protein - a.protein;
      }
      return 0;
    });

  currentPage = 1;
  renderFoods(currentPage);
}

searchInput.addEventListener("input", filterAndSortFoods);
sortSelect.addEventListener("change", filterAndSortFoods);
categorySelect.addEventListener("change", filterAndSortFoods);

const btnIngredient = document.getElementById("btn-ingredient");
const ingredientBox = document.getElementById("content-ingredient");
const addImg = document.getElementById("add-img");
const boxImg = document.getElementById("box-img");
const inputURL = document.getElementById("input-url");

let on = 0;

btnIngredient.onclick = () => {
  if (on) {
    btnIngredient.style.transform = "rotate(180deg)";
    ingredientBox.classList.add("hide-ingredient");
    on = 0;
  } else {
    ingredientBox.classList.remove("hide-ingredient");
    btnIngredient.style.transform = "rotate(0deg)";
    on = 1;
  }
};

let img = "";
addImg.onclick = () => {
  inputURL.style.display = "block";
  addImg.style.display = "none";

  inputURL.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      boxImg.style.backgroundImage = `url('${inputURL.value}')`;
      img = inputURL.value;
      inputURL.style.display = "none";
      addImg.style.display = "flex";
    }
  });
};

const addCategory = document.getElementById("add-category");
const dropdown = document.getElementById("category-list");
const selectedP = document.getElementById("selected-category");
let checked = 1;
addCategory.addEventListener("click", function () {
  if (checked) {
    dropdown.classList.remove("hide");
    checked = 0;
  } else {
    dropdown.classList.add("hide");
    checked = 1;
  }
  // dropdown.classList.toggle("hide");
});

let category = "";

dropdown.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    selectedP.textContent = e.target.textContent;
    category = e.target.textContent;
    dropdown.classList.add("hide");
  }
});

renderFoods(currentPage);

const publish = document.getElementById("publish");

publish.onclick = () => {
  const nameLogin = JSON.parse(localStorage.getItem("nameLogin")) || "";
  const arrPublish = sumNutrition(ingredientsArrayAdd);
  console.log(arrPublish);

  const inputBI = document.getElementsByClassName("input-basic-information");
  const name = inputBI[0].value.trim();
  const description = inputBI[1].value.trim();
  const totalTime = inputBI[2].value.trim();
  const preparationTime = inputBI[3].value.trim();
  const finalWeight = inputBI[4].value.trim();
  const protions = inputBI[5].value.trim();
  let hasError = false;
  if (!name) {
    inputBI[0].classList.add("error");
    hasError = true;
  }
  if (!description) {
    inputBI[1].classList.add("error");
    hasError = true;
  }
  if (!totalTime) {
    inputBI[2].classList.add("error");
    hasError = true;
  }
  if (!preparationTime) {
    inputBI[3].classList.add("error");
    hasError = true;
  }
  if (!finalWeight) {
    inputBI[4].classList.add("error");
    hasError = true;
  }
  if (!protions) {
    inputBI[5].classList.add("error");
    hasError = true;
  }

  console.log(selectedP.textContent);

  if (selectedP.textContent === "New category") {
    addCategory.classList.add("error");
    hasError = true;
  }

  if (hasError) {
    Swal.fire({
      title: "Vui lòng nhập đầy đủ và hợp lệ các trường bắt buộc.",
      icon: "error",
      draggable: true,
    });
    return;
  }
  const foodRecipes = {
    name,
    description,
    totalTime,
    preparationTime,
    finalWeight,
    protions,
    category,
    energy: arrPublish.energy,
    fat: arrPublish.fat,
    carbohydrate: arrPublish.carbohydrate,
    protein: arrPublish.protein,
    author: nameLogin,
    likes: 0,
    img: inputURL.value,
    cholesterol: arrPublish.cholesterol,
    fiber: arrPublish.fiber,
    sodium: arrPublish.sodium,
    water: arrPublish.water,
    vitaminA: arrPublish.vitaminA,
    vitaminB6: arrPublish.vitaminB6,
    vitaminB12: arrPublish.vitaminB12,
    vitaminC: arrPublish.vitaminC,
    vitaminD: arrPublish.vitaminD,
    vitaminE: arrPublish.vitaminE,
    vitaminK: arrPublish.vitaminK,
    starch: arrPublish.starch,
    lactose: arrPublish.lactose,
    alcohol: arrPublish.alcohol,
    caffeine: arrPublish.caffeine,
    sugars: arrPublish.sugars,
    calcium: arrPublish.calcium,
    iron: arrPublish.iron,
    magnesium: arrPublish.magnesium,
    phosphorus: arrPublish.phosphorus,
    potassium: arrPublish.potassium,
    zinc: arrPublish.zinc,
    copper: arrPublish.copper,
    fluoride: arrPublish.fluoride,
    manganese: arrPublish.manganese,
    selenium: arrPublish.selenium,
    thiamin: arrPublish.thiamin,
    riboflavin: arrPublish.riboflavin,
    niacin: arrPublish.niacin,
    pantothenicAcid: arrPublish.pantothenicAcid,
    folateTotal: arrPublish.folateTotal,
    folicAcid: arrPublish.folicAcid,
    fattyTrans: arrPublish.fattyTrans,
    fattySaturated: arrPublish.fattySaturated,
    fattyMono: arrPublish.fattyMono,
    fattyPoly: arrPublish.fattyPoly,
    chloride: arrPublish.chloride,
  };
  recipes.unshift(foodRecipes);
  localStorage.setItem("recipes", JSON.stringify(recipes));
  Swal.fire({
    title: "Đăng thành công!",
    icon: "success",
    draggable: true,
  }).then(() => {
    location.reload();
    window.location.href = "../pages/recipes.html";
  });
};

function addList() {
  const addIngredients = document.getElementsByClassName("add");
  for (let i in addIngredients) {
    addIngredients[i].onclick = () => {
      ingredientsArrayAdd.unshift(foods[i]);
      const sumIngredients = sumNutrition(ingredientsArrayAdd);

      const fatChart = document.querySelector(".nutrition .fat");
      const carbohydrateChart = document.querySelector(
        ".nutrition .carbohydrate"
      );
      const proteinChart = document.querySelector(".nutrition .protein");
      const fiberChart = document.querySelector(".nutrition .fiber");
      const energyChart = document.getElementById("energy-chart");

      energyChart.innerText = sumIngredients.energy;
      fatChart.innerText = sumIngredients.fat;
      carbohydrateChart.innerText = sumIngredients.carbohydrate;
      proteinChart.innerText = sumIngredients.protein;
      fiberChart.innerText = sumIngredients.fiber;
      updatePieChart(
        sumIngredients.fat,
        sumIngredients.carbohydrate,
        sumIngredients.protein
      );
      for (const key in sumIngredients) {
        const row = document.querySelector(`.nutrition-table .${key} span`);
        if (row) {
          row.innerText = sumIngredients[key];
        }
      }
    };
  }
}

function sumNutrition(array) {
  const excludedKeys = [
    "author",
    "likes",
    "quantity",
    "name",
    "category",
    "source",
  ];
  const total = {};

  array.forEach((item) => {
    for (const key in item) {
      if (!excludedKeys.includes(key) && typeof item[key] === "number") {
        if (!total[key]) total[key] = 0;
        total[key] += item[key];
      }
    }
  });

  return total;
}

function updatePieChart(fat, carb, protein) {
  const total = fat + carb + protein;
  const fatPercent = (fat / total) * 100;
  const carbPercent = (carb / total) * 100;
  const proteinPercent = (protein / total) * 100;

  const gradient = `
    conic-gradient(#db4965 0% ${fatPercent}%,
     #e8a878 ${fatPercent}% ${fatPercent + carbPercent}%,
      #17a589 ${fatPercent + carbPercent}% 100%
    )
  `;

  const pieChart = document.querySelector(".pie-chart");
  pieChart.style.background = gradient;
}
