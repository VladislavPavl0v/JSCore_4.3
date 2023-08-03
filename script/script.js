const inputSearch = document.querySelector("input");
const inputContainer = document.querySelector(".select");
const chosens = document.querySelector(".chosens");

chosens.addEventListener("click", function(event) {
    let target = event.target;
    if (!target.classList.contains("btn-close")) return;

    target.parentElement.remove();
});



inputContainer.addEventListener("click", function(event) {
    let target = event.target;
    if (!target.classList.contains("select-content")) {
	return;
    }
    addChosen(target);
    inputSearch.value = "";
    removePredictions();
});

function removePredictions() {
    inputContainer.innerHTML = "";
}

function showPredictions(repositories) {
    removePredictions();

    for (let repositoryIndex = 0; repositoryIndex < repositories.items.length; repositoryIndex++) {
	let name = repositories.items[repositoryIndex].name;
	let owner = repositories.items[repositoryIndex].owner.login;
	let stars = repositories.items[repositoryIndex].stargazers_count;

	let dropdownContent = `<div class="select-content" data-owner="${owner}" data-stars="${stars}">${name}</div>`;
	inputContainer.innerHTML += dropdownContent;
    }
}

function addChosen(target) {
    let name = target.textContent;
    let owner = target.dataset.owner;
    let stars = target.dataset.stars;
    
    chosens.innerHTML += `<div class="chosen">Name: ${name}<br>Owner: ${owner}<br>Stars: ${stars}<button class="btn-close"></button></div>`;
}

async function getPredictions(repositoriesPart) {
    const urlSearchRepositories = new URL("https://api.github.com/search/repositories");

    if (repositoriesPart === "") {
        removePredictions();
        return;
    }

    urlSearchRepositories.searchParams.append("q", repositoriesPart);
    urlSearchRepositories.searchParams.append("per_page", 5);

    try {
        let response = await fetch(urlSearchRepositories);
        if (response.ok) {
            let repositories = await response.json();
            showPredictions(repositories);
        } else {
            return null;
        }
    } catch(error) {
        return null;
    }
}


function debounce(fn, timeout) {
    let timer = null;

    return (...args) => {
	clearTimeout(timer);
	return new Promise((resolve) => {
	    timer = setTimeout(
		() => resolve(fn(...args)),
		timeout,
	    );
	});
    };
}

const getPredictionsDebounce = debounce(getPredictions, 500);
inputSearch.addEventListener("input", function(event) {
    getPredictionsDebounce(event.target.value);
});




