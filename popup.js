import { createListElement } from "./utils.js"

function loadData() {
    chrome.runtime.sendMessage({action: "loadData"}, (response) => {
        if (response.success) {
            let ul = document.getElementById("list")
            ul.innerHTML = '';
            const tabNames = Object.keys(response.data)
            tabNames.forEach((name) => {
                createListElement(ul, name, deleteSavedTabs, openSavedTabs)
            })
        } else {
            console.error("Hubo un error al cargar los datos desde el local storage")
        }
    })   
}

loadData()

function deleteSavedTabs(name, element) {
    const deleteTabs = confirm(`Seguro que deseas borrar las pestañas ${name}?`)
    if (deleteTabs){
        chrome.runtime.sendMessage({action: "deleteTabs", name}, (response) => {
            if (response.success) {
                console.log("Tabs deleted succesfully")
            } else {
                console.error("tabs could not be deleted")
            }
        })
        // Para remover el elemento de la lista en la ui
        element.remove();
    }
}

function openSavedTabs(name) {
    console.log("Restaurando pestañas...");
    chrome.runtime.sendMessage({ action: "restoreTabs", name }, (response) => {
        if (response.success) {
        console.log("Pestañas restauradas correctamente");
        } else {
        console.error("Error al restaurar pestañas");
        }
    });
}


document.getElementById("saveTabs").addEventListener("click", () => {
    const nameInput = document.getElementById("tabsName").value;
    chrome.runtime.sendMessage({ action: "saveTabs", nameInput }, (response) => {
        if (response.success) {
          loadData()
        } else {
          console.error("Error al agrupar pestañas");
        }
    });
});
  