let searchWrapper = document.querySelector('.search__form');
let inputBox = searchWrapper.querySelector('.search__input');
let suggBox = searchWrapper.querySelector('.search__box');
let searchList = document.querySelector('.search__list');

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
  let repData = e.target.value;
  let mainArr = [];
  if (repData) {
    search(repData).then(data => {
      return data.items;
    }).then(items => {
      let itemsArr = items.filter(item => {
        return item.name.toLocaleLowerCase().startsWith(repData.toLocaleLowerCase());
      });
      return itemsArr;
    }).then(arr => {
      for (let i = 0; i < 5; i++) {
        if (arr[i] != undefined) {
          mainArr.push(arr[i]);
        } else {
          return mainArr;
        }
      }
      return mainArr;
    }).then(arr => {
      if (suggBox.children.length != 0) {
        removeChild();
      }
      addListItem(arr);
      addClickListener(arr);
    });
  } else {
    inputBox.value = '';
    removeChild();
  }
}

function addClickListener(arr) {
  suggBox.onclick = function (e) {
    if (e.target.classList.contains('search__box-item')) {
      console.log(arr);
      let id = e.target.id;
      let clickElem = arr.filter(item => {
         if(item.id == id) {
           console.log(item.id);
           console.log(id);
          return item;
        }
      });
      console.log(clickElem)
      createElem(clickElem);
      inputBox.value = '';
      removeChild();
    }
  }
}


function createElem(elem) {
  let listItem = document.createElement('div');
  listItem.classList.add('search__list-item');
  listItem.innerHTML = `
        <div class="search__list-info">
          <div class="search__list-wrapper">
              <div class="search__list-text">Name:</div> \s
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
  let childrenArr = [...suggBox.children];
  for (let i = 0; i < childrenArr.length; i++) {
    childrenArr[i].remove();
  }
}

function addListItem(arr) {
  searchWrapper.classList.add('search__form--active');
  for (let i = 0; i < arr.length; i++) {
    let li = document.createElement('li');
    li.classList.add('search__box-item');
    li.setAttribute('id', arr[i].id);
    li.textContent = arr[i].name;
    suggBox.append(li);
  }
}

searchList.onclick = function(e) {
  let target = e.target;
  console.log(target)
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



