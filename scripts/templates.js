export const loaderEl = `
    <div class="loader">
        <img src="/assets/loader.svg" alt="loader" />
        <span>Start searching for your next career!</span>
    </div>
`;

function dateDiffText(inputDate) {
    let createdAtText = "";
    const numDaysPassed = Math.round(
        (Date.now() - Date.parse(inputDate)) / (1000 * 60 * 60 * 24)
    );

    if (numDaysPassed >= 14) {
        createdAtText = `${Math.round(numDaysPassed / 7)} weeks ago`;
    } else if (numDaysPassed >= 7) {
        createdAtText = `1 week ago`;
    } else if (numDaysPassed > 1) {
        createdAtText = `${numDaysPassed} days ago`;
    } else {
        createdAtText = `1 day ago`;
    }

    return createdAtText;
}

function salaryText(currency, salary_min, salary_max) {
    const formatter = new Intl.NumberFormat(navigator.language, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    });

    const formattedSalaryMin = formatter.format(Math.round(salary_min));
    const formattedSalaryMax = formatter.format(Math.round(salary_max));

    return salary_min === salary_max
        ? formattedSalaryMin
        : `${formattedSalaryMin} - ${formattedSalaryMax}`;
}

export function createJobCard(obj, currency) {
    return `
        <article class="job-card">
            <span class="title">${obj.title}</span>

            <div class="details">
                <div class="company text-with-icon">
                    <img
                        src="/assets/icons/Office.svg"
                        alt="office icon"
                    />
                    <span>${obj.company.display_name}</span>
                </div>

                <div class="location text-with-icon">
                    <img
                        src="/assets/icons/Location.svg"
                        alt="location icon"
                    />
                    <span>${obj.location.display_name}</span>
                </div>
            </div>

            <div class="salary">
                <div class="salary-heading text-with-icon">
                    <img
                        src="/assets/icons/Money.svg"
                        alt="money icon"
                    />
                    <span>Annual salary</span>
                </div>

                <span class="amount">${salaryText(
                    currency,
                    obj.salary_min,
                    obj.salary_max
                )}</span>
            </div>

            <div class="card-footer">
                <div class="created-at text-with-icon">
                    <img
                        src="/assets/icons/Clock.svg"
                        alt="clock icon"
                    /><span>${dateDiffText(obj.created)}</span>
                </div>

                <button class="btn-view-details">
                    <img src="/assets/icons/Eye.svg" alt="eye icon" />
                    <span>View</span>
                </button>
            </div>
        </article>
    `;
}

export function createJobInfoEl(obj, currency) {
    return `
        <div class="job-info-container">
            <h1 class="title">${obj.title}</h1>

            <div class="details">
                <div class="company text-with-icon">
                    <img src="/assets/icons/Office.svg" alt="office icon" />
                    <span>${obj.company.display_name}</span>
                </div>

                <div class="location text-with-icon">
                    <img
                        src="/assets/icons/Location.svg"
                        alt="location icon"
                    />
                    <span>${obj.location.display_name}</span>
                </div>
            </div>

            <div class="info-flex">
                <div class="salary">
                    <div class="salary-heading text-with-icon">
                        <img
                            src="/assets/icons/Money.svg"
                            alt="money icon"
                        />
                        <span>Annual salary</span>
                    </div>

                    <span class="amount">${salaryText(
                        currency,
                        obj.salary_min,
                        obj.salary_max
                    )}</span>
                </div>

                <div class="created-at text-with-icon">
                    <img
                        src="/assets/icons/Clock.svg"
                        alt="clock icon"
                    /><span>${dateDiffText(obj.created)}</span>
                </div>
            </div>

            <h2>Job Description</h2>
            <p>
                ${obj.description}
            </p>
        </div>
    `;
}

export function createPaginationEl(currentPage, totalPages) {
    return `
        <div class="pagination">
            <button id="btn-previous-page">
                <img
                    src="/assets/icons/CaretLeft.svg"
                    alt="left arrow icon"
                />
            </button>
            <p>
                <span id="current-page">${currentPage}</span>
                /
                <span id="total-pages">${totalPages}</span>
            </p>
            <button id="btn-next-page">
                <img
                    src="/assets/icons/CaretRight.svg"
                    alt="right arrow icon"
                />
            </button>
        </div>
    `;
}
