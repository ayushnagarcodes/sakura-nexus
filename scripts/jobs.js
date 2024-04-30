import { loaderEl, createJobCard } from "./template.js";

const jobListEl = document.querySelector(".job-list-section");
const formEl = document.querySelector(".filter-form");
const inputKeywordEl = document.getElementById("keyword");
const inputLocationEl = document.getElementById("location");
const inputSalaryEl = document.getElementById("salary");
const btnLocate = document.getElementById("btn-locate");
let countryCode = "gb";
let region = "london";

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

        let url = `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/1?app_id=1cf5c31c&app_key=4177290149d2c1dc2d5005d757653e3f&results_per_page=10`;

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

        url += "&full_time=1&permanent=1&content-type=application/json";

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

function renderUI(dataArr) {
    // Remove Loader
    jobListEl.innerHTML = "";

    // Add Job Cards
    dataArr.forEach((obj) => {
        const jobCardEl = createJobCard(obj);
        jobListEl.insertAdjacentHTML("beforeend", jobCardEl);
    });
}

// Handling Filter Form Submit
formEl.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Activate Loader
    jobListEl.innerHTML = "";
    jobListEl.insertAdjacentHTML("afterbegin", loaderEl);
    document.querySelector(".loader").classList.add("active");

    // Validate Input
    const { validateStatus, err } = validateInput();

    // Get Location info + Jobs data
    try {
        if (validateStatus) {
            const url = await createURL();
            const data = await getJobList(url);
            renderUI(data.results);
        }
    } catch (err) {
        alert(err.message);
    } finally {
        // Deactivate Loader
        document.querySelector(".loader")?.classList.remove("active");
    }
});

// Get User Location
btnLocate.addEventListener("click", (e) => {
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
});

// On Window Load
addEventListener("load", () => {
    if (location.hash) {
        return;
    }
    // Add the Loader
    jobListEl.innerHTML = "";
    jobListEl.insertAdjacentHTML("afterbegin", loaderEl);
});
