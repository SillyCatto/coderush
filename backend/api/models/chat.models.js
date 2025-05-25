const mongoose = require('mongoose');

/**
 * Message Schema (Embedded in Chat)
 *
 * @property {String} content - Text content of the message
 * @property {ObjectId} sender - Reference to the user sending the message
 * @property {Array<String>} images - Array of image URLs attached to the message
 * @property {Date} timestamp - When the message was sent (defaults to current time)
 */

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

/**
 * Chat Schema
 *
 * @property {ObjectId} listing - Reference to the marketplace listing being discussed
 * @property {Array<ObjectId>} participants - References to users participating in the chat
 * @property {Array<Message>} messages - Array of message objects in the conversation
 * @property {Date} createdAt - When the chat was created (defaults to current time)
 * @hooks {pre('save')} - Adds a system message when listing is updated
 */
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