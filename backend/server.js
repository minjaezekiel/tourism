require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const connectDB = require("./config/dbconfig");

// Routers
const userRouter = require("./routes/user.routes");
const contactRouter = require("./routes/contacts.routes");
const blogRouter = require("./routes/blog.routes");
const galleryRouter = require("./routes/gallery.routes");
const analyticsRouter = require("./routes/analytics.routes");
const tourRouter = require("./routes/tours.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// =======================
// MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false
  })
);

// =======================
// STATIC FILES (IMAGES)
// =======================
app.use("/img/gallery", express.static(path.join(__dirname, "public/img/gallery")));
app.use("/img/blog_uploads", express.static(path.join(__dirname, "public/img/blog_uploads")));
app.use("/img/tours", express.static(path.join(__dirname, "public/img/tours")));

// =======================
// API ROUTES
// =======================
app.use("/users", userRouter);
app.use("/contactUs", contactRouter);
app.use("/blog", blogRouter);
app.use("/gallery", galleryRouter);
app.use("/api/analytics", analyticsRouter);

// ✅ Tours routes accessible directly at /tours
app.use("/tours", tourRouter);

// =======================
// FRONTEND BUILD (SPA)
// =======================
const frontendPath = path.join(__dirname, "../tce_frontend/dist");
app.use(express.static(frontendPath, { index: false }));

// SPA catch-all (exclude API routes)
app.get(/^(?!\/(users|contactUs|blog|api|gallery|tours)).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// =======================
// START SERVER
// =======================
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
