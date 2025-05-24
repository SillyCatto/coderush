import mongoose from 'mongoose';

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
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: [true, 'Coordinates are required'],
        }
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed'],
        default: 'pending'
    },
    scheduledAt: Date
});

meetupSchema.index({ location: '2dsphere' });

const Meetup = mongoose.model('Meetup', meetupSchema);

export default Meetup;