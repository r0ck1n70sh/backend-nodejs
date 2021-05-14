const USERNAME = 'admin';
const PASSWORD = 'adminpass';
const DATABASE = 'custom_db';
const COLLECTION = 'user_data'

const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.7mgkb.mongodb.net/${DATABASE}?retryWrites=true&w=majority`;

async function findAndAuthorize(client, {username, password}) {
    const cursor = await client
    .db(DATABASE)
    .collection(COLLECTION)
    .findOne({
        username: username
    });

    console.log(`${username}, ${password}`);
    console.log(cursor);

    if(cursor == null || cursor == undefined)
        return {
            username: username,
            status: 'username not found'
        }
    else if(cursor.password === password)
        return {
            username: username,
            password: password,
            status: 'completed'
        }
    else {
        return {
            username: username,
            status: 'password incorrect'
        }
    }
}

async function authorize(user) {
    const client = new MongoClient(uri, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
    });

    await client.connect();
    const res = await findAndAuthorize(client, user);
    client.close();

    return res;
}

// async function main(user){
//     const client = new MongoClient(uri, { 
//         useNewUrlParser: true, 
//         useUnifiedTopology: true 
//     });

//     await client.connect();
//     console.log(await findAndAuthorize(client, user));
//     client.close();
// };

// try {
//     main({
//         username: 'user1',
//         password: 'password'
//     });
// } catch(err) {
//     console.error(err);
// }

module.exports = {authorize};