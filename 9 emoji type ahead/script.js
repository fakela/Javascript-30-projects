//Get our elements
const endpoint = 'https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json';
const emojis = [];
const searchInput = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');
const emojiPattern = Array.from(document.querySelectorAll('.emoji-pattern'));

fetch(endpoint).
then(blob => blob.json()).
then(data => emojis.push(...data)).
then(setTimeout(() => {
  renderMatches(emojis);
}, 100)).
catch(err => {
  console.log(err);
});

//build out functions
function findMatches(wordToMatch, emojis) {
  return emojis.filter((emoji) =>
  emoji.aliases.some(alias => alias.indexOf(wordToMatch) !== -1));

}

function renderMatches(arr) {
  const html = arr.map(emo => {
    const {
      emoji,
      description } =
    emo;
    return `
      <li class="icon">
        <abbr title="${description}">${emoji}</abbr>
      </li>
    `;
  }).join('');
  suggestions.innerHTML = html;
}

function updateMatches() {
  const matchArray = findMatches(this.value, emojis);
  renderMatches(matchArray);
}

function changeBackground(e) {
  if (!e.target.matches('abbr')) return;
  const emoj = e.target.innerText;
  emojiPattern.map(pattern => pattern.textContent = emoj);

}

//event listeners
searchInput.addEventListener('change', updateMatches);
searchInput.addEventListener('keyup', updateMatches);
suggestions.addEventListener('click', changeBackground);