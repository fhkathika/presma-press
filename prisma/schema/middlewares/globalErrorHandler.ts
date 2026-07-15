import { Response ,Request,NextFunction} from "express"
import httpStatus from "http-status"
import { Prisma } from "../../../generated/prisma/client"
export const globalErrorHandler=(err:any,req:Request,res:Response,next:NextFunction)=>{
    let statusCode
    let errorMessage=err.message || "Internal Server Error"
      let errorName=err.name || "Internal Server Error"
    //   let errorDetail=err.stack
if(err instanceof Prisma.PrismaClientValidationError){
     statusCode=httpStatus["400_NAME"]
     errorMessage="You have provided incorrerct field type or missing fields"
  
}
else if(err instanceof Prisma.PrismaClientKnownRequestError){
   if(err.code==="P2002") {
      statusCode=httpStatus["400_NAME"],
           errorMessage="Duplicate key error"
   }
   else if(err.code==="P2003") {
      statusCode=httpStatus["400_NAME"],
           errorMessage="Forgin key constraint field"
   }
   else if(err.code==="P2025") {
      statusCode=httpStatus["400_NAME"],
           errorMessage="An operation failed because it depends on one or more records that were required but not found"
   }
}
else if(err instanceof Prisma.PrismaClientInitializationError){
    if(err.errorCode==="P1000"){
 statusCode=httpStatus.UNAUTHORIZED
     errorMessage="Authentication Failed against database server.PLease Check your credentials"
    }
   else if(err.errorCode==="P1001"){
 statusCode=httpStatus.BAD_REQUEST
     errorMessage="Can't Reach databse server"
    }
  
      
}
 else if(err instanceof Prisma.PrismaClientUnknownRequestError){
 statusCode=httpStatus.INTERNAL_SERVER_ERROR
     errorMessage="Error occurred during query EXECUTION"
    }

res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success:false,
    statusCode:statusCode || httpStatus.INTERNAL_SERVER_ERROR,
    name:errorName,
    message:errorMessage,
    error:err.stack
})
    }