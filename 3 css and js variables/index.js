const inputs = document.querySelectorAll('.controls input')

inputs.forEach(input => input.addEventListener('mousemove' , handleChange));
inputs.forEach(input => input.addEventListener('change', handleChange));

function handleChange() {
    const suffix = this.dataset.sizing || ' ';
    document.documentElement.style.setProperty(`--${this.name}`, this.value + suffix);
    console.log(suffix)
}