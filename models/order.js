const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    items: [{
        watch: { type: mongoose.Schema.Types.ObjectId, ref: 'Watch', required: true },
        quantity: { type: Number, required: true },
    }],
    total: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    status: { type: String, default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
