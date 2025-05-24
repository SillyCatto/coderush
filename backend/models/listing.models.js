import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    type: {
        type: String,
        enum: ['item', 'service'],
        required: true
    },
    price: Number,
    hourlyRate: Number,
    condition: {
        type: String,
        enum: ['new', 'like_new', 'good', 'fair']
    },
    category: {
        type: String,
        enum: ['textbooks', 'electronics', 'furniture', 'tutoring', 'other']
    },
    visibility: {
        type: String,
        enum: ['university', 'global'],
        default: 'university'
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    images: [String],
    status: {
        type: String,
        enum: ['active', 'sold', 'expired'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes for faster searching
listingSchema.index({ title: 'text', description: 'text' });
listingSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model('Listing', listingSchema);