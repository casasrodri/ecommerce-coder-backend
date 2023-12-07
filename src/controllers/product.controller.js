import { productRepository } from '../repositories/index.js';
import { CustomError, errorTypes, createProductErrorInfo } from '../services/errors/customError.js';
import logger from '../utils/logger.js';
export default class ProductController {
    async getProductsPaginate(req, res) {
        try {
            res.send(await productRepository.getProductsPaginate(req));
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                description: err.message,
                payload: [],
            });
        }
    }

    async getProductById(req, res) {
        const pid = productRepository.getId(req.params.pid);

        try {
            const product = await productRepository.getProductById(pid);
            res.send(product);
        } catch (err) {
            res.status(404).send({
                status: 'error',
                description: err.message,
                data: { productId: pid },
            });
        }
    }

    async addProduct(req, res) {
        try {
            return res.status(201).send({
                status: 'ok',
                description: 'Created.',
                data: await productRepository.addProduct(req.product),
            });
        } catch (err) {

            throw new CustomError({
                name: 'AddProductError',
                message: createProductErrorInfo(req.product),
                cause: err.message,
                type: errorTypes.INVALID_TYPES,
                statusCode: 400,
            });
        }
    }

    async addThumbnail(req, res) {
        const pid = productRepository.getId(req.params.pid);

        try {
            for (const f of req.files) {
                await productRepository.addThumbnail(pid, f.path);
            }

            const product = await productRepository.getProductById(pid);

            return res.status(201).send({
                status: 'ok',
                description: 'Thumbnails added.',
                data: product,
            });
        } catch (err) {
            return res.status(404).send({
                productId: pid,
                status: err.message,
                data: { productId: pid },
            });
        }
    }

    async updateProductById(req, res) {
        const pid = productRepository.getId(req.params.pid);
        const updatedProduct = req.body.product;
        let updated;

        try {
            return res.status(200).send({
                status: 'ok',
                description: 'Updated.',
                data: await productRepository.updateProductById(
                    pid,
                    updatedProduct
                ),
            });
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                description: err.message,
                data: { productId: pid },
            });
        }
    }

    async deleteProductById(req, res) {
        const pid = productRepository.getId(req.params.pid);
        logger.warning('intentnando borrar', pid)

        try {
            return res.status(204).send({
                status: 'ok',
                description: 'Deleted.',
                data: await productRepository.deleteProductById(pid),
            });
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                description: err.message,
                data: { productId: pid },
            });
        }
    }
}
