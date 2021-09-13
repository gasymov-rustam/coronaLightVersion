const wrapperTabsEl = document.getElementById("wrapperTabs");
const wrapperContainerTabsEl = document.getElementById("wrapperContainer");
const currentTime = new Date(Date.now()).toISOString().slice(0, 10);
let data = [];


axios.get(`https://api-covid19.rnbo.gov.ua/data?to=${currentTime}`)
  .then(res => {
    data = res.data;
    console.log(data);
  })
  .catch(error => console.warn(error))

wrapperTabsEl.addEventListener('click', e => {
  const region = e.target.dataset.region;
  console.log(region);
})

function renderCoronaDataFirst(elemForRender, dataArray) {
  elemForRender.innerHTML = createDataArrFirst(dataArray).join('');
}

function createDataArrFirst(dataArray) {
  return dataArray.map((field) => createDataFieldFirst(field));
}

function createDataFieldFirst(field) {
  return `<dl class="wrapper-data">
            <dt class="wrapper-data__country">${field?.label?.uk}</dt>
            <dd class="wrapper-data__confirmed">
              ${field?.confirmed}
            </dd>
            <dd class="wrapper-data__deaths">${field?.deaths}</dd>
            <dd class="wrapper-data__recovered">${field?.recovered}</dd>
            <dd class="wrapper-data__existing">${field?.existing}</dd>
          </dl>`;
}
