export const loaderEl = `
    <div class="loader">
        <img src="/assets/loader.svg" alt="loader" />
        <span>Start searching for your next career!</span>
    </div>
`;

function dateDiffText(inputDate) {
    let createdAtText = "";
    const numDaysPassed = Math.round(
        (Date.now() - new Date(inputDate)) / (1000 * 60 * 60 * 24)
    );
    if (numDaysPassed >= 14) {
        createdAtText = `${Math.round(numDaysPassed / 7)} weeks ago`;
    } else if (numDaysPassed >= 7) {
        createdAtText = `1 week ago`;
    } else if (numDaysPassed > 1) {
        createdAtText = `${numDaysPassed} days ago`;
    } else if (numDaysPassed === 1) {
        createdAtText = `1 day ago`;
    }

    return createdAtText;
}

export function createJobCard(obj) {
    const salaryText =
        obj.salary_min === obj.salary_max
            ? `¥ ${obj.salary_min}`
            : `¥ ${obj.salary_min} - ¥ ${obj.salary_max}`;

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

                <span class="amount">${salaryText}</span>
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
