import homeRoute from './home.js';
import profileRoute from './profile.js';
import signupRoute from './signup.js';

const constructorMethod = (app) => {
    app.get('/', (req, res) => {
        res.redirect('/home'); 
    });
    app.use('/home', homeRoute);
    app.use ('/user', profileRoute)
    app.use('/signup', signupRoute )

    app.use('*', (req, res) => {
    res.sendStatus(404);
    });
};

export default constructorMethod;