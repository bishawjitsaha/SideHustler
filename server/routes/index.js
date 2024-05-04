import homeRoute from './home.js';
import profileRoute from './profile.js';
import signupRoute from './signup.js';
import searchRoute from './search.js';
import postsRoute from './posts.js';

const constructorMethod = (app) => {
    app.get('/', (req, res) => {
        res.redirect('/home'); 
    });
    app.use('/home', homeRoute);
    app.use ('/user', profileRoute)
    app.use('/signup', signupRoute )
    app.use('/search', searchRoute)
    app.use('/posts', postsRoute)

    app.use('*', (req, res) => {
    res.sendStatus(404);
    });
};

export default constructorMethod;