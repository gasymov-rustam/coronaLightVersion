const wrapperContainerTabsEl = document.getElementById("wrapperContainer");
const wrapperInformationEl = document.getElementById("generalInformation");
const wrapperTabsEl = document.getElementById("wrapperTabs");
const currentTime = new Date(Date.now()).toISOString().slice(0, 10);
let region = 'ukraine';
let coronaData = [];


axios.get(`https://api-covid19.rnbo.gov.ua/data?to=${currentTime}`)
    .then(res => {
        coronaData = res.data;
        renderCoronaData(wrapperContainerTabsEl, coronaData, [region])
        renderToHtmlGeneralInformation(wrapperInformationEl, coronaData, [region])
    })
    .catch(error => console.warn(error))

wrapperTabsEl.addEventListener('click', e => {
    region = e.target.dataset.region;
    Array.from(wrapperTabsEl.children).forEach(el => {
        el.classList.remove('active');
        e.target.classList.add('active')
    })
    renderCoronaData(wrapperContainerTabsEl, coronaData, [region])
    renderToHtmlGeneralInformation(wrapperInformationEl, coronaData, [region])
})

function renderCoronaData(elemForRender, dataArray, smartKey) {
    elemForRender.innerHTML = createDataArr(dataArray, smartKey).join('');
}

function createDataArr(dataArray, smartKey) {
    return dataArray[smartKey].map((field) => createDataField(field));
}

function createDataField(array) {
    return `<dl class="wrapper-data">
            <dt class="wrapper-data__country">${array?.label?.uk}</dt>
            <dd class="wrapper-data__confirmed">
              <p>${array?.confirmed}</p>
              ${createDataDifference(array, ['delta_confirmed'])}
            </dd>
            <dd class="wrapper-data__deaths">
                <p>${array?.deaths}</p>
                ${createDataDifference(array, ['delta_deaths'])}
            </dd>
            <dd class="wrapper-data__recovered">
                <p>${array?.recovered}</p>
                ${createDataDifference(array, ['delta_recovered'])}
            </dd>
            <dd class="wrapper-data__existing">
                <p>${array?.existing}</p>
                ${createDataDifference(array, ['delta_existing'])}
            </dd>
          </dl>`;
}

function createDataDifference(array, smartKey) {
    let difference = '';
    if (array[smartKey] > 0) difference = `<p><i class="fas fa-arrow-up"></i> ${array[smartKey]}</p>`;
    if (array[smartKey] < 0) difference = `<p><i class="fas fa-arrow-down"></i></i> ${array[smartKey]}</p>`;
    if (array[smartKey] === 0) difference = `<p> - </p>`;
    return difference;
}

function renderToHtmlGeneralInformation(element, array, region) {
    element.innerHTML = createHtmlGeneralInformation(array, region);
}

function createHtmlGeneralInformation(array, region) {
    return `<div class="general-information__confirmed">
                <p>Виявлено:</p>
                <p>${createGeneralInformation(array, region, 'confirmed')}</p>
                ${createGeneralDifference(array, region, 'delta_confirmed')}
            </div>
            <div class="general-information__deaths">
                <p>Померло:</p>
                <p>${createGeneralInformation(array, region, 'deaths')}</p>
                ${createGeneralDifference(array, region, 'delta_deaths')}
            </div>
            <div class="general-information__recovered">
                <p>Одужали:</p>
                <p>${createGeneralInformation(array, region, 'recovered')}</p>
                ${createGeneralDifference(array, region, 'delta_recovered')}
            </div>
            <div class="general-information__existing">
                <p>Выздровили:</p>
                <p>${createGeneralInformation(array, region, 'existing')}</p>
                ${createGeneralDifference(array, region, 'delta_existing')}
            </div>`
}

function createGeneralDifference(array, region, smartKey) {
    let difference = '';
    if (createGeneralInformation(array, region, smartKey) > 0) difference = `<p class="general-information__differnce"><i class="fas fa-arrow-up"></i> ${createGeneralInformation(array, region, smartKey)}</p>`;
    if (createGeneralInformation(array, region, smartKey) < 0) difference = `<p class="general-information__differnce"><i class="fas fa-arrow-down"></i></i> ${createGeneralInformation(array, region, smartKey)}</p>`;
    if (createGeneralInformation(array, region, smartKey) === 0) difference = `<p class="general-information__differnce"> - </p>`;
    return difference;
}

function createGeneralInformation(array, region, smartKey) {
    return array[region].reduce((total, item) => {
        total += item[smartKey]
        return total;
    }, 0)
}
