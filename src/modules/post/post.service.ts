import { CommentStatus, PostStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface"

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
const  getAllPost=async()=>{
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