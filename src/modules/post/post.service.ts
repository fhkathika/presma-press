import { CommentStatus, PostStatus } from "../../../generated/prisma/enums"
import { PostWhereInput } from "../../../generated/prisma/models"
import { prisma } from "../../lib/prisma"
import { ICreatePostPayload, IPostQuery, IUpdatePostPayload } from "./post.interface"

const createPost=async(payload:ICreatePostPayload,userId :string)=>{
   const result=await prisma.post.create({
     data:{
        ...payload,
        authorId:userId
     }
   })
   return result
}
const getPostStatus=async()=>{
    
const trasetionResult=await prisma.$transaction(
    async(tx)=>{
// const totalPosts=await tx.post.count();
// const totalPublishedPost=await tx.post.count({
//     where:{
//         status:PostStatus.PUBLISHED
//     }
// })
// const totalDraftPost=await tx.post.count({
//     where:{
//         status:PostStatus.DRAFT
//     }
// })
// const totalArchivedPost=await tx.post.count({
//     where:{
//         status:PostStatus.ARCHIVED
//     }
// })

// const totalComments=await tx.comment.count()
// const totalApprovedComments=await tx.comment.count({
//     where:{
// status:CommentStatus.APPROVED
//     }
// })
// const totalRejectedApprovedComments=await tx.comment.count({
//     where:{
// status:CommentStatus.REJECT
//     }
// })

// const allPosts=await tx.post.findMany();
// const totalPostViewsAggregate=await tx.post.aggregate({
//     _sum :{
//         views:true
//     }
// })
//  const totalPostViews=totalPostViewsAggregate._sum.views
 const [   
     totalPosts,
    totalPublishedPost,
    totalDraftPost,
    totalArchivedPost,
    totalComments,
    totalApprovedComments,
    totalRejectedApprovedComments,
    totalPostViews]=await Promise.all([
await tx.post.count(),
await tx.post.count({
    where:{
        status:PostStatus.PUBLISHED
    }
}),
tx.post.count({
    where:{
        status:PostStatus.DRAFT
    }
}),
await tx.post.count({
    where:{
        status:PostStatus.ARCHIVED
    }
}),
await tx.comment.count({
    where:{
status:CommentStatus.APPROVED
    }
}),
await tx.comment.count({
    where:{
status:CommentStatus.REJECT
    }
}),
await tx.comment.count(),
await tx.post.aggregate({
    _sum :{
        views:true
    }
})

 ])

return {
     totalPosts,
    totalPublishedPost,
    totalDraftPost,
    totalArchivedPost,
    totalComments,
    totalApprovedComments,
    totalRejectedApprovedComments,
    totalPostViews
}
    }
)
return trasetionResult
}

const getMyPosts=async(authorId :string)=>{
const result=await prisma.post.findMany({


where:{
    authorId
},
orderBy:{
    createdAt:"desc"
},
include:{
    comments:true,
    author:{
        omit:{
            password:true
        }
    },
    _count:{
        select:{
            comments:true
        }
    }
}
});
return result
}


