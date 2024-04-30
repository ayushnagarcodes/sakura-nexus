const translateBtnEl = document.getElementById("btn-translate");
let currentLang = "en";

function googleTranslateElementInit() {
    new google.translate.TranslateElement(
        {
            pageLanguage: "en",
            includedLanguages: "en,ja",
            // autoDisplay: false,
        },
        "google-translate"
    );
}

translateBtnEl.addEventListener("click", () => {
    currentLang === "en" ? (currentLang = "ja") : (currentLang = "en");

    // Changing language explicitly
    const googleTranslateField = document.querySelector(
        "#google-translate select"
    );
    if (!googleTranslateField) location.reload();
    googleTranslateField.value = currentLang;
    googleTranslateField.dispatchEvent(new Event("change"));

    if (googleTranslateField.value === "") {
        googleTranslateField.value = currentLang;
        googleTranslateField.dispatchEvent(new Event("change"));
    }
});
