  // get form
  const addItems = document.querySelector('.add-items');

  // get plate list
  const plantsList = document.querySelector('.plates');

  // get plate from localStorage
  const items = JSON.parse(localStorage.getItem('items')) || [];

  // get checkAll btn
  const checkAll = document.querySelector('[name=checkAll]');
  const unCheckAll = document.querySelector('[name=unCheckAll]');

  // when submit event, invoke addItem
  addItems.addEventListener('submit', addItem);

  // when checkbox clicked, invoke toggleDown
  plantsList.addEventListener('click', toggleDown);

  // 
  checkAll.addEventListener('click', handleCheckAll);
  unCheckAll.addEventListener('click', handleUnCheckAll)
  // update plateList
  populateList(items, plantsList);

function addItem(e){
  e.preventDefault()
  
  text = this.querySelector('[name=item]').value
  item = {
    text,
    done: false
  }
  items.push(item);
  populateList(items, plantsList)
  localStorage.setItem('items', JSON.stringify(items))
  this.reset();
}

function toggleDown(e){
  if (!e.target.matches('input')) return
  const ele = e.target
  const index = ele.dataset.index
  
  items[index].done = !items[index].done

  localStorage.setItem('items', JSON.stringify(items));
  populateList(items, plantsList)
}

function populateList(items =[], platesList){
  platesList.innerHTML = items.map((item, index) => {
    return `
      <li>
        <input type="checkbox" data-index="${index}" id="item${index}" ${item.done ? 'checked' : ''} />
        <label for="item${index}">${item.text}</label>
      </li>
    `
  }).join('')
}

function handleCheckAll(){
  console.log(items)
  items.forEach((item) => item.done = true)
  save('items', items)
  populateList(items, plantsList)
}

function handleUnCheckAll(){
  console.log('cancel')
  items.forEach((item) => item.done = false)
  save('items', items)
  populateList(items, plantsList)
}

function save(key, items){
  localStorage.setItem(key, JSON.stringify(items))
}