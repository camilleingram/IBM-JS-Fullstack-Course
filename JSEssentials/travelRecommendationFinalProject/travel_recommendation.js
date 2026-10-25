let travelData = null;

fetch("travel_recommendation_api.json")
    .then(function (response) {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(function (data) {
        travelData = data;
        console.log(data); 
    })
    .catch(function (error) {
        console.error("Error fetching travel data:", error);
    });


const timeZones = {
    "Sydney, Australia": "Australia/Sydney",
    "Melbourne, Australia": "Australia/Melbourne",
    "Tokyo, Japan": "Asia/Tokyo",
    "Kyoto, Japan": "Asia/Tokyo",
    "Rio de Janeiro, Brazil": "America/Sao_Paulo",
    "São Paulo, Brazil": "America/Sao_Paulo",
    "Angkor Wat, Cambodia": "Asia/Phnom_Penh",
    "Taj Mahal, India": "Asia/Kolkata",
    "Bora Bora, French Polynesia": "Pacific/Tahiti",
    "Copacabana Beach, Brazil": "America/Sao_Paulo"
};

function getLocalTime(placeName) {
    const zone = timeZones[placeName];
    if (!zone) {
        return "";
    }
    const options = {
        timeZone: zone,
        hour12: true,
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
    };
    return new Date().toLocaleTimeString("en-US", options);
}


function createCard(place) {
    const card = document.createElement("div");
    card.className = "result-card";

    const time = getLocalTime(place.name);
    const timeHtml = time
        ? '<p class="local-time">Local time: <span class="time-value" data-place="' + place.name + '">' + time + "</span></p>"
        : "";

    card.innerHTML =
        '<img src="' + place.imageUrl + '" alt="' + place.name + '">' +
        '<div class="result-info">' +
        "<h3>" + place.name + "</h3>" +
        "<p>" + place.description + "</p>" +
        timeHtml +
        "</div>";

    return card;
}

function searchRecommendations() {
    const resultsSection = document.getElementById("results");
    const keyword = document.getElementById("searchInput").value.trim().toLowerCase();

    resultsSection.innerHTML = "";

    if (keyword === "") {
        return;
    }

    if (!travelData) {
        resultsSection.innerHTML = '<p class="no-results">Data is still loading. Please try again.</p>';
        return;
    }

    let matches = [];

    
    if (keyword === "beach" || keyword === "beaches") {
        matches = travelData.beaches;
    }
   
    else if (keyword === "temple" || keyword === "temples") {
        matches = travelData.temples;
    }
    
    else if (keyword === "country" || keyword === "countries") {
        travelData.countries.forEach(function (country) {
            matches = matches.concat(country.cities);
        });
    } else {
        const country = travelData.countries.find(function (c) {
            return c.name.toLowerCase() === keyword;
        });
        if (country) {
            matches = country.cities;
        }
    }

    if (matches.length === 0) {
        resultsSection.innerHTML = '<p class="no-results">No recommendations found. Try "beach", "temple" or "country".</p>';
        return;
    }

    matches.forEach(function (place) {
        resultsSection.appendChild(createCard(place));
    });
}


function clearResults() {
    document.getElementById("results").innerHTML = "";
    document.getElementById("searchInput").value = "";
}


document.getElementById("searchBtn").addEventListener("click", searchRecommendations);
document.getElementById("resetBtn").addEventListener("click", clearResults);


setInterval(function () {
    document.querySelectorAll(".time-value").forEach(function (el) {
        el.textContent = getLocalTime(el.getAttribute("data-place"));
    });
}, 1000);