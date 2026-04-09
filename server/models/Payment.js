const mongoose = require('mongoose');
const crypto = require('crypto');

const PaymentSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:[true,'Please add a user']
        },
        eventId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Event',
            required:[true,'Please add an event']
        },
        orderId:{
            type:String,
            required:[true,'Please add an order ID']
        },
        amount:{
            type:Number,
            required:[true,'Please add an amount'],
            min:0
        },
        paymentStatus:{
            type:String,
            enum:['pending','completed','failed'],
            default:'pending'
        },
        razorpayPaymentId:{
            type:String
        },
        razorpayOrderId:{
            type:String
        },
        razorpaySignature:{
            type:String
        }
    },{
        timestamps:true
    }
);


PaymentSchema.methods.verifySignature= function(razorpayPaymentId,razorPaySignature){
    const generateSignature= crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET).update(this.orderId+'|'+razorpayPaymentId).digest('hex');
    return generateSignature === razorPaySignature;
}

module.exports = mongoose.model('Payment',PaymentSchema);