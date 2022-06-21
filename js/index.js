const searchWrapper = document.querySelector('.search__form');
const inputBox = searchWrapper.querySelector('.search__input');
const suggBox = searchWrapper.querySelector('.search__box');
const searchList = document.querySelector('.search__list');

const debounce = (fn, debounceTime) => {
  let timeout;
  return function () {
    const fnCall = () => {
      return fn.apply(this, arguments);
    };
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, debounceTime);
  };
};

function searchRepositories(e) {
  const searchRepositoriesName = e.target.value;
  if (searchRepositoriesName) {
    search(searchRepositoriesName)
    .then(data => {
      return data.items;
    })
    .then(items => {
      const itemsArr = items.filter(item => {
        return item.name.toLocaleLowerCase().startsWith(searchRepositoriesName.toLocaleLowerCase());
      }).slice(0, 5);
      checkListItem(itemsArr);
    })
  } else {
    inputBox.value = '';
    removeChild();
  }
}

function checkListItem(arr){
  if (suggBox.children.length != 0) {
    removeChild();
  }
  addListItem(arr);
  addClickListener(arr);
}

function addClickListener(arr) {
  suggBox.onclick = function (e) {
    if (e.target.classList.contains('search__box-item')) {
      const id = e.target.id;
      const clickElem = arr.filter(item => {
        return item.id === Number(id);
      });
      createElem(clickElem);
      inputBox.value = '';
      removeChild();
    }
  }
}

function createElem(elem) {
  const listItem = document.createElement('div');
  listItem.classList.add('search__list-item');
  listItem.innerHTML = `
        <div class="search__list-info">
          <div class="search__list-wrapper">
              <div class="search__list-text">Name:</div> 
              <div class="search__list-name">${elem[0].name}</div>
          </div>
          <div class="search__list-wrapper">
              <div class="search__list-text">Owner:</div>
              <div class="search__list-owner">${elem[0].owner.login}</div>
          </div>
          <div class="search__list-wrapper">
              <div class="search__list-text">Stars:</div>
              <div class="search__list-stars">${elem[0].stargazers_count}</div>
          </div>
        </div>
        <div class="search__list-btn">
        </div>
  `
  searchList.append(listItem);
}

function removeChild() {
  const childrenArr = [...suggBox.children];
  childrenArr.forEach(elem => {
    elem.remove()
  })
}

function addListItem(arr) {
  searchWrapper.classList.add('search__form--active');
  arr.forEach(elem => {
    const li = document.createElement('li');
    li.classList.add('search__box-item');
    li.setAttribute('id', elem.id);
    li.textContent = elem.name;
    suggBox.append(li);
  })
}

searchList.onclick = function(e) {
  const target = e.target;
  if (target.classList.contains('search__list-btn')) {
    target.parentNode.remove();
  }
}

async function search(item) {
  return await fetch(`https://api.github.com/search/repositories?q=${item}`).then(res => {
    return res.json();
  });
}

inputBox.addEventListener('keyup', debounce(searchRepositories, 200));


