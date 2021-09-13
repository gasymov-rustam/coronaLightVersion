const wrapperTabsEl = document.getElementById("wrapperTabs");
const wrapperContainerTabsEl = document.getElementById("wrapperContainer");

wrapperTabsEl.addEventListener('click', e => {
  const region = e.target.dataset.region;
  console.log(region);
})