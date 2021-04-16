// Author: Samantha Grieco (samtb1@outlook.com)
// Created for RBC Summer Tech Labs 2021 
// This script takes a user input and fetches TheMealDB 
// (www.themealdb.com) for specific data such as
// category, ingredients, instructions, and images
// based on the inputted meal.

const warningAlert = document.getElementById("warning");
const database = document.getElementById("database");
const outputResult = document.getElementById("result-box"); 

// Handles the 20 click options on the webpage 
document.querySelectorAll('.common').forEach(item => {
  item.addEventListener('click', event => {
      getFood(event.target.innerHTML);
      clearPage(); // Removes previous popups
  })
})

// Handles the user input
function validateForm() {
  clearPage(); // Removes previous popups

  // Alerts the user if they have submitted an input with no text
  if (document.forms["inputFood"]["food"].value == "") {
    warningAlert.innerHTML = "Please Provide a Dish";
    warningAlert.classList.add("reveal");
    return false;
  }
  getFood(document.forms["inputFood"]["food"].value);
}

// Fetches the database with the inputted meal
// and displays the results on the page
async function getFood(foodName) {
  try {
    let ingredient, measure, categoryResult, i=1;

    // Fetching the database for the inputted meal
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName
    .trim()
    .replace(/ /g,"_")}`);
    const data = await response.json();

    // Checking to make sure TheMealDB has the inputted meal
    if (data.meals == null) {
      warningAlert.innerHTML = "Sorry, there is no data on this dish. Try something else";
      warningAlert.classList.add("reveal");
      return;
    }

    const mealData = data.meals[0];

    // Creating the HTML elements
    const root = document.createElement('div');
    const categoryAppear = document.createElement('p');
    const instructionsAppear = document.createElement('p');
    const ingredientsAppear = document.createElement('p');
    const imageAppear = document.createElement('img');

    // Determining if the meal is an appetizer, dessert, or main
    switch (mealData.strCategory) {
        case "Side":
            categoryResult = "Appetizer";
            break;
        case "Starter":
            categoryResult = "Appetizer";
            break;
        case "Dessert":
            categoryResult = "Dessert";
            break;
        default:
            categoryResult = "Main";
    }

    // Assigning the data retrieved to their respective HTML elements
    categoryAppear.innerHTML = `${mealData.strMeal}: ${categoryResult}`;
    instructionsAppear.innerHTML = `Directions <br> ${mealData.strInstructions}`;
    imageAppear.src = mealData.strMealThumb;
    imageAppear.alt = `Image of ${mealData.strMeal}`;
    ingredientsAppear.innerHTML = "Ingredients<br>"

    // Loops through each ingredient, stopping when A) it is empty
    // or B) all 20 ingredients have been added
    while (i <= 20 && mealData["strIngredient" + i] != ""){
      ingredient = mealData["strIngredient" + i];
      measure = mealData["strMeasure" + i];
      ingredientsAppear.innerHTML += ingredient + ": " + measure + "<br>";
      i++;
    }

    // Appending the elements to the webpage
    root.append(categoryAppear, imageAppear, ingredientsAppear, instructionsAppear);
    outputResult.append(root);

    // Sending the food name to the database
    const sendToDatabase = await fetch('/foodData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        foodName: mealData.strMeal
      })
    });
    const sendDatabase = await sendToDatabase.text();
    console.log("its been sent");
    document.getElementById('form').reset();

  } catch (error) {
      warningAlert.innerHTML = "Sorry, there was an error trying to grab the dish. Try something else";
      warningAlert.classList.add("reveal");
      document.forms.reset();
  }
}

// Handles database retrieval 
async function getDatabase() {
  // Removes previous popups
  if(clearPage()) return ;

  // Fetching the database for all the past entries
  // and then appends them to the page
  const response = await fetch("/foodData");
  const data = await response.json();
  const root = document.createElement('div');

  for (item of data) {
    const entry = document.createElement('p');
    entry.textContent = `${item.foodName}- Searched on ${new Date (item.timestamp).toLocaleDateString()}`;
    root.append(entry);
  }
  database.append(root);
}

// Removes previous entries and warnings
function clearPage (){
  if (outputResult.hasChildNodes()) {
   outputResult.removeChild(outputResult.childNodes[0]);
  }
  if (warningAlert.classList.contains("reveal")) {
   warningAlert.classList.remove("reveal");
  }
  if (database.hasChildNodes()) {
    database.removeChild(database.childNodes[0]);
    return true;
  }
}