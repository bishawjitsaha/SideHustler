import homeRoute from './home.js';
import userRoute from './user.js';
import signupRoute from './signup.js';
import searchRoute from './search.js';
import postsRoute from './posts.js';
import imageRoute from './image.js';
import notificationRoute from './notifications.js';

const constructorMethod = (app) => {
    app.get('/', (req, res) => {
        res.redirect('/home'); 
    });
    app.use('/home', homeRoute);
    app.use ('/user', userRoute)
    app.use('/signup', signupRoute )
    app.use('/search', searchRoute)
    app.use('/posts', postsRoute)
    app.use('/image', imageRoute)
    app.use('/notifications', notificationRoute)

    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

export default constructorMethod;