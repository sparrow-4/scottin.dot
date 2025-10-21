import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { deleteExpiredCoupons, syncUserCreation, syncUserDeletion, syncUserUpdation } from "@/inngest/functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
    deleteExpiredCoupons
    /* your functions will be passed here later! */
  ],
});