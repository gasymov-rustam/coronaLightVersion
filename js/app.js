const wrapperContainerTabsEl = document.getElementById("wrapperContainer");
const wrapperInformationEl = document.getElementById("generalInformation");
const wrapperTabsEl = document.getElementById("wrapperTabs");
const searchFormEl = document.getElementById("searchFormEl");
const wrapperBtn = document.getElementById("wrapperSort");
const currentTime = new Date().toJSON().slice(0, 10);
let region = "ukraine";
let coronaData = {};
let newCoronaData = [];

let order = 1;

axios
    .get(`https://api-covid19.rnbo.gov.ua/data?to=${currentTime}`)
    .then((res) => {
        coronaData = res.data;
        renderCoronaData(wrapperContainerTabsEl, coronaData[region]);
        renderToHtmlGeneralInformation(wrapperInformationEl, coronaData[region]);
    })
    .catch((error) => console.warn(error));

wrapperTabsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (btn) {
        region = btn.dataset.region;
        Array.from(wrapperTabsEl.children).forEach((el) => {
            el.classList.remove("active");
            btn.classList.add("active");
        });
        searchFormEl.reset();
        renderCoronaData(wrapperContainerTabsEl, coronaData[region]);
        renderToHtmlGeneralInformation(wrapperInformationEl, coronaData[region])
    }
});

function renderCoronaData(elemForRender, array) {
    elemForRender.innerHTML = createDataArr(array).join("");
}

function createDataArr(array) {
    return array.map((field) => createDataField(field));
}

function createDataField(array) {
    return `<dl class="wrapper-data">
            <dt class="wrapper-data__country">${array?.label?.uk}</dt>
            <dd class="wrapper-data__confirmed">
              <p>${array?.confirmed}</p>
              <p  class="wrapper-data__delta">${createDataDifference(array["delta_confirmed"])}</p>
            </dd>
            <dd class="wrapper-data__deaths">
                <p>${array?.deaths}</p>
                <p  class="wrapper-data__delta">${createDataDifference(array["delta_deaths"])}</p>
            </dd>
            <dd class="wrapper-data__recovered">
                <p>${array?.recovered}</p>
                <p  class="wrapper-data__delta">${createDataDifference(array["delta_recovered"])}</p>
            </dd>
            <dd class="wrapper-data__existing">
                <p>${array?.existing}</p>
                <p  class="wrapper-data__delta">${createDataDifference(array["delta_existing"])}</p>
            </dd>
          </dl>`;
}

function createDataDifference(count) {
    return `${count ? `<i class="fas fa-arrow-${count > 0 ? "up" : "down"}"></i> ${count}` : "-"}`;
}

function renderToHtmlGeneralInformation(element, array) {
    element.innerHTML = createHtmlGeneralInformation(array);
}

function createHtmlGeneralInformation(array) {
    return `<div class="general-information__confirmed">
                <p>Виявлено:</p>
                <p>${createGeneralInformation(array, "confirmed")}</p>
                <p  class="wrapper-data__delta">${createDataDifference(createGeneralInformation(array, "delta_confirmed"))}</p>     
            </div>
            <div class="general-information__deaths">
                <p>Померло:</p>
                <p>${createGeneralInformation(array, "deaths")}</p>
                <p  class="wrapper-data__delta">${createDataDifference(createGeneralInformation(array, "delta_deaths"))}</p>     
            </div>
            <div class="general-information__recovered">
                <p>Одужали:</p>
                <p>${createGeneralInformation(array, "recovered")}</p>
                <p  class="wrapper-data__delta">${createDataDifference(createGeneralInformation(array, "delta_recovered"))}</p>     
            </div>
            <div class="general-information__existing">
                <p>Выздровили:</p>
                <p>${createGeneralInformation(array, "existing")}</p>
                <p  class="wrapper-data__delta">${createDataDifference(createGeneralInformation(array, "delta_existing"))}</p>     
            </div>`;
}

function createGeneralInformation(array, key) {
    return array.reduce((total, item) => {
        total += item[key];
        return total;
    }, 0);
}

searchFormEl.addEventListener("keyup", (e) => {
    e.preventDefault();
    const searchField = ["uk", "en"];
    const query = String(
        e.target.value
            .trim()
            .toLowerCase()
            .split(" ")
            .filter((word) => !!word)
            .slice(0, 1)
    );
    newCoronaData = coronaData[region].filter((country) => {
        return searchField.some((field) => {
            return String(country.label[field]).toLowerCase().includes(query);
        });
    });
    renderCoronaData(wrapperContainerTabsEl, newCoronaData);
});

function sortTo(arr, key, order) {
    if (typeof arr[0][key]["uk"] === "string") {
        return (a, b) => a[key]["uk"].localeCompare(b[key]["uk"]) * order;
    } else {
        return (a, b) => (a[key] - b[key]) * order;
    }
}

wrapperBtn.addEventListener("click", (e) => {
    const currentBtn = e.target.closest('button');
    if(currentBtn){
        const key = e.target.value;
        const inscriptionSort = e.target.dataset.select;
        Array.from(wrapperBtn.children).forEach((btn) => {
            const btnName = btn.dataset.select;
            btn.innerHTML = `${btnName}`;
        });
        coronaData[region].sort(sortTo(coronaData[region], [key], order));
        renderCoronaData(wrapperContainerTabsEl, coronaData[region]);
        order *= -1;
        e.target.innerHTML = `<i class="fas fa-arrow-${order > 0 ? "down" : "up"}"></i> ${inscriptionSort}`;
    }
});
