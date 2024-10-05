import Order from "@/models/Order";
import connectDb from "@/middleware/mongoose";
import Product from "@/models/Product";
import PaytmChecksum from "paytmchecksum";
const handler = async (req, res) => {
  let order
  var paytmchecksum = ""
  var paytmparams = {}

  const received_data = req.body
  for (var key in received_data) {
    if (key == "CHECKSUMHASH") {
      paytmchecksum = received_data[key]
    }
    else {
      paytmparams[key] = received_data[key]
    }
  }

  var isVerifySignature = PaytmChecksum.verifySignature(paytmparams, process.env.PAYTM_MKEY, paytmchecksum);
  if (!isVerifySignature) {
    console.log("Checksum Matched");
    res.status(500).send("Some error occured")
    return
  } 


  if (req.body.status == 'TXN_SUCCESS') {

    order = await Order.findOneAndUpdate({ orderId: req.body.ORDERID }, { status: 'Paid', paymentInfo: JSON.stringify(req.body),transactionid:req.body.TXNID })
    let products = order.products
    for (let slug in products) {
      await Product.findOneAndUpdate({ slug: slug }, { $inc: { "availableQty": -products[slug].qty } })
    }
  }
  else if (req.body.STATUS == 'PENDING') {
    order = await Order.findOneAndUpdate({ orderId: req.body.ORDERID }, { status: 'Pending', paymentInfo: JSON.stringify(req.body),transactionid:req.body.TXNID  })
  }
  res.redirect('/order?clearCart=1&id=' + order._id, 200)
}
export default connectDb(handler)