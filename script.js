const meals = document.getElementById("meals");
const favContainer = document.getElementById("favContainer");
// localStorage.clear();

getRandomMeal();
fetchFavMeals();
async function getRandomMeal() {
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
  const resData = await res.json();
  const rMeal = resData.meals[0];

  addRMeal(rMeal, true);
}

async function getMealById(id) {
  const res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );
  const resData = await res.json();
  const meal = resData.meals[0];
  return meal;
}

async function getMealBySearch(name) {
  const meals = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + name
  );
}

function addRMeal(mData, v = false) {
  const meal = document.createElement("div");
  meal.classList.add("meal");

  meal.innerHTML = `
               <div class="meal-header">
                    ${v ? `<span class="random">Random recipe</span>` : ""}
                   <img src=${mData.strMealThumb} alt=${mData.strMeal}>
               </div>
               <div class="meal-body">
                   <h4>${mData.strMeal}</h4>
                   <button class="like-btn"><i class="fas fa-heart"></i></button>
               </div>
    `;

  const aBtn = meal.querySelector(".meal-body .like-btn");
  aBtn.addEventListener("click", () => {
    if (aBtn.classList.contains("active")) {
      removeLS(mData.idMeal);
      aBtn.classList.remove("active");
    } else {
      updateLS(mData.idMeal);
      aBtn.classList.add("active");
    }
    fetchFavMeals();
  });

  meals.appendChild(meal);
}

function updateLS(mealId) {
  const mealIds = getMealFromLS();

  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function removeLS(mealId) {
  const mealIds = getMealFromLS();
  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds.filter((id) => id !== mealId))
  );
}

function getMealFromLS() {
  const mealIds = JSON.parse(localStorage.getItem("mealIds"));

  return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {
  favContainer.innerHTML = "";
  const mealIds = getMealFromLS();
  const meals = [];

  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];

    meal = await getMealById(mealId);
    addFMeal(meal);
  }
}

function addFMeal(mData) {
  const favMeal = document.createElement("li");

  favMeal.innerHTML = `
  <button class="close-btn"><i class="fa-solid fa-circle-xmark"></i></button> 
  <img src="${mData.strMealThumb}" alt="${mData.strMeal}"><span>${mData.strMeal}</span></img> 
  `;

  const btn = favMeal.querySelector(".close-btn");
  btn.addEventListener("click", () => {
    removeLS(mData.idMeal);
    fetchFavMeals();
  });

  favContainer.appendChild(favMeal);
}
