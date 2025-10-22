import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust path to your prisma instance
import authAdmin from "@/middlewares/authAdmin";
import { inngest } from "@/inngest/client";

// Add new coupon
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const isAdmin = await authAdmin(userId);
        
        if (!isAdmin) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }
        
        const body = await request.json();
        console.log("Received body:", body); // Debug log
        
        // Handle both formats: { coupon: {...} } or direct {...}
        const couponData = body.coupon || body;
        
        // Validate required fields
        if (!couponData.code) {
            return NextResponse.json({ 
                error: "Coupon code is required" 
            }, { status: 400 });
        }
        
        // Convert code to uppercase
        const normalizedCoupon = {
            ...couponData,
            code: couponData.code.toUpperCase()
        };
        
        return await prisma.coupon.create({
            data: normalizedCoupon
        })
        .then(async (coupon) => {
            // Schedule Inngest event for coupon expiration
            if (coupon.expiresAt) {
                await inngest.send({
                    name: "app/coupon.expired",
                    data: {
                        couponId: coupon.id,
                        code: coupon.code,
                        expiresAt: coupon.expiresAt
                    },
                    ts: new Date(coupon.expiresAt).getTime() // Schedule for expiration time
                });
            }
            
            return NextResponse.json({ 
                message: "Coupon created successfully", 
                coupon: coupon 
            });
        });
        
    } catch (error) {
        console.error("POST /api/admin/coupons error:", error);
        return NextResponse.json({ 
            error: error.message || "Failed to create coupon"
        }, { status: 400 });
    }
}
// Delete coupon
export async function DELETE(request) {
    try {
        const { userId } = getAuth(request); // ✅ Pass request
        const isAdmin = await authAdmin(userId);

        if (!isAdmin) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url); // ✅ Create URL object
        const code = searchParams.get("code");
        
        if (!code) {
            return NextResponse.json({ error: "Code parameter required" }, { status: 400 });
        }

        await prisma.coupon.delete({
            where: { code }
        });

        return NextResponse.json({ message: "Coupon deleted successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ 
            error: error.code || error.message 
        }, { status: 400 });
    }
}

// Get all coupons
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const isAdmin = await authAdmin(userId);

        if (!isAdmin) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        const coupons = await prisma.coupon.findMany({});
        return NextResponse.json({ coupons });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ 
            error: error.code || error.message 
        }, { status: 400 });
    }
}