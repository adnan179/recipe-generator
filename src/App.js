import React, { useState, useEffect } from "react";
import recipeData from "./data/recipesData.json";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("name");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedMealType, setSelectedMealType] = useState("All");
  const [randomRecipes, setRandomRecipes] = useState([]);
  const [showRandomRecipes, setShowRandomRecipes] = useState(false);
  const [cuisines, setCuisines] = useState([]);
  const [mealTypes, setMealTypes] = useState([]);
  const [method, setMethod] = useState(false);

  //mapping the cuisine and mealtype options in the drop down menu
  useEffect(() => {
    const uniqueCuisines = [
      ...new Set(recipeData.map((recipe) => recipe.Cuisine)),
    ];
    setCuisines(["All", ...uniqueCuisines]);

    const uniqueMealTypes = [
      ...new Set(recipeData.map((recipe) => recipe.MealType)),
    ];
    setMealTypes(["All", ...uniqueMealTypes]);
  }, []);

  //func to handling the changes done in the input box
  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
    setShowRandomRecipes(false);
  };

  //func to update the categoryt value
  const handleCategoryChange = (e) => {
    setSearchCategory(e.target.value);
    setSearchTerm("");
    setShowRandomRecipes(false);
  };

  //func to update the cuisine value
  const handleCuisineChange = (e) => {
    setSelectedCuisine(e.target.value);
    setShowRandomRecipes(false);
  };

  //func to update the mealtype value
  const handleMealTypeChange = (e) => {
    setSelectedMealType(e.target.value);
    setShowRandomRecipes(false);
  };

  //func to handle method state
  const handleMethod = () => {
    setMethod(!method);
  };

  // func to filter the recipes from the recipeData.json from given inputs
  // func to filter the recipes from the recipeData.json from given inputs
  const filterRecipes = () => {
    const keywords = searchTerm
      .toLowerCase()
      .split(",")
      .map((keyword) => keyword.trim());

    return recipeData.filter((recipe) => {
      const isMatchingCuisine =
        selectedCuisine === "All" || recipe.Cuisine === selectedCuisine;
      const isMatchingMealType =
        selectedMealType === "All" || recipe.MealType === selectedMealType;

      if (!searchTerm) {
        return isMatchingCuisine && isMatchingMealType;
      }

      const searchTermLower = searchTerm.toLowerCase();

      if (searchCategory === "name") {
        const nameLower = recipe.Name.toLowerCase();
        return (
          (nameLower.includes(searchTermLower) ||
            nameLower.startsWith(searchTermLower)) &&
          isMatchingCuisine &&
          isMatchingMealType
        );
      }

      if (searchCategory === "ingredients") {
        return (
          recipe.Ingredients.some((ingredient) =>
            ingredient.toLowerCase().includes(searchTermLower)
          ) &&
          isMatchingCuisine &&
          isMatchingMealType
        );
      }

      return false;
    });
  };

  const filteredRecipes = filterRecipes();

  //func to get three random recipes every time the button is clicked
  const handleRandomRecipes = () => {
    const randomIndices = [];
    while (randomIndices.length < 3) {
      const randomIndex = Math.floor(Math.random() * recipeData.length);
      if (!randomIndices.includes(randomIndex)) {
        randomIndices.push(randomIndex);
      }
    }
    const randomRecipes = randomIndices.map((index) => recipeData[index]);
    setRandomRecipes(randomRecipes);
    setShowRandomRecipes(true);
  };

  return (
    <div className="container mx-auto p-4 overflow-hidden">
      <h1 className="text-4xl phone:text-xl font-bold mb-8 font-pacifico text-[#0039a6]">
        Tasty Temptations: Recipe Revelations
      </h1>
      <div
        className="mb-4 grid phone:grid-cols-1 tablet:grid-cols-2 
        grid-cols-3"
      >
        <div>
          <select
            value={searchCategory}
            onChange={handleCategoryChange}
            className="border border-gray-300 rounded px-4 py-2 mb-2
            focus:ring-[#6469ff] focus:border-[#6469ff] outline-none"
          >
            <option value="name">Search by Name</option>
            <option value="ingredients">Search by Ingredients</option>
          </select>
        </div>
        {/* cuisine */}
        <div>
          <label className="mr-2">Cuisine:</label>
          <select
            value={selectedCuisine}
            onChange={handleCuisineChange}
            className="border border-gray-300 rounded px-4 py-2
            focus:ring-[#6469ff] focus:border-[#6469ff] outline-none"
          >
            {cuisines.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
        </div>
        {/* meal type */}
        <div className="mb-4">
          <label className="mr-2">Meal Type:</label>
          <select
            value={selectedMealType}
            onChange={handleMealTypeChange}
            className="border border-gray-300 rounded px-4 py-2
            focus:ring-[#6469ff] focus:border-[#6469ff] outline-none"
          >
            {mealTypes.map((mealType) => (
              <option key={mealType} value={mealType}>
                {mealType}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label
        for="default-search"
        class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search
      </label>
      <div class="relative mb-8">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            class="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          type="search"
          value={searchTerm}
          id="default-search"
          onChange={handleSearchTermChange}
          className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#6469ff] focus:border-[#6469ff] outline-none block w-full p-3"
          placeholder="Search Recipes..."
          required
        />
      </div>

      {searchTerm && (
        <>
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe, index) => (
              <div key={index} className="mb-4">
                <h2 className="text-xl font-bold mb-2">{recipe.Name}</h2>
                <p className="mb-2">{recipe.Description}</p>
                <h3 className="font-poppins font-semibold text-sm phone:text-xs">
                  Ingredients:
                </h3>
                <ol>
                  {recipe.Ingredients.map((ingredient, index) => (
                    <li key={index} className="ml-4">
                      {ingredient}
                    </li>
                  ))}
                </ol>
                <button
                  onClick={handleMethod}
                  className="mt-4 inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-blue-600 border border-blue-700 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  data-rounded="rounded-md"
                  data-primary="blue-600"
                  data-primary-reset="{}"
                >
                  {!method ? "method" : "close"}
                </button>
                {method && <p>{recipe.Method}</p>}
              </div>
            ))
          ) : (
            <p>No Recipes Found!!</p>
          )}
        </>
      )}

      {!searchTerm && (
        <div className="mt-4">
          <button
            onClick={handleRandomRecipes}
            className="relative inline-flex items-center justify-start inline-block px-5 py-3 overflow-hidden font-medium transition-all 
            bg-blue-600 rounded-full hover:bg-white group mb-5"
          >
            <span class="absolute inset-0 border-0 group-hover:border-[25px] ease-linear duration-100 transition-all border-white rounded-full"></span>
            <span class="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-blue-600">
              Show Random Recipes
            </span>
          </button>
          {showRandomRecipes && randomRecipes.length > 0 && (
            <>
              <h2 className="phone:text-xl text-3xl font-bold font-pacifico mt-4 mb-2">
                Random Recipes:
              </h2>
              {randomRecipes.map((recipe, index) => (
                <div key={index} className="mb-4">
                  <h2 className="text-xl font-bold mb-2">{recipe.Name}</h2>
                  <p className="mb-2">{recipe.Description}</p>
                  <h3>Ingredients:</h3>
                  <ol>
                    {recipe.Ingredients.map((ingredient, index) => (
                      <li key={index} className="ml-4">
                        {ingredient}
                      </li>
                    ))}
                  </ol>
                  <button
                    onClick={handleMethod}
                    className="mt-4 inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap 
                    bg-blue-600 border border-blue-700 rounded-md shadow-sm hover:bg-blue-700 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-5"
                    data-rounded="rounded-md"
                    data-primary="blue-600"
                    data-primary-reset="{}"
                  >
                    {!method ? "method" : "close"}
                  </button>
                  {method && <p>{recipe.Method}</p>}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
