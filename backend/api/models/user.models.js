
const mongoose = require('mongoose');
const validator = require('validator');
// import validator from 'validator'; // is this correct?

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLength: 3,
      maxLength: 50,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: {
            validator: v => /@(iut-dhaka\.edu|du\.ac\.bd|cu\.ac\.bd|ku\.ac\.bd|ru\.ac\.bd|ju\.ac\.bd|nstu\.edu\.bd|bracu\.ac\.bd|nsu\.edu\.bd|aiub\.edu|ewubd\.edu|iub\.edu\.bd|aust\.edu|uoda\.edu\.bd|diu\.edu\.bd|uap-bd\.edu|uiu\.ac\.bd|sau\.edu\.bd|lus\.ac\.bd|sub\.edu\.bd|pstu\.ac\.bd|hstu\.ac\.bd|mstu\.edu\.bd|bsmrstu\.edu\.bd|bup\.edu\.bd|duet\.ac\.bd|just\.edu\.bd|ruet\.ac\.bd|kuet\.ac\.bd|cuet\.ac\.bd|buet\.ac\.bd)$/i.test(v),
            message: 'Invalid university email domain'
        }
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: false,
      minLength: 8,
    },
    university: {
        type: String,
        required: [true, 'University is required'],
    },
    department: String,
    year: Number,
    phone: {
        type: String,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

