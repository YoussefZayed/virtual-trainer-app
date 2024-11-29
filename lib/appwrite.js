import { Client, Account, ID } from 'react-native-appwrite';


export const appwriteCofig = {
    endpoint: 'https://appwrite-excer.youssefsoftware.com/v1',
    project: '6748ef0c00248aade2d0',
    platform: 'com.youssef.virtual-trainer',
    databaseId: '6748f0a60028e62f07a5',
    userCollectionId: '6748f0e2000c72adb75c',
    storageID: '6748f2310011290fec69'
}


const client = new Client();
client
    .setEndpoint(appwriteCofig.endpoint)
    .setProject(appwriteCofig.project)
    .setPlatform(appwriteCofig.platform);


const account = new Account(client);

export const createAccount = () => {
    account.create(ID.unique(), 'me@example.com', 'password', 'Jane Doe')
        .then(function (response) {
            console.log(response);
        }, function (error) {
            console.log(error);
        });
}