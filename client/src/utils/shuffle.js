/**
 * Fisher-Yates Shuffle
 * @returns {number[]} 
 */
function permuteDigits() {
  const a = [1,2,3,4,5,6,7,8,9];

  for (let i = 0 ; i < 8 ; i++) {
    let j = i + Math.floor((9-i)*Math.random());
    [a[i], a[j]] = [a[j], a[i]] // swap the i-th and j-th entries
  }
  return [0,...a];
}

/**
 * Fisher-Yates Shuffle
 * @returns {number[]} 
 */
function permuteBands() {
  const a = [0,1,2,3,4,5,6,7,8];

  for (let i = 0 ; i < 2 ; i++) {
    let j = i + Math.floor((3-i) * Math.random());
    [a[i], a[j]] = [a[j], a[i]] // swap the i-th and j-th entries
    j = 3+i + Math.floor((3-i) * Math.random());
    [a[3+i], a[j]] = [a[j], a[3+i]] 
    j = 6+i + Math.floor((3-i) * Math.random());
    [a[6+i], a[j]] = [a[j], a[6+i]] 
  }

  for (let n = 0 ; n < 2 ; n++) {
    let m = n + Math.floor((3-n) * Math.random());
    [a[3*n], a[3*m]] = [a[3*m], a[3*n]];
    [a[3*n+1], a[3*m+1]] = [a[3*m+1], a[3*n+1]];
    [a[3*n+2], a[3*m+2]] = [a[3*m+2], a[3*n+2]];
  }
  return a;
}

console.log(permuteDigits());
console.log(permuteBands());


