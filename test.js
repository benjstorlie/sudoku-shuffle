
function notnot(a, b) {
  return (a ? b : !b)
}

function xor(a , b) {
  return (a ^ !b)
}

const values = [{a:1,b:1},{a:1,b:0},{a:0,b:1},{a:0,b:0}];

values.forEach(({a,b}) => {
  console.log("a",a,"b",b,"not",notnot(a,b),"xor",xor(a,b))
});