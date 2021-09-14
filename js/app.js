const wrapperContainerTabsEl = document.getElementById("wrapperContainer");
const wrapperInformationEl = document.getElementById("generalInformation");
const wrapperTabsEl = document.getElementById("wrapperTabs");
const searchFormEl = document.getElementById("searchFormEl");
const wrapperBtn = document.getElementById("wrapperSort");
const currentTime = new Date(Date.now()).toISOString().slice(0, 10);
let region = 'ukraine';
let coronaData = [];
let newCoronaData = [];

let counter = 0;
let order = 1;

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
  searchFormEl.reset();
  renderCoronaData(wrapperContainerTabsEl, coronaData, [region])
  renderToHtmlGeneralInformation(wrapperInformationEl, coronaData, [region])
  let newarr = coronaData[region];
  console.log(newarr.sort(sortTo(newarr, ['confirmed'], -1)));
})



function renderCoronaData(elemForRender, dataArray, region) {
  elemForRender.innerHTML = createDataArr(dataArray, region).join('');
}

function createDataArr(dataArray, region) {
  if (Array.isArray(dataArray)) return dataArray.map((field) => createDataField(field));
  else return dataArray[region].map((field) => createDataField(field));
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
  if (array[smartKey] > 0) difference = `<p  class="wrapper-data__delta"><i class="fas fa-arrow-up"></i> ${array[smartKey]}</p>`;
  if (array[smartKey] < 0) difference = `<p  class="wrapper-data__delta"><i class="fas fa-arrow-down"></i></i> ${array[smartKey]}</p>`;
  if (array[smartKey] === 0) difference = `<p  class="wrapper-data__delta"> - </p>`;
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

searchFormEl.addEventListener('keyup', e => {
  e.preventDefault();
  const searchField = ['uk', 'en'];
  const query = String(e.target.value.trim().toLowerCase().split(' ').filter(word => !!word).slice(0, 1));
  newCoronaData = coronaData[region].filter(country => {
    return searchField.some(field => {
      return String(country.label[field]).toLowerCase().includes(query)
    })
  })
  renderCoronaData(wrapperContainerTabsEl, newCoronaData)
})

function sortTo(arr, smartKey, order) {
  if (typeof arr[0][smartKey]['uk'] === "string") {
    return (a, b) => a[smartKey]['uk'].localeCompare(b[smartKey]['uk']) * order;
  } else {
    return (a, b) => (a[smartKey] - b[smartKey]) * order;
  }
}

wrapperBtn.addEventListener('click', e => {
  const key = e.target.value;
  const inscriptionSort = e.target.dataset.select;
  let newCorona = coronaData[region];
  
  Array.from(wrapperBtn.children).forEach(item => {
    // let a = item.innerHTML
  })

  if (key === 'label' && order > 0) {
    newCorona.sort(sortTo(newCorona, [key], order))
    renderCoronaData(wrapperContainerTabsEl, newCorona, [region]);
    order = -1;
    e.target.innerHTML = `<i class="fas fa-arrow-up"></i> ${inscriptionSort}`;
  } else if (key === 'label' && order < 0) {
    newCorona.sort(sortTo(newCorona, [key], order))
    renderCoronaData(wrapperContainerTabsEl, newCorona, [region]);
    order = 1;
    e.target.innerHTML = `<i class="fas fa-arrow-down"></i> ${inscriptionSort}`;
  } else if (key === 'confirmed' && order > 0) {
    newCorona.sort(sortTo(newCorona, [key], order))
    renderCoronaData(wrapperContainerTabsEl, newCorona, [region]);
    order = -1;
    e.target.innerHTML = `<i class="fas fa-arrow-down"></i> ${inscriptionSort}`;
  } else if (key === 'confirmed' && order < 0) {
    newCorona.sort(sortTo(newCorona, [key], order))
    renderCoronaData(wrapperContainerTabsEl, newCorona, [region]);
    order = 1;
    e.target.innerHTML = `<i class="fas fa-arrow-up"></i> ${inscriptionSort}`;
  }
})