const btnSave = document.getElementById("btnSave");
const btnOpen = document.getElementById("btnOpen");
const btnLinks = document.getElementById("btnLinks");
const btnCollect = document.getElementById("btnCollect");
const btnRemove = document.getElementById("btnRemove");
const btnCreate = document.getElementById("btnCreate");
const txtName = document.getElementById("collection-name");
const urlFilter = ["gx-corner.opera.com"];
let hasItems = false;

btnSave.addEventListener("click", () => {
  chrome.windows.getAll({ populate: true }, getAllOpenWindows);
});

btnOpen.addEventListener("click", () => {
  try {
    if (localStorage.getItem("pages")) {
      const urls = JSON.parse(localStorage.getItem("pages"));
      urls.map((newurl) => {
        chrome.tabs.create({ url: newurl });
      });
    } else {
      alert("There are no saved pages.");
    }
  } catch (exc) {
    alert(exc);
  }
});

function getAllOpenWindows(winData) {
  const response = confirm("Are you sure you want to save current pages?");
  if (response) {
    var tabs = [];
    for (var i in winData) {
      if (winData[i].focused === false) {
        var winTabs = winData[i].tabs;
        var totTabs = winTabs.length;
        for (var j = 0; j < totTabs; j++) {
          let matched = false;
          for (let i = 0; i < urlFilter.length; i++) {
            if (urlFilter[i].match(winTabs[j].url.split("/")[2]))
              matched = true;
          }
          if (!matched) tabs.push(winTabs[j].url);
        }
      }
    }
    alert(
      tabs.length > 1 ? "Pages saved successfully!" : "Page saved successfully!"
    );
    localStorage.setItem("pages", JSON.stringify(tabs));
  }
}

btnLinks.addEventListener("click", () => {
  try {
    hasItems = true;
    const links = document.querySelector(".links");
    const urls = JSON.parse(localStorage.getItem("pages"));
    if (hasItems) {
      while (links.hasChildNodes()) {
        try {
          links.removeChild(links.children[0]);
        } catch (exc) {
          break;
        }
      }
    }
    urls.map((url, index) => {
      const newItem = document.createElement("div");
      const node = document.querySelector(".node").cloneNode(true);
      const remove = btnRemove.cloneNode(true);
      newItem.className = "item";
      remove.id = index;
      remove.style.display = "inline-block";
      node.innerHTML = url.split("/")[2];
      node.href = url;
      node.style.display = "inline-block";
      newItem.appendChild(remove);
      newItem.appendChild(node);
      links.appendChild(newItem);

      remove.addEventListener("click", () => {
        const newurls = urls.filter((url, index) => {
          if (index != remove.id) {
            return url;
          }
        });
        localStorage.setItem("pages", JSON.stringify(newurls));
        btnLinks.click();
      });
    });
  } catch (exc) {
    hasItems = false;
    alert("There are no saved pages.");
  }
});

btnCollect.addEventListener("click", () => {
  try {
    hasItems = true;
    const links = document.querySelector(".links");
    if (hasItems) {
      while (links.hasChildNodes()) {
        try {
          links.removeChild(links.children[0]);
        } catch (exc) {
          break;
        }
      }
    }
    const collection = JSON.parse(localStorage.getItem("collection"));
    collection.map((item, index) => {
      const newItem = document.createElement("div");
      const node = document.querySelector(".node").cloneNode(true);
      const remove = btnRemove.cloneNode(true);
      newItem.className = "item";
      remove.id = index;
      remove.style.display = "inline-block";
      node.innerHTML = item.name;
      node.style.display = "inline-block";
      newItem.appendChild(remove);
      newItem.appendChild(node);
      links.appendChild(newItem);

      node.addEventListener("click", () => {
        item.urls.map((newurl) => {
          chrome.tabs.create({ url: newurl });
        });
      });

      remove.addEventListener("click", () => {
        const newcollection = collection.filter((item, index) => {
          if (index != remove.id) {
            return item;
          }
        });
        localStorage.setItem("collection", JSON.stringify(newcollection));
        btnCollect.click();
      });
    });
  } catch (exc) {
    hasItems = false;
    alert("There are no saved collection.");
  }
});

btnCreate.addEventListener("click", () => {
  if (txtName.value) {
    chrome.windows.getAll({ populate: true }, getAllOpenWindowsCollection);
  }
});

function getAllOpenWindowsCollection(winData) {
  const response = confirm("Create this collection?");
  if (response) {
    var tabs = [];
    for (var i in winData) {
      if (winData[i].focused === false) {
        var winTabs = winData[i].tabs;
        var totTabs = winTabs.length;
        for (var j = 0; j < totTabs; j++) {
          let matched = false;
          for (let i = 0; i < urlFilter.length; i++) {
            if (urlFilter[i].match(winTabs[j].url.split("/")[2]))
              matched = true;
          }
          if (!matched) tabs.push(winTabs[j].url);
        }
      }
    }
    alert(
      tabs.length > 1 ? "Pages saved successfully!" : "Page saved successfully!"
    );

    let collection = [];
    try {
      if (Array.isArray(JSON.parse(localStorage.getItem("collection"))))
        collection = JSON.parse(localStorage.getItem("collection"));
    } catch (exc) {}
    collection.push({ name: txtName.value, urls: tabs });
    localStorage.setItem("collection", JSON.stringify(collection));
    txtName.value = "";
  }
}
