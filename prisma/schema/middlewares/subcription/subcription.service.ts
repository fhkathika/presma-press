import Stripe from "stripe"
import config from "../../../../src/config"
import { prisma } from "../../../../src/lib/prisma"
import { stripe } from "../../../../src/lib/stripe"
import status from "http-status"
import { SubscriptionStatus } from "../../../../generated/prisma/enums"
import { handleChangedSubcription, handleCheckOutCompleted } from "./subcription.utils"

const createCheckOutSession=async(userId:string)=>{

    console.log("createCheckOutSession called")
const transectionResult=await prisma.$transaction(async(tx)=>{
const user=await tx.user.findUniqueOrThrow({
    where:{
        id:userId
    },
    include:{
        subscription:true
    }
})
let stripeCustomerId=user.subscription?.stripeCustomerId
if(!stripeCustomerId){
    const customer=await stripe.customers.create({
    email:user.email,
    name:user.name,
    metadata:{userId:user.id}
})
stripeCustomerId=customer.id
}

const session=await stripe.checkout.sessions.create({
    line_items:[
{
    price:config.stripe_product_key,
    quantity:1

}

    ],
    mode:"subscription",
    customer:stripeCustomerId,
    payment_method_types:["card"],
    success_url:`${config.app_url}/premium?success=true`,
    cancel_url:`${config.app_url}/payment?success=false`,
    metadata:{userId:user.id}
})
return session.url
})
 return {
    paymentUrl:transectionResult
 }
}
const handleWebhook=async(payload:Buffer,signature:string)=>{
    console.log("handleWebhook called")
  const endpointSecrect=config.sripe_webhook_secret
  const event=stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecrect
  )

   switch (event.type) {
    case 'checkout.session.completed':
     await handleCheckOutCompleted(event.data.object)
      break;
    case 'customer.subscription.updated':
      const paymentMethod = event.data.object;
  await handleChangedSubcription(event.data.object)
      break;
      case 'customer.subscription.deleted':
        await handleChangedSubcription(event.data.object)
        break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
      break;
  }
}





export const subcriptionServices={
    createCheckOutSession,
    handleWebhook
}