const  getAllPost=async(query:IPostQuery)=>{
    const limit=query.limit?Number(query.limit):10
    const page=query.page?Number(query.page):1
    const skip=(page-1)*limit
    const sortBy=query?.sortBy?query?.sortBy:"createdAt"
    const sortOrder=query?.sortOrder?query?.sortOrder:"desc"
    const andConditioins: PostWhereInput[]=[]
    const tags=query.tags?JSON.parse(query.tags as string):null
    const tagsArray=Array.isArray(tags)?tags:[]
console.log("first")
if(query.searchTerm){
andConditioins.push({
      OR:[
{
   title:{
    contains:"Ronado",
    mode:"insensitive"
   } 
},
{
    content:{
        contains:"Ronaldo",
        mode:"insensitive"
    }
}
    ]
})
}
if(query.title){
    andConditioins.push({
        title:query.title
    })
}
if(query.content){
    andConditioins.push({
        content:query.content
    })
}
if(query.authorId){
    andConditioins.push({
        authorId:query.authorId
    })
}
if(query.isFeatured){
    andConditioins.push({
        isFeatured:query.isFeatured
    })
}
if(query.tags){
    andConditioins.push({
        tags:{
            hasSome:tagsArray
        }
    })
}
if(query.status){
    andConditioins.push({
        status:query.status
        
    })
}
const posts=await prisma.post.findMany({

    //filter or exact match 
    // where:{
    //     title:"Getting Started with TypeScript post 2"  
    //   },
//     where:{
// AND:[
//     {
//         title:"Getting Started with TypeScript post 2",
//     },
//     {
//         content:"Ronaldo"
//     }
// ]
//     },

//search or partial matching 
// where:{
//     title:{
//         contains:"Ronaldo",
//         mode:"insensitive"

//     },
//     content:{
//       contains:"Ronaldo"
//     }
// },

// where:{
//     OR:[
// {
//    title:{
//     contains:"Ronado",
//     mode:"insensitive"
//    } 
// },
// {
//     content:{
//         contains:"Ronaldo",
//         mode:"insensitive"
//     }
// }
//     ]
// },

// page= 3 ,limit/take=10=>skip(page-1)*limit
    
// where:{
// AND:[
//     query.searchTerm?{
// OR:[
//     {
//     title:{
//         contains:query.searchTerm,
//         mode:"insensitive"
//     },
   
// },
// {
//       content:{
//         contains:query.searchTerm,
//         mode:"insensitive"
//     },
// }
// ]

//     }:{},
//         query.title?{title:query.title}:{},
//         query.content?{content:query.content}:{}
    
// ]
// },
where:{
    AND:andConditioins
},
take:limit,
skip:skip,
orderBy:{
    //sortBy:sortOrder
[sortBy]:sortOrder
},
include:{
        author:{
            omit:{password:true}
        },
        comments:true
    }
});
return posts
}
const  getMyPostsById =async(postId:string)=>{
// const post=await prisma.post.findUniqueOrThrow({
//     where:{
//         id:postId
//     }
// })

// await prisma.post.update({
//     where:{
//         id:postId
//     },
//     data:{
//         views:{
//             increment:1
//         }
//     },


// })
//   const post=await prisma.post.findUniqueOrThrow({
//     where:{
//         id:postId
//     },
 
//   include:{
//     author:{
//         omit:{
//             password:true
//         }
//     },
//     comments:{
//         where:{
//             status:CommentStatus.APPROVED
//         },
//         orderBy:{
//             createdAt:"desc"
//         }
//     },
//     _count:{
//         select:{
//             comments:true
//         }
//     }
//   }
//    })
// return post

const transectionResult=await prisma.$transaction(
    async(tx)=>{
await tx.post.update({
   where:{
        id:postId
    },
    data:{
        views:{
            increment:1
        }
    }, 


});
// throw new Error("fake error")
  const post=await tx.post.findUniqueOrThrow({
    where:{
        id:postId
    },
 
  include:{
    author:{
        omit:{
            password:true
        }
    },
    comments:{
        where:{
            status:CommentStatus.APPROVED
        },
        orderBy:{
            createdAt:"desc"
        }
    },
    _count:{
        select:{
            comments:true
        }
    }
  }
   });
   return post
    }
);

return transectionResult


}
const  updatePost=async(postId:string,payload:IUpdatePostPayload,authorId:string,isAdmin:boolean)=>{
const post=await prisma.post.findFirstOrThrow({
where:{
    id:postId
}
})
if(!isAdmin && post.authorId!==authorId){
throw new Error("You are noit the owner of this post")
}

const result =await prisma.post.update({
where:{
    id:postId
},
data:payload,
 include:{
        author:{
omit:{
    password:true
}
        },
          comments:true
    },
})
return result;

}
const deletePost=async(postId:string,authorId:string,isAdmin:boolean)=>{
const post=await prisma.post.findFirstOrThrow({
where:{
    id:postId
}
})
if(!isAdmin && post.authorId!==authorId){
throw new Error("You are noit the owner of this post")
}
await prisma.post.delete({
    where:{
        id:postId
    }
})

}
export const postService={
    createPost,
    getPostStatus,
    getMyPosts,
    getMyPostsById,
    updatePost,
    deletePost,
    getAllPost,
    
   
}