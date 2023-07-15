let strings="012345678".split("");
let numbers = strings.map(x => Number(x))
console.log ([...numbers, ...strings]);