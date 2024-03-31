import { users, posts } from '../config/mongoCollections';
let checkString = (string) => {
    string = string.trim()
    if(typeof string !== 'string' || string === ''){
        throw new Error('Invalid query');
    };
    return string;

}
let searchFunction = {
    async searchUser (query) {
        query = checkString(query);
        let userCollection = await users();
        let usersArr = await userCollection.find({'username' : { $regex: query, $options: 'i' }}).toArray();
        return usersArr;
        
    },
    async searchPost (query){
        query = checkString(query);
        let postCollection = await posts();
        let postsArr = await postCollection.find({'title' : { $regex: query, $options: 'i' }}).toArray();
        return postsArr;
    },
    async searchTag (query){
        query = checkString(query);
        let postCollection = await posts();
        let tagsArr = await postCollection.find({'tags' : { $regex: query, $options: 'i' }}).toArray();
        return tagsArr;
    }  
}

export default searchFunction;
