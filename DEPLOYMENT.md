# Deploy Todo App to Vercel

## Prerequisites
1. **GitHub Account** - Your code needs to be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free)

## Step 1: Prepare Your Code

Your app is already configured for Vercel deployment with:
- ✅ `vercel.json` configuration file
- ✅ `api/index.ts` serverless function entry point
- ✅ Build scripts in `package.json`

## Step 2: Push to GitHub

1. **Create a new repository** on GitHub
2. **Push your code** to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Todo App"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

## Step 3: Deploy on Vercel

### Option A: Vercel Website (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. **Import your GitHub repository**
4. Vercel will auto-detect it's a Node.js project
5. **Configure these settings:**
   - **Build Command**: `npm run build` (should be auto-detected)
   - **Output Directory**: `dist/public` (should be auto-detected)
   - **Install Command**: `npm install` (should be auto-detected)
6. Click **"Deploy"**

### Option B: Vercel CLI
1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```
2. **Login to Vercel**:
   ```bash
   vercel login
   ```
3. **Deploy your app**:
   ```bash
   vercel
   ```
4. Follow the prompts and answer:
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N**
   - Project name? (press enter for default)
   - Directory? (press enter for current)

## Step 4: Your App is Live!

After deployment:
- ✅ **Frontend** will be served from Vercel's CDN
- ✅ **Backend API** will run as serverless functions
- ✅ **Your app URL** will be something like: `https://your-app-name.vercel.app`

## Important Notes

### Data Storage
- Your app uses **in-memory storage**, so data will reset on each deployment
- For persistent data, consider:
  - **Vercel PostgreSQL** (paid)
  - **PlanetScale** (free tier)
  - **Supabase** (free tier)
  - **Neon** (free tier)

### API Routes
- All your `/api/*` routes will work automatically
- Example: `https://your-app-name.vercel.app/api/todos`

### Environment Variables
If you need environment variables:
1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add your variables (like `DATABASE_URL`)

## Troubleshooting

### Build Errors
- Check the **build logs** in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Make sure TypeScript types are correct

### API Not Working
- Check **Function Logs** in Vercel dashboard
- Verify API routes work locally first
- Ensure CORS is properly configured

### 404 Errors
- Check that `vercel.json` rewrites are correct
- Verify build output is in correct directory

## Free Tier Limits
- **Bandwidth**: 100GB per month
- **Function Executions**: 100GB-hours per month
- **Function Duration**: 10 seconds max
- **Build Time**: 6 hours per month

These limits are very generous for most todo apps!

## Next Steps
1. Push your code to GitHub
2. Connect to Vercel
3. Deploy and share your live todo app!