let priorities = [
  { task: "Get food", urgency: 1 },
  { task: "Clean", urgency: 2 },
  { task: "Study", urgency: 3 },
  { task: "Exercise", urgency: 4 },
  { task: "Read", urgency: 5 },
  { task: "Workout", urgency: 6 },
  { task: "Write", urgency: 7 },
  { task: "Call", urgency: 8 }
];

let lastOrderOfPriorities;

const container = document.querySelector('.container');

function updateServerPriorities(updatedPriority) {
  console.error("These logs will be a similar format that updates the backend")
  console.warn("All priorities");
  console.log(priorities);
  
  console.warn("Single updated priority");
  console.log(updatedPriority);
  
  console.warn("All Changed Priorities (Will output only changed priorities, just needs some work)");
  const parsedLastOrderOfPriorities = JSON.parse(lastOrderOfPriorities);
  console.log(parsedLastOrderOfPriorities)

  console.log()
}

function fillContainer() {
  priorities.forEach(priority => {
    let div = document.createElement("div");
    div.className = "draggable";
    div.draggable = true;

    let heading = document.createElement("h3");
    heading.textContent = priority.task;

    let urgency = document.createElement("p");
    let span = document.createElement("span");
    span.textContent = "urgency: ";
    urgency.appendChild(span);
    urgency.appendChild(document.createTextNode(priority.urgency));

    div.appendChild(heading);
    div.appendChild(urgency);

    // Set the data-priority attribute with the task and urgency
    div.dataset.priority = JSON.stringify({ task: priority.task, urgency: priority.urgency });

    container.appendChild(div);

    //Dragstart
    div.addEventListener('dragstart', (event) => {
      //Using JSON.stringify to create a deep clone of priorities so data isn't mutated
      lastOrderOfPriorities = JSON.stringify(priorities); 
      div.classList.add('dragging');
      div.classList.add('dragged');

      // Store the data in the 'text' type to be dragged
      const data = JSON.stringify({ task: priority.task, urgency: priority.urgency });
      event.dataTransfer.setData('text', data);
    });

    div.addEventListener('dragend',  () => {
      div.classList.remove('dragging');
    });
  });
}


window.onload = function() {
  fillContainer();
 
  container.addEventListener('dragover', e => {
    e.preventDefault();
    // console.warn('ahh')
    const afterElement = getDragAfterElement(container, e.clientY);
    const draggable = document.querySelector('.dragging');
    if (afterElement == null) {
      container.appendChild(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    }
  });

  container.addEventListener('drop', e => {
    const dragged = document.querySelector('.dragged');

    updateServerPriorities(JSON.parse(dragged.dataset.priority))
  
    updatePrioritiesOrder();
  });
};

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updatePrioritiesOrder() {
  const draggableElements = [...container.querySelectorAll('.draggable')];

  // Sort the priorities array based on the current order of elements in the container
  
  priorities.sort((a, b) => {
    const aTask = a.task.toLowerCase();
    const bTask = b.task.toLowerCase();
    return draggableElements.findIndex(element => element.querySelector('h3').textContent.toLowerCase() === aTask) -
      draggableElements.findIndex(element => element.querySelector('h3').textContent.toLowerCase() === bTask);
  });

  // Update the priorities array with the new urgency values based on the updated order
  draggableElements.forEach((element, index) => {
    const taskName = element.querySelector('h3').textContent;
    const updatedUrgency = index + 1;
    const taskIndex = priorities.findIndex(item => item.task === taskName);
    priorities[taskIndex].urgency = updatedUrgency;
    
    element.dataset.priority = JSON.stringify({ task: taskName, urgency: updatedUrgency });
    // Update the HTML with the new urgency values
    element.querySelector('p span').nextSibling.textContent = ` ${updatedUrgency}`;
  });
  
}




