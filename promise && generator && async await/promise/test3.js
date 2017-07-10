//回掉地狱
var catList = ''
setTimeout(function (name) {
  catList = name + ',';

  setTimeout(function (name) {
    catList += name + ',';

    setTimeout(function (name) {
      catList += name + ',';

      setTimeout(function (name) {
        catList += name + ',';

        setTimeout(function (name) {
          catList += name + ',';

          console.log(catList);

        }, 1, 'Lion');

      }, 1, 'Snow Leopard');

    }, 1, 'Lynx');

  }, 1, 'Jaguar');}, 1, 'Panther');



//采用promise解决  
var catList1 = ''
var t = (name)=>{
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
        catList1 += name + ','
        resolve(catList1)
      }, 0)
  })
}

t('Panther').then(r=>{
  return t('Jaguar')
}).then(r=>{
   return t('Lynx')
}).then(r=>{
   return t('Snow Leopard')
}).then(r=>{
   return t('Lion')
}).then(r=>{
  console.log(r)
})

