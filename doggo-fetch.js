const RANDOM_IMG_ENDPOINT = "https://dog.ceo/api/breeds/image/random";

const BREEDS = [
  "affenpinscher",
  "african",
  "airedale",
  "akita",
  "appenzeller",
  "shepherd australian",
  "basenji",
  "beagle",
  "bluetick",
  "borzoi",
  "bouvier",
  "boxer",
  "brabancon",
  "briard",
  "norwegian buhund",
  "boston bulldog",
  "english bulldog",
  "french bulldog",
  "staffordshire bullterrier",
  "australian cattledog",
  "chihuahua",
  "chow",
  "clumber",
  "cockapoo",
  "border collie",
  "coonhound",
  "cardigan corgi",
  "cotondetulear",
  "dachshund",
  "dalmatian",
  "great dane",
  "scottish deerhound",
  "dhole",
  "dingo",
  "doberman",
  "norwegian elkhound",
  "entlebucher",
  "eskimo",
  "lapphund finnish",
  "bichon frise",
  "germanshepherd",
  "italian greyhound",
  "groenendael",
  "havanese",
  "afghan hound",
  "basset hound",
  "blood hound",
  "english hound",
  "ibizan hound",
  "plott hound",
  "walker hound",
  "husky",
  "keeshond",
  "kelpie",
  "komondor",
  "kuvasz",
  "labradoodle",
  "labrador",
  "leonberg",
  "lhasa",
  "malamute",
  "malinois",
  "maltese",
  "bull mastiff",
  "english mastiff",
  "tibetan mastiff",
  "mexicanhairless",
  "mix",
  "bernese mountain",
  "swiss mountain",
  "newfoundland",
  "otterhound",
  "caucasian ovcharka",
  "papillon",
  "pekinese",
  "pembroke",
  "miniature pinscher",
  "pitbull",
  "german pointer",
  "germanlonghair pointer",
  "pomeranian",
  "medium poodle",
  "miniature poodle",
  "standard poodle",
  "toy poodle",
  "pug",
  "puggle",
  "pyrenees",
  "redbone",
  "chesapeake retriever",
  "curly retriever",
  "flatcoated retriever",
  "golden retriever",
  "rhodesian ridgeback",
  "rottweiler",
  "saluki",
  "samoyed",
  "schipperke",
  "giant schnauzer",
  "miniature schnauzer",
  "english setter",
  "gordon setter",
  "irish setter",
  "sharpei",
  "english sheepdog",
  "shetland sheepdog",
  "shiba",
  "shihtzu",
  "blenheim spaniel",
  "brittany spaniel",
  "cocker spaniel",
  "irish spaniel",
  "japanese spaniel",
  "sussex spaniel",
  "welsh spaniel",
  "english springer",
  "stbernard",
  "american terrier",
  "australian terrier",
  "bedlington terrier",
  "border terrier",
  "cairn terrier",
  "dandie terrier",
  "fox terrier",
  "irish terrier",
  "kerryblue terrier",
  "lakeland terrier",
  "norfolk terrier",
  "norwich terrier",
  "patterdale terrier",
  "russell terrier",
  "scottish terrier",
  "sealyham terrier",
  "silky terrier",
  "tibetan terrier",
  "toy terrier",
  "welsh terrier",
  "westhighland terrier",
  "wheaten terrier",
  "yorkshire terrier",
  "tervuren",
  "vizsla",
  "spanish waterdog",
  "weimaraner",
  "whippet",
  "irish wolfhound",
];

// Utility function to get a randomly selected item from an array
function getRandomElement(array) {
  const i = Math.floor(Math.random() * array.length);
  return array[i];
}

// Utility function to shuffle the order of items in an array in-place
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Given an array of possible answers, a correct answer value, and a number of choices to get,
// return a list of that many choices, including the correct answer and others from the array
function getMultipleChoices(n, correctAnswer, array) {
  const choices = [correctAnswer];
  while (choices.length < n) {
    let candidate = getRandomElement(array);
    if (choices.indexOf(candidate) < 0) {
      choices.push(candidate);
    }
  }
  return shuffleArray(choices);
}

// Given a URL such as "https://images.dog.ceo/breeds/poodle-standard/n02113799_2280.jpg"
// return the breed name string as formatted in the breed list, e.g. "standard poodle"
function getBreedFromURL(url) {
  const [, path] = url.split("/breeds/");
  const [breedID] = path.split("/");
  const parts = breedID.split("-");
  if (parts.length === 2) {
    // e.g. poodle-standard -> standard poodle
    return `${parts[1]} ${parts[0]}`;
  } else {
    return parts[0];
  }
}

// Given a URL, fetch the resource at that URL, parse JSON, return the "message" property
async function fetchMessage(url) {
  const response = await fetch(url);
  const { message } = await response.json();
  return message;
}

// Add the multiple-choice buttons to the page
function renderButtons(choicesArray, correctAnswer) {
  function buttonHandler(e) {
    // Prevent multiple answers per refresh
    const alreadyAnswered = Array.from(
      document.querySelectorAll("#options button")
    ).some(
      (btn) =>
        btn.classList.contains("correct") || btn.classList.contains("incorrect")
    );
    if (alreadyAnswered) return;

    if (e.target.value === correctAnswer) {
      e.target.classList.add("correct");
    } else {
      e.target.classList.add("incorrect");
      const correctBtn = Array.from(
        document.querySelectorAll("#options button")
      ).find((btn) => btn.value === correctAnswer);
      if (correctBtn) correctBtn.classList.add("correct");
    }
  }

  const options = document.getElementById("options");
  options.innerHTML = ""; // Clear previous buttons
  choicesArray.forEach((choice) => {
    let button = document.createElement("button");
    button.value = button.name = button.textContent = choice;
    button.addEventListener("click", buttonHandler);
    options.appendChild(button);
  });
}

// Show the quiz content
function renderQuiz(imgUrl, correctAnswer, choices) {
  const image = document.createElement("img");
  image.setAttribute("src", imgUrl);
  const frame = document.getElementById("image-frame");
  frame.textContent = ""; // Clear previous

  image.addEventListener("load", () => {
    frame.replaceChildren(image);
    renderButtons(choices, correctAnswer);
  });
  // In case image is cached and fires instantly
  if (image.complete) {
    frame.replaceChildren(image);
    renderButtons(choices, correctAnswer);
  } else {
    frame.textContent = "Loading image...";
  }
}

// Load and display quiz data
async function startQuiz() {
  document.getElementById("image-frame").textContent = "Fetching doggo...";
  document.getElementById("options").innerHTML = "";

  try {
    const doggoImgUrl = await fetchMessage(RANDOM_IMG_ENDPOINT);
    const correctBreed = getBreedFromURL(doggoImgUrl);
    const breedChoices = getMultipleChoices(3, correctBreed, BREEDS);
    renderQuiz(doggoImgUrl, correctBreed, breedChoices);
  } catch (err) {
    document.getElementById("image-frame").textContent =
      "Failed to fetch doggo. Try again!";
    document.getElementById("options").innerHTML = "";
  }
}

// Add event listener for refresh and start first quiz
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("refresh-btn").addEventListener("click", startQuiz);
  startQuiz();
});
