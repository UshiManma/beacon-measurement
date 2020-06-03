const mongo = require('./mongo');
const db = new mongo.mongo_controller();
const BeaconScanner = require('node-beacon-scanner');
const scanner = new BeaconScanner();
var row = [];

class records{
  constructor(major, minor) {
    this.major = major;
    this.minor = minor;
  }
  getId(){
    return this.major
  }
  getDatas(){
    return this.datas;
  }
  setDatas(data){
    this.datas.push(data);
  }
}

// Set an Event handler for becons
scanner.onadvertisement = (ad) => {
  //受信ステータス
  //console.log(JSON.stringify(ad, null, '  '));
  
  
  let recieve = ad;
  let rssi = recieve.rssi;
  let txPower = recieve.iBeacon.txPower;

  //console.log(`${JSON.stringify(recieve.iBeacon.major)}`);
  let major = recieve.iBeacon.major;
  let minor = recieve.iBeacon.minor;
  const r = 10**((txPower-rssi)/20);

  let dt = new Date();
  console.log(`${dt.toString()} : ${major}.${minor} >>> ${r.toFixed(2)}[m] : rssi : ${rssi} txPower : ${txPower}`);
  
  let data = {
    key: String(major) + '-' + String(minor), 
    date: dt,
    rssi: rssi, 
    txPower: txPower, 
    distance: r.toFixed(2)};
  db.insert(data);
};

function avgDistance(row){
  var r = 0;
  for(let val of row){
    r += Number(val.distance);
  }
  return r/row.length;
}

// Start scanning
scanner.startScan().then(() => {
  console.log('Started to scan.')  ;
}).catch((error) => {
  console.error(`scan error : ${error}`);
});

