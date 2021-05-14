const USERNAME = 'admin';
const PASSWORD = 'adminpass';
const DATABASE = 'custom_db';
const COLLECTION = 'user_data'

const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.7mgkb.mongodb.net/${DATABASE}?retryWrites=true&w=majority`;

async function authorizeAndAdd(client, {username, password}) {
    const cursor1 = await client
    .db(DATABASE)
    .collection(COLLECTION)
    .findOne({
        username: username
    });

    if(cursor1 != undefined)
        return {
            username: username,
            status: 'username already used'
        };

    const cursor2 = await client
    .db(DATABASE)
    .collection(COLLECTION)
    .insertOne({
        username: username,
        password: password
    })

    const SUCCESS_CODE = 1;
    if(cursor2.insertedCount === SUCCESS_CODE)
        return {
            username: username,
            status: 'completed'
        };

    return {
        username: username,
        status: 'failed'
    }
}

async function authorize({username, password, password2}) {
    if(password !== password2)
        return {
            username: username,
            status: 'password doesn\'t match'
        };

    const client = new MongoClient(uri, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        }
    );

    await client.connect();
    const res = await authorizeAndAdd(client, {username, password});
    client.close();

    return res;
}

module.exports = {authorize};