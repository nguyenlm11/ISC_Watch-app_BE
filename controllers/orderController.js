const Order = require('../models/order');
const Watch = require('../models/watch');

class OrderController {
    async createOrder(req, res) {
        const { items, paymentMethod, deliveryInfo } = req.body;
        const member = req.member._id;

        try {
            let total = 0;
            for (const item of items) {
                const watch = await Watch.findById(item.watch);
                if (!watch) {
                    return res.status(404).json({ error: 'Watch not found' });
                }
                total += watch.price * item.quantity;
            }

            const newOrder = new Order({
                member,
                items,
                total,
                paymentMethod,
                status: 'Pending',
                deliveryInfo,
            });

            await newOrder.save();
            res.status(201).json(newOrder);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async getOrdersByMember(req, res) {
        try {
            const orders = await Order.find({ member: req.member._id }).populate('items.watch');
            res.json(orders);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async getAllOrders(req, res) {
        try {
            const orders = await Order.find({}).populate('member', 'membername').populate('items.watch');
            res.json(orders);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async updateOrderStatus(req, res) {
        const { id } = req.params;
        const { status } = req.body;

        try {
            const order = await Order.findById(id);
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            order.status = status;
            await order.save();
            res.json(order);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async updateOrder(req, res) {
        const { id } = req.params;
        const { deliveryInfo } = req.body;

        try {
            const order = await Order.findById(id);
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            order.deliveryInfo = deliveryInfo || order.deliveryInfo;
            await order.save();
            res.json(order);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
// orderController.js
async deleteOrder(req, res) {
    const { id } = req.params;

    try {
        await Order.findByIdAndDelete(id);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
    // orderController.js
// orderController.js
async updateOrder(req, res) {
    const { id } = req.params;
    const updates = req.body;

    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Update order details here
        Object.assign(order, updates);
        await order.save();
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async cancelOrder(req, res) {
    const { id } = req.params;

    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        if (order.status !== 'Pending') {
            return res.status(400).json({ error: 'Order cannot be cancelled' });
        }

        order.status = 'Cancelled';
        await order.save();
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
}

module.exports = new OrderController();
