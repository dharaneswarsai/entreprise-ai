# Entreprise AI OS — Deployment Guide (Vercel & Render)

This project is architected as two independently deployable applications:
- **Frontend**: Deployable to **Vercel** (`/frontend`)
- **Backend**: Deployable to **Render** as a Node.js Web Service (`/backend`)

---

## 1. Backend Deployment (Render)

### Step 1: Create a Web Service on Render
1. Connect your GitHub repository to [Render.com](https://render.com).
2. Choose **New > Web Service**.
3. Select your repository.
4. Configure the service settings:
   - **Name**: `entreprise-ai-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free or Starter

### Step 2: Configure Backend Environment Variables
In the Render dashboard under **Environment**:
| Variable | Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Production mode |
| `PORT` | `10000` | Port automatically assigned by Render |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` | Allowed CORS origin |
| `AI_PROVIDER` | `grounded_engine` | Default: `grounded_engine` (or `openai`) |
| `AI_API_KEY` | *(Optional)* | Optional OpenAI/Anthropic key |
| `DATABASE_URL` | *(Optional)* | Optional Supabase PostgreSQL connection string |

### Step 3: Verify Backend Deployment
Once deployed, check:
```bash
curl https://<your-render-service>.onrender.com/api/health
```
Expected output:
```json
{
  "status": "healthy",
  "service": "Entreprise AI Backend Operations Engine",
  "version": "1.0.0"
}
```

---

## 2. Frontend Deployment (Vercel)

### Step 1: Import Project into Vercel
1. In [Vercel](https://vercel.com), select **Add New > Project**.
2. Select your repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 2: Configure Frontend Environment Variables
In the Vercel project settings under **Environment Variables**:
| Variable | Value |
| :--- | :--- |
| `VITE_API_BASE_URL` | `https://<your-render-service>.onrender.com` |

*(For local development, this defaults to `http://localhost:10000`)*

### Step 3: Deploy & Verify
1. Click **Deploy**.
2. Vercel will bundle the Vite React app and deploy to production.
3. Open the production URL, test logging in, viewing the Command Center, running a Workflow test run, and querying the AI Brain!
