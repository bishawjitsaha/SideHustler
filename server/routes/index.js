import homeRoute from './home.js';
import userRoute from './user.js';
import signupRoute from './signup.js';

const constructorMethod = (app) => {
    app.get('/', (req, res) => {
        res.redirect('/home'); 
    });
    app.use('/home', homeRoute);
    app.use ('/user', userRoute)
    app.use('/signup', signupRoute )

    app.use('*', (req, res) => {
    res.sendStatus(404);
    });
};

export default constructorMethod;