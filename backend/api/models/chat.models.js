const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: String,
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Sender is required']
    },
    images: [String],
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const chatSchema = new mongoose.Schema({
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: [true, 'Listing is required']
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    messages: [messageSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});


// auto-update the chat if the listing is updated
chatSchema.pre('save', function (next) {
    if (this.isModified('listing')) {
        this.messages.push({
            content: 'This listing has been updated.',
            sender: null,
            timestamp: new Date()
        });
    }
    next();
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;