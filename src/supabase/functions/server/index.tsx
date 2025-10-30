import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Health check endpoint
app.get("/make-server-05166478/health", (c) => {
  return c.json({ status: "ok" });
});

// User signup endpoint
app.post("/make-server-05166478/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Auth signup error: ${error}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Signup error: ${error}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Upload Excel file endpoint
app.post("/make-server-05166478/upload", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user?.id || authError) {
      console.log(`Auth error during upload: ${authError}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    const fileName = `${user.id}/${Date.now()}_${file.name}`;
    const bucketName = 'make-05166478-files';

    // Create bucket if it doesn't exist
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName);
    }

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file);

    if (uploadError) {
      console.log(`File upload error: ${uploadError}`);
      return c.json({ error: "File upload failed" }, 500);
    }

    // Store file metadata in KV store
    const fileMetadata = {
      id: crypto.randomUUID(),
      userId: user.id,
      fileName: file.name,
      originalName: file.name,
      storagePath: fileName,
      uploadedAt: new Date().toISOString(),
      size: file.size,
      type: file.type
    };

    await kv.set(`file:${fileMetadata.id}`, fileMetadata);
    await kv.set(`user_files:${user.id}:${fileMetadata.id}`, fileMetadata);

    return c.json({ 
      message: "File uploaded successfully",
      fileId: fileMetadata.id,
      fileName: file.name
    });
  } catch (error) {
    console.log(`Upload processing error: ${error}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get user's uploaded files
app.get("/make-server-05166478/files", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user?.id || authError) {
      console.log(`Auth error during files fetch: ${authError}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const files = await kv.getByPrefix(`user_files:${user.id}:`);
    return c.json({ files });
  } catch (error) {
    console.log(`Files fetch error: ${error}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Generate AI insights for uploaded data
app.post("/make-server-05166478/insights", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user?.id || authError) {
      console.log(`Auth error during insights generation: ${authError}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { fileId, data } = await c.req.json();
    
    // Mock AI insights generation (in a real app, you'd integrate with OpenAI or similar)
    const insights = [
      "Your data shows a strong upward trend over time",
      "Peak performance occurs in Q3 consistently",
      "There's a 23% correlation between variables A and B",
      "Seasonal patterns suggest planning for Q4 dips"
    ];

    const insightData = {
      id: crypto.randomUUID(),
      fileId,
      userId: user.id,
      insights,
      generatedAt: new Date().toISOString()
    };

    await kv.set(`insights:${insightData.id}`, insightData);
    await kv.set(`file_insights:${fileId}`, insightData);

    return c.json({ insights: insightData });
  } catch (error) {
    console.log(`Insights generation error: ${error}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get chart data from uploaded file
app.get("/make-server-05166478/chart-data/:fileId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user?.id || authError) {
      console.log(`Auth error during chart data fetch: ${authError}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const fileId = c.req.param('fileId');
    const fileMetadata = await kv.get(`file:${fileId}`);
    
    if (!fileMetadata || fileMetadata.userId !== user.id) {
      return c.json({ error: "File not found or access denied" }, 404);
    }

    // Mock chart data (in a real app, you'd parse the Excel file)
    const chartData = {
      columns: ['Month', 'Sales', 'Profit', 'Customers'],
      data: [
        { Month: 'Jan', Sales: 4000, Profit: 2400, Customers: 240 },
        { Month: 'Feb', Sales: 3000, Profit: 1398, Customers: 221 },
        { Month: 'Mar', Sales: 2000, Profit: 9800, Customers: 229 },
        { Month: 'Apr', Sales: 2780, Profit: 3908, Customers: 200 },
        { Month: 'May', Sales: 1890, Profit: 4800, Customers: 218 },
        { Month: 'Jun', Sales: 2390, Profit: 3800, Customers: 250 },
      ]
    };

    return c.json({ chartData });
  } catch (error) {
    console.log(`Chart data fetch error: ${error}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

Deno.serve(app.fetch);