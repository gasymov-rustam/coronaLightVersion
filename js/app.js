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
