# Quick Start Guide

Get your task manager up and running in 5 minutes.

## Prerequisites

- Node.js 16+ ([Download](https://nodejs.org/))
- npm or yarn
- A Supabase account ([Free signup](https://supabase.com))

## Step 1: Clone or Download

Download this project and navigate to its directory:

```bash
cd task-manager
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Get Supabase Credentials

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Create a new project or open an existing one
3. Click "Settings" in the left sidebar
4. Click "API" under "Configuration"
5. Copy the **Project URL** and **Anon Key**

## Step 4: Configure Environment

Create a `.env` file in the project root:

```bash
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with values from Step 3.

## Step 5: Run the App

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. Done!

## What You Can Do

- ✅ Create new tasks with title and description
- ✅ Set task status (To Do, Doing, Done)
- ✅ Add due dates to tasks
- ✅ Edit existing tasks
- ✅ Delete tasks
- ✅ All data automatically saves to your Supabase database

## Useful Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Check for type errors
npm run typecheck

# Check code quality
npm run lint

# Preview production build
npm run preview
```

## Troubleshooting

### "Cannot find module" errors
```bash
# Delete and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "VITE_SUPABASE_URL is not defined"
- Make sure `.env` file exists in the project root (same level as `package.json`)
- Restart the dev server after creating `.env`

### Tasks don't save
- Check browser console (F12) for errors
- Verify Supabase credentials in `.env` are correct
- Ensure your Supabase project is active

### Application won't start
```bash
# Try clearing cache
npm run build

# Check Node version
node --version  # Should be 16+
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the code in `src/` directory to understand the structure
- Check `src/hooks/useTasks.ts` to see how tasks are managed
- Customize styling in `tailwind.config.js`

## Need Help?

1. Check the browser console for error messages
2. Verify `.env` file has correct Supabase credentials
3. Visit [Supabase docs](https://supabase.com/docs) for platform help
4. See the [README.md](README.md) Troubleshooting section for more solutions

Enjoy managing your tasks!
