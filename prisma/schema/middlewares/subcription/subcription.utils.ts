import Stripe from "stripe"
import { SubscriptionStatus } from "../../../../generated/prisma/enums"
import { prisma } from "../../../../src/lib/prisma"
import { stripe } from "../../../../src/lib/stripe"

export const getPeriodEnd=(payload:Stripe.Subscription)=>{
  const currentPeriodEndInMiliseconds=payload.items.data[0]?.current_period_end!
const currentPeriodEnd= new Date(currentPeriodEndInMiliseconds*1000)
return currentPeriodEnd
}
export const handleCheckOutCompleted=async (session:Stripe.Checkout.Session)=>{

      const userId=session.metadata?.userId 
      const stripeCustomerId=session.customer as string
      const stripeSubcriptionId=session.subscription as string

      if(!userId || !stripeSubcriptionId || !stripeCustomerId){
console.log("Webhook : Missing value for Creating checkout session");
return
      }

      const stripeSubcription=await stripe.subscriptions.retrieve(stripeSubcriptionId)
    console.log("sub info",stripeSubcription.items.data[0])
  const currentPeriodEnd=getPeriodEnd(stripeSubcription)

await prisma.subscription.upsert({
    where :{
        userId
    },
    create:{
userId,
stripeCustomerId,
stripeSubcriptionId,
status:"ACTIVE",
currentPeriodEnd,
    },
    update:{
stripeCustomerId,
stripeSubcriptionId,
status:"ACTIVE",
currentPeriodEnd
    }
})
}

 export const handleChangedSubcription=async(payload:Stripe.Subscription)=>{
const stripeSubcriptionId=payload.id
const status=payload.status ==="active"?SubscriptionStatus.ACTIVE:
payload.status==="trialing"?SubscriptionStatus.ACTIVE:
payload.status==="canceled"?SubscriptionStatus.CANCELED:SubscriptionStatus.EXPIRED

const currentPeriodEnd=getPeriodEnd(payload)

const isSubcriptionExist=await prisma.subscription.findUnique({
    where:{
stripeSubcriptionId
    }
})

if(!isSubcriptionExist){
    console.log(`webhook:No subcription found for subcription id:${stripeSubcriptionId}`)
return ;
}
await prisma.subscription.update({
    where:{
        stripeSubcriptionId
    },
    data:{
        status,
        currentPeriodEnd
    }
})
}
