const mealEls = document.getElementById("meals");
const favContainer = document.getElementById("favContainer");
const searchTerm = document.getElementById("search-term");
const search = document.getElementById("search");
const mealPopup=document.getElementById("mealPopup");
const popupCloseBtn=document.getElementById("close-popup");
const mealInfoEl=document.getElementById("meal-info");
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
  const res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + name
  );
  const resData = await res.json();
  const meal = resData.meals;

  return meal;
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

  meal.addEventListener("click",()=>{
    showMI(mData);
  })

  mealEls.appendChild(meal);
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
  favMeal.addEventListener("click",()=>{
    showMI(mData);
  })
  favContainer.appendChild(favMeal);
}

search.addEventListener("click", async () => {
  mealEls.innerHTML="";
  const input = searchTerm.value;

  const meals = await getMealBySearch(input);

  if (meals) {
    meals.forEach((meal) => {
      addRMeal(meal);
    });
  }
});

popupCloseBtn.addEventListener("click",()=>{
  mealPopup.classList.add("hidden");
})

function showMI(mData)
{
  mealInfoEl.innerHTML="";
  const mealEl=document.createElement("div");
  const ingredients=[];
  for(let i=1;i<=20;i++)
  {
    if(mData["strIngredient"+i])
    {
      ingredients.push(`${mData["strIngredient"+i]} - ${mData["strMeasure"+i]}`);
    }
    else break;
  }

  mealEl.innerHTML=`<h1 class="meal-name">${mData.strMeal}</h1>
  <img src="${mData.strMealThumb}" alt="${mData.strMeal}" />
  <p>
  ${mData.strInstructions}
  </p>
  <br>
  <h3>Ingredients:</h3>
  <br>
  <ul>
    ${ingredients.map(ing=>`<li>${ing}</li>`).join('')}
  </ul>
  `
  mealInfoEl.appendChild(mealEl);

  mealPopup.classList.remove("hidden");
}
