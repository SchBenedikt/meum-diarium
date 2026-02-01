import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "sqlite",
    driver: "d1-http",
    dbCredentials: {
        accountId: "YOUR_ACCOUNT_ID", // This is usually optional/inferred for local dev with wrangler, but good to have
        databaseId: "0cf71203-f07c-46b2-8f52-765929a25d24",
        token: "YOUR_API_TOKEN", // Only needed for remote pushes without wrangler
    },
});
