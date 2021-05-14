const USERNAME = 'admin';
const PASSWORD = 'adminpass';
const DATABASE = 'sample_analytics';
const COLLECTION = 'customers'

const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.7mgkb.mongodb.net/${DATABASE}?retryWrites=true&w=majority`;

async function findListings(client, resultLimit) {
    const resJSON = client
    .db(DATABASE)
    .collection(COLLECTION)
    .find()
    .limit(resultLimit);

    const res = await resJSON.toArray();

    if(res.length > 0){
        console.log(`Length of Result: ${res.length}`);
        console.log(res[0]);
    }

}

async function main() {
    const client = new MongoClient(uri, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        }
    );

    await client.connect();
    await findListings(client, 5);
    client.close();
}

main();