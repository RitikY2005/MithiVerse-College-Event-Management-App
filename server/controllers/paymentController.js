const razorpayInstance = require("../config/razorpay");
const asyncHandler = require("../middleware/asyncHandler");
const Event = require("../models/Event");
const Payment = require("../models/Payment");
const ErrorResponse = require("../utils/errorResponse");

exports.createOrder=asyncHandler(async (req,res,next)=>{
    const {userId,eventId,amount}=req.body;
   
    if(!userId || !eventId || !amount){
        return next(new ErrorResponse('Please provide all required fields',400));
    }

    const event=await Event.findById(eventId);

    if(!event){
        return next(new ErrorResponse('Event not found',404));
    }

    if(event.getEventStatus()==='completed'){
        return next(new ErrorResponse('Cannot register for a completed event',400));
    }



    const existingPayment=await Payment.findOne({userId,eventId});

    if(existingPayment && existingPayment.paymentStatus==='completed'){
        return next(new ErrorResponse('You have already registered for this event',400));
    }

    if(existingPayment && existingPayment.paymentStatus==='pending'){
        existingPayment.deleteOne();
    }


    const orderOptions={
        amount:amount*100,
        currency:'INR',
        receipt:'order_'+Date.now(),
    };

    
    const order=await razorpayInstance.orders.create(orderOptions);
    
    if(!order){
        return next(new ErrorResponse('Failed to create order',500));
    }

   

    const payment=new Payment({
        userId,
        eventId,
        orderId:order.id,
        amount,
        paymentStatus:'pending'
    });

    await payment.save();

    res.status(201).json({
        success:true,
        message:"Order created successfully",
        orderId:order.id,
        amount:order.amount,
        key:razorpayInstance.key_id,
    })
});

exports.verifyPayment=asyncHandler(async(req,res,next)=>{
    const {razorpayPaymentId,razorpayOrderId,razorpaySignature,userId,eventId}=req.body;

    if(!razorpayPaymentId || !razorpayOrderId || !razorpaySignature || !userId || !eventId){
        return next(new ErrorResponse('Please provide all required fields',400));
    }

    const payment=await Payment.findOne({userId,eventId,orderId:razorpayOrderId});

    if(!payment){
        return next(new ErrorResponse('Payment record not found',404));
    }

    if(payment.paymentStatus==='completed'){
        return next(new ErrorResponse('Payment already verified',400));
    }

    const isSignatureValid=payment.verifySignature(razorpayPaymentId,razorpaySignature);

    if(!isSignatureValid){
        return next(new ErrorResponse('Invalid payment signature',400));
    }

    payment.paymentStatus='completed';
    payment.razorpayPaymentId=razorpayPaymentId;
    payment.razorpayOrderId=razorpayOrderId;
    payment.razorpaySignature=razorpaySignature;

    await payment.save();

    res.status(200).json({
        success:true,
        message:"Payment verified successfully"
    });
});