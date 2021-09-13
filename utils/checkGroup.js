let groups = [
  [03, 15, 43, 63],
  [07, 26, 36, 73, 74],
  [01, 42, 69],
  [35, 39, 70, 90],
  [21, 58, 71, 89],
  [22, 29, 35, 56],
  [18, 28, 36, 37, 41, 45],
  [54, 55, 57, 88],
  [08, 10, 51, 52],
  [67, 68],
  [971, 977, 978],
  [02, 60, 80],
  [59, 62],
  [77, 93, 94],
  [78, 91, 92, 95],
  [14, 50, 61, 27, 76, 975],
  [24, 33, 40, 47, 64],
  [19, 23, 87],
  [16, 17, 79, 86],
  [11, 30, 34, 48, 66],
  [09, 12, 31, 32, 46, 65, 81, 82],
  [44, 49, 53, 72, 85],
  [04, 05, 13, 84],
  [06, 83],
];

module.exports = (userZip, courseZip) => {
  let check = groups.some((groups) => {
    return groups.includes(userZip) && groups.includes(courseZip);
  });
  return check;
};

// for (i = 0; i < groups.length; i++) {
//     let res= groups[i].includes(userZip && corseZip)
//     if (res) { break; }
// }

// let matched = [];
// for (i = 0; i < groups.length; i++) {
//   let res = groups[i].includes(userZip && corseZip);
//   if (res) {
//       matched.push(res);
//     break;
//   }
// }
