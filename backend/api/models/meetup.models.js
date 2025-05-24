const mongoose = require('mongoose');

const meetupSchema = new mongoose.Schema({
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: [true, 'Listing is required']
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Buyer is required']
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Seller is required']
    },
    location: {
        lat: {
            type: Number,
            required: [true, 'Coordinates are required'],
        },
        lng: {
            type: Number,
            required: [true, 'Coordinates are required'],
        },
        name: {
            type: String,
            required: true,
        },
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed'],
        default: 'pending'
    },
    scheduledAt: Date
}, { timestamps: true });

// meetupSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Meetup', meetupSchema);
