/**
 * Gives an array of integers to be able to map over to make repeated elements
 * @param {number} length - length of array
 * @param {number} start - first number
 * @returns {number[]}
 */
export function iter(length, start=0) {
  return Array.from({length}, (_,i) => start+i);
}

/**
 * Creates an arr of booleans for whether a candidate is possible (true) or eliminated (false)
 * @param {Set<number>} set - set of possible candidates
 * @returns {Boolean[]}
 */
export function possibleCandidatesArr(set) {

  if (set.size >= 9) {
    return Array(9).fill(true);
  }

  const arr = Array(9).fill(false);
  for (const num of set) {
    if (num >= 0 && num < 9) {
      arr[num] = true;
    }
  }
  return arr;
}