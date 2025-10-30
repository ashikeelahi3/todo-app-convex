import dotenv from "dotenv"
dotenv.config({ path: '.env.local' })

console.log("------------------")
console.log(process.env.CONVEX_DEPLOYMENT)