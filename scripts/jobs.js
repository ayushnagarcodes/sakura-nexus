import { loaderEl, createJobCard, createPaginationEl } from "./templates.js";

// DOM Elements
const jobListEl = document.querySelector(".job-list-section");
const formEl = document.querySelector(".filter-form");
const inputKeywordEl = document.getElementById("keyword");
const inputLocationEl = document.getElementById("location");
const inputSalaryEl = document.getElementById("salary");
const btnLocate = document.getElementById("btn-locate");

// Global Constants
let countryCode = "gb";
let region = "london";
let url = "";
let currentPage = 1;
let totalPages = null;
const JOBS_PER_PAGE = 10;

// App Functions
function activateLoader() {
    jobListEl.innerHTML = "";
    jobListEl.insertAdjacentHTML("afterbegin", loaderEl);
    document.querySelector(".loader").classList.add("active");
}

function deactivateLoader() {
    document.querySelector(".loader")?.classList.remove("active");
}

function validateInput() {
    const keyword = inputKeywordEl.value;
    const location = inputLocationEl.value;
    const salary = inputSalaryEl.value === "" ? 0 : inputSalaryEl.value;

    if (!keyword && !location && !salary) {
        return {
            validateStatus: false,
            err: "🧐 Enter at least 1 input!",
        };
    }

    if (isNaN(Number(salary)) || Number(salary) < 0) {
        return {
            validateStatus: false,
            err: "🧐 Invalid salary!",
        };
    }

    return {
        validateStatus: true,
    };
}

async function getCountryCode(region) {
    try {
        const res = await fetch(
            `https://geocode.xyz/${region}?geoit=json&auth=161224511659307274977x38979`
        );
        if (!res.ok) {
            throw new Error("💥 Something went wrong!");
        }

        const data = await res.json();

        return data.standard.prov.toLowerCase();
    } catch (err) {
        throw new Error("🧐 Could not get your position!");
    }
}

async function createURL() {
    try {
        let keyword = inputKeywordEl.value;
        const location = inputLocationEl.value;
        const salary = inputSalaryEl.value;

        // Getting countryCode, if user provided location
        if (location) {
            countryCode = await getCountryCode(location);
        }

        // Building URL
        url = `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/${currentPage}?app_id=1cf5c31c&app_key=4177290149d2c1dc2d5005d757653e3f&results_per_page=${JOBS_PER_PAGE}`;

        if (keyword) {
            if (keyword.includes(" ")) {
                keyword = keyword.split(" ").join("%20");
            }
            url += `&what=${keyword.toLowerCase()}`;
        }

        location
            ? (url += `&where=${location.toLowerCase()}`)
            : (url += `&where=${region}`);

        salary ? (url += `&salary_min=${salary}`) : (url += `&salary_min=0`);

        url += "&sort_by=date&content-type=application/json";

        return url;
    } catch (err) {
        throw new Error(err.message);
    }
}

async function getJobList(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (!res.ok) {
            throw new Error(
                `💥 Something went wrong!\n${data.exception}: ${data.display}`
            );
        }

        data.fetchStatus = true;

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

function renderUI({ count, results }) {
    // Remove Loader
    jobListEl.innerHTML = "";

    // Add Job Cards
    results.forEach((obj) => {
        const jobCardEl = createJobCard(obj);
        jobListEl.insertAdjacentHTML("beforeend", jobCardEl);
    });

    // Add Pagination
    totalPages = Math.ceil(count / JOBS_PER_PAGE);
    jobListEl.insertAdjacentHTML(
        "beforeend",
        createPaginationEl(currentPage, totalPages)
    );

    // Adding Event Listener to Pagination Buttons
    document
        .getElementById("btn-previous-page")
        .addEventListener("click", handlePreviousPage);
    document
        .getElementById("btn-next-page")
        .addEventListener("click", handleNextPage);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    activateLoader();

    // Validate Input
    const { validateStatus, err } = validateInput();
    if (!validateStatus) {
        deactivateLoader();
        return alert(err);
    }

    // Get Location info + Jobs data
    try {
        if (validateStatus) {
            // Resetting currentPage
            currentPage = 1;

            const url = await createURL();
            const data = await getJobList(url);

            // If no results found, throw an error
            if (data.count === 0) {
                throw new Error(
                    "👀 No jobs found in this area! Please enter a different location."
                );
            }

            renderUI(data);
        }
    } catch (err) {
        alert(err.message);
    } finally {
        deactivateLoader();
    }
}

async function getUserLocation(e) {
    e.preventDefault();

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            btnLocate.disabled = true;
            const { latitude, longitude } = position.coords;

            // Reverse Geocoding to get countryCode and region
            try {
                const res = await fetch(
                    `https://geocode.xyz/${latitude},${longitude}?geoit=json&auth=161224511659307274977x38979`
                );
                if (!res.ok) {
                    throw new Error("💥 Something went wrong!");
                }

                const data = await res.json();

                inputLocationEl.value = data.city;
                countryCode = data.prov.toLowerCase();
                region = data.city.toLowerCase();
            } catch (err) {
                alert("🧐 Could not get your position!");
            } finally {
                btnLocate.disabled = false;
            }
        },
        () => alert("🧐 Could not get your position!")
    );
}

function initializeApp() {
    if (location.hash) {
        return;
    }

    // Add the Loader
    jobListEl.innerHTML = "";
    jobListEl.insertAdjacentHTML("afterbegin", loaderEl);
}

async function getPage() {
    try {
        activateLoader();
        const data = await getJobList(url);
        renderUI(data);
    } catch (err) {
        alert(err.message);
    } finally {
        deactivateLoader();
    }
}

function handlePreviousPage(e) {
    e.target.parentElement.disabled = true;
    if (currentPage > 1) {
        scroll(0, 0);
        currentPage -= 1;

        // Create new URL -
        // replacing page number between 'search/' and '?' in the URL with currentPage
        url = url.replace(/search\/([^?]+)\?/, `search/${currentPage}?`);
        getPage();
    }
    e.target.parentElement.disabled = false;
}

function handleNextPage(e) {
    e.target.parentElement.disabled = true;
    if (currentPage + 1 <= totalPages) {
        scroll(0, 0);
        currentPage += 1;

        // Create new URL
        url = url.replace(/search\/([^?]+)\?/, `search/${currentPage}?`);
        getPage();
    }
    e.target.parentElement.disabled = false;
}

// Events
addEventListener("load", initializeApp);
formEl.addEventListener("submit", handleFormSubmit);
btnLocate.addEventListener("click", getUserLocation);
