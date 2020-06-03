const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://root:root@127.0.0.1:27017';

class mongo_controller{
    constructor() {
        console.log(' << mongo init >>');
    }
    insert(data){
        console.log(`----------data:${JSON.stringify(data)}`);
        MongoClient.connect(url, (err, client) => {  //dbからclientに変更
            const db = client.db("device_data")  //　追加
            db.collection("datas",(error, collection) => {
                collection.insertMany([data],(error,result) => {
                    console.log(` error ${error}`);
                    client.close();  //db.close()から変更
                });
            });
        });
    }
    upload(data){
        console.log(`----------data:${JSON.stringify(data)}`);
        MongoClient.connect(url, (err, client) => {  //dbからclientに変更
            const db = client.db("device_data")  //　追加
            db.collection("devices",(error, collection) => {
                collection.insertMany([data],(error,result) => {
                    console.log(` error ${error}`);
                    client.close();  //db.close()から変更
                });
            });
        });
    }
    keyFind(){
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, (err, client) => {  //dbからclientに変更
                const db = client.db("device_data")  //　追加
                let collection = db.collection("datas");
                collection.distinct("key", {}, (err, docs) =>{
                    if(err){
                        resolve(err);
                    }
                    client.close();
                    resolve(docs);
                });
            });
        });
    }
    find(keys){
        return new Promise((resolve, reject) => {
            let param = {key: keys};
            //console.log(`------param : ${JSON.stringify(param)}`);
            MongoClient.connect(url, (err, client) => {  //dbからclientに変更
                const db = client.db("device_data")  //　追加
                db.collection("datas",(error, collection) => {
                    collection.find(param).sort({date: -1}).limit(10).toArray().then((res) => {
                        //console.log(`res: ${JSON.stringify(res)}`);
                        client.close();
                        resolve(res);
                    }).catch(err => {
                        console.log(`err: ${err}`);
                    });
                });
            });  
        })
    }
}




module.exports.mongo_controller = mongo_controller;