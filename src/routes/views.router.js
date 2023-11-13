import { Router } from 'express';
import { alreadyLogged, notLogged } from '../middlewares/session.js';
import { viewController } from '../controllers/index.js';
import authRole from '../middlewares/authorization.js';
import passport from 'passport';

const router = Router();

router.get('/', viewController.redirectLogIn);

router.get('/viewproducts', viewController.viewProducts);

router.get(
    '/products',
    passport.authenticate('jwt', { session: false }),
    authRole(['user']),
    viewController.products
);

router.get(
    '/realtimeproducts',
    passport.authenticate('jwt', { session: false }),
    authRole(['admin']),
    viewController.realTimeProducts
);

router.get('/carts/:cid', viewController.showCart);

router.get(
    '/chat',
    passport.authenticate('jwt', { session: false }),
    authRole(['user']),
    viewController.chat
);

// alreadyLogged
router.get('/signup', viewController.signUp);

// alreadyLogged
router.get('/login', viewController.logIn);

// notLogged
router.get('/logout', viewController.logOut);

export default router;
