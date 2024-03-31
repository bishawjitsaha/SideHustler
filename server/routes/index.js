import homeRoute from './home.js';
import profileRoute from './profile.js'

const constructorMethod = (app) => {
    app.get('/', (req, res) => {
        res.redirect('/home'); 
    });
    app.use('/home', homeRoute);
    app.use ('/profile', profileRoute)

    app.use('*', (req, res) => {
    res.sendStatus(404);
    });
};

export default constructorMethod;