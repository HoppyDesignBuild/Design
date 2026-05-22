# Deploy in 5 Minutes

## What you need
- Free Vercel account: vercel.com
- OpenAI API key: platform.openai.com/api-keys

## Steps

### 1. Get an OpenAI API key
Go to platform.openai.com → API Keys → Create new key
Copy it. Cost is ~$0.08 per image generated.

### 2. Upload to GitHub
- Go to github.com → New repository → name it "hoppy-design-tool"
- Upload all these files (drag and drop the folder)
- Click "Commit changes"

### 3. Deploy on Vercel
- Go to vercel.com → Add New Project
- Import your GitHub repo
- Under "Environment Variables" add:
  - Name: OPENAI_API_KEY
  - Value: (paste your key)
- Click Deploy

Done. Vercel gives you a live URL in about 2 minutes.

### 4. Add your domain (optional)
In Vercel project settings → Domains → add hoppydesignbuild.com or similar.

## Local testing first (optional)
```
npm install
cp .env.example .env.local
# edit .env.local and add your real OpenAI key
npm run dev
# open http://localhost:3000
```
