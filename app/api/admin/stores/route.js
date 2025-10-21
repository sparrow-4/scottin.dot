import prisma from "@/lib/prisma"
import authAdmin from "@/middlewares/authAdmin"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// get all approved stores
export async function GET(request){
    try {
        const { userId } = await auth()
        const isAdmin = await authAdmin(userId)
         
        if(!isAdmin){
            return NextResponse.json({
                error: 'Not authorized'
            }, { 
                status: 401
            })
        }

        const stores = await prisma.store.findMany({
            where:{
                status: 'approved'  // Fixed: removed { in: } wrapper
            },
            include: { 
                user: true 
            }
        })
        
        return NextResponse.json({ stores })

    } catch (error){
        console.error(error);
        return NextResponse.json({
            error: error.code || error.message
        }, { 
            status: 400
        })
    }
}