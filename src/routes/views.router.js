import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
    res.redirect('/products');
});

router.get('/viewproducts', async (req, res) => {
    const products = await req.productManager.getProducts();
    res.render('home', { products: products });
});

router.get('/products', async (req, res) => {
    const options = {};

    options['products'] = await req.productManager.getProductsPaginate(req);
    options['user'] = req.session.name;
    options['session'] = JSON.stringify(req.session);

    try {
        res.render('products', options);
    } catch (err) {
        return res
            .status(404)
            .send({ status: 'error', description: err.message, payload: [] });
    }
});

router.get('/realtimeproducts', async (req, res) => {
    let products = await req.productManager.getProducts();

    products.forEach((product) => {
        if (!product.id) {
            product.id = product._id;
        }
    });

    res.render('realTimeProducts', { products: products });
});

router.get('/carts/:cid', async (req, res) => {
    res.render('cart', { cid: req.params.cid });
});

router.get('/chat', (req, res) => {
    res.render('chat');
});

router.get('/signup', (req, res) => {
    // TODO si está logueado ya, mandar a /
    res.render('signup');
});

router.get('/login', (req, res) => {
    // TODO si está logueado ya, mandar a /
    res.render('login');
});

router.get('/logout', (req, res) => {
    // TODO si no está logueado, mandar a /login
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send({
                status: 'error',
                message: 'Logout error',
                data: { err },
            });
        } else {
            res.clearCookie('connect.sid');
            res.redirect('/products');
        }
    });
});

export default router;
