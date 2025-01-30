export function createListElement(ul, name, callbackDelete, callbackOpenTabs) {
    let li = document.createElement("li")

    let span = document.createElement("span");
    span.textContent = name;
    
    let buttonX = document.createElement("button");
    buttonX.textContent = "X";
    
    let buttonCheck = document.createElement("button");
    buttonCheck.textContent = "✓";
    
    let buttonContainer = document.createElement("div")
    buttonContainer.appendChild(buttonX)
    buttonContainer.appendChild(buttonCheck)

    li.appendChild(span);
    li.appendChild(buttonContainer);

    buttonX.addEventListener("click", () => {
        callbackDelete(name, li)
    });
    
    buttonCheck.addEventListener("click", () => {
        callbackOpenTabs(name)
        li.style.textDecoration = "line-through";
    });

    ul.appendChild(li)
}