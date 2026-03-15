# Task Manager

A modern, full-stack task management web application built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Create Tasks**: Add new tasks with title, description, status, and due dates
- **View Tasks**: Display all tasks in a clean, responsive grid layout
- **Edit Tasks**: Update task details at any time
- **Delete Tasks**: Remove completed or unwanted tasks
- **Task Status**: Track tasks with three statuses - To Do, Doing, and Done
- **Due Dates**: Set and track task deadlines with visual overdue indicators
- **Validation**: Form validation ensures required fields are filled
- **Error Handling**: Friendly error messages for failed operations
- **Real-time Updates**: See changes immediately as they're saved to the database
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Database**: Supabase (PostgreSQL)
- **ORM**: Supabase JavaScript Client

## Project Structure

```
src/
├── components/          # React components
│   ├── TaskForm.tsx    # Form for creating/editing tasks
│   ├── TaskList.tsx    # Displays list of tasks
│   ├── TaskCard.tsx    # Individual task card
│   ├── StatusBadge.tsx # Status indicator
│   ├── ErrorAlert.tsx  # Error messages
│   └── LoadingSpinner.tsx # Loading state
├── hooks/              # Custom React hooks
│   └── useTasks.ts     # Task management hook
├── lib/                # Utility libraries
│   └── supabase.ts     # Supabase client setup
├── types/              # TypeScript types
│   └── index.ts        # Task and form data types
├── utils/              # Utility functions
│   └── dateUtils.ts    # Date formatting utilities
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm/yarn/pnpm
- A Supabase account (free tier available at https://supabase.com)

### Environment Setup

1. **Clone or download the project**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the project root with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   You can find these values in your Supabase dashboard:
   - Project Settings → API
   - Copy the Project URL and Anon Key

### Database Setup

The database schema is automatically created when you run the application. It includes:

- **tasks table** with columns:
  - `id` (UUID, primary key)
  - `title` (text, required)
  - `description` (text, optional)
  - `status` (enum: todo, doing, done)
  - `due_date` (timestamp, optional)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

Row Level Security (RLS) policies are configured to allow all authenticated and anonymous users to perform CRUD operations.

## Running the Application

### Development

```bash
npm run dev
```

The application will start at `http://localhost:5173` (or another available port).

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Type Checking

```bash
npm run typecheck
```

Verify TypeScript types without building.

### Linting

```bash
npm run lint
```

Check code quality with ESLint.

## Usage Guide

### Creating a Task

1. Fill in the "Task Title" field (required)
2. Optionally add a description
3. Select a status from the dropdown (defaults to "To Do")
4. Optionally set a due date
5. Click "Add Task" to save

### Editing a Task

1. Click the edit icon (pencil) on any task card
2. Modify the task details
3. Click "Add Task" to save changes or "Cancel" to discard

### Deleting a Task

1. Click the delete icon (trash) on any task card
2. The task is immediately removed

### Viewing Tasks

- All tasks are displayed in a responsive grid
- Tasks show their title, description preview, status badge, and due date
- Overdue tasks are highlighted in red
- Click the edit button to modify a task

## Validation

The application includes the following validation:

- **Title**: Required field, max 200 characters
- **Description**: Optional, max 1000 characters
- **Status**: Must be one of: todo, doing, done
- **Due Date**: Optional date picker

Error messages are displayed in the form if validation fails.

## API Reference

### useTasks Hook

Custom hook for managing tasks:

```typescript
const { tasks, loading, error, createTask, updateTask, deleteTask, setError } = useTasks();
```

- `tasks`: Array of all tasks
- `loading`: Boolean indicating if data is being fetched
- `error`: Error message if any operation fails
- `createTask(formData)`: Creates a new task
- `updateTask(id, formData)`: Updates an existing task
- `deleteTask(id)`: Deletes a task
- `setError(message)`: Manually set an error message

## Error Handling

The application provides friendly error messages for:
- Network failures
- Database errors
- Validation errors
- Missing required fields

All errors are displayed in a prominent alert at the top of the page and can be dismissed by clicking the X button.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Considerations

- Real-time updates via Supabase subscriptions
- Optimized component rendering with React hooks
- Tailwind CSS for minimal CSS bundle
- Lazy loading of task data on app startup

## Future Enhancements

Potential features for future versions:
- User authentication (login/register)
- Task categories and tags
- Priority levels
- Task search and filtering
- Task sorting options
- Task reminders and notifications
- Task templates
- Data export functionality
- Dark mode support

## Database & Persistence

### How Data is Stored

All task data is persisted in a Supabase PostgreSQL database. When you create, update, or delete a task:

1. The operation is sent to the Supabase API
2. Data is validated and stored in the `tasks` table
3. Real-time subscriptions notify the app of changes
4. The UI updates to reflect the current state

### Data Schema

The `tasks` table uses the following structure:

```sql
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'doing', 'done')),
  due_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Row Level Security (RLS)

The application uses Supabase RLS policies to ensure secure data access:

- **SELECT**: All users can read any task
- **INSERT**: All users can create new tasks
- **UPDATE**: All users can update any task
- **DELETE**: All users can delete any task

**Note**: This configuration is suitable for development and demo purposes. For production applications with user authentication, you should implement stricter RLS policies that restrict access to a user's own data.

### Data Backup & Recovery

Supabase automatically backs up your database. To export data:

1. Go to your Supabase Dashboard
2. Navigate to Project Settings → Backups
3. Create a manual backup or download data via SQL queries

### Database Limits

- Free tier: Up to 500 MB of database storage
- No concurrent connection limits
- Real-time subscriptions: Included with free tier

## Known Issues & Limitations

### Current Limitations

1. **No User Authentication**: All tasks are visible to all users. This is by design for a simple demo. Implement authentication for production use.

2. **No Task Categories**: Tasks cannot be organized by categories or projects.

3. **No Task Search**: Cannot search for tasks by title or description. Consider adding this feature for better usability.

4. **No Recurring Tasks**: Tasks don't support recurring schedules.

5. **Limited Sorting**: Tasks are displayed in the order returned from the database. Add sorting options for better organization.

6. **No Task Assignments**: Cannot assign tasks to specific users (would require authentication).

7. **No Attachments**: Tasks cannot have file attachments.

8. **No Comments**: Tasks don't support comments or notes from multiple users.

### Browser Compatibility

- The app works best in modern browsers (Chrome, Firefox, Safari, Edge)
- Internet Explorer is not supported
- Mobile browsers may have layout refinements needed for some edge cases

### Performance Notes

- The app loads all tasks on startup. For large datasets (1000+ tasks), consider implementing pagination
- Real-time updates may have slight latency depending on network speed
- Supabase free tier has rate limits (avoid bulk operations with 1000+ tasks)

### Known Bugs

- None currently reported. Please open an issue if you encounter problems.

## Troubleshooting

### Tasks not loading

**Symptoms**: "Loading..." spinner never completes or no tasks appear

**Solutions**:
- Check your Supabase credentials in `.env` file
- Ensure your Supabase project is active and running
- Open browser DevTools (F12) and check the Console tab for error messages
- Verify network connection with `ping supabase.co`
- Check that the `tasks` table exists in your Supabase database

### Cannot create tasks

**Symptoms**: "Add Task" button doesn't work or shows error

**Solutions**:
- Verify the title field is not empty (it's required)
- Check network connection
- Open DevTools Console for specific error messages
- Ensure Supabase credentials are correct
- Verify RLS policies allow INSERT operations

### Changes not persisting

**Symptoms**: Create/edit/delete operations seem to work but changes disappear

**Solutions**:
- Ensure database connection is active (check network tab in DevTools)
- Verify Row Level Security policies on the `tasks` table
- Confirm JavaScript is enabled in your browser
- Try clearing browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- Check Supabase project status in the dashboard

### Validation errors

**Symptoms**: Form shows validation errors that seem incorrect

**Solutions**:
- Title must not be empty and should be under 200 characters
- Due date must be a valid date
- Status must be one of: "todo", "doing", or "done"
- Check the error message text for specific guidance

### Styling looks broken

**Symptoms**: Colors, spacing, or layout appears incorrect

**Solutions**:
- Ensure Tailwind CSS is properly built (run `npm run build`)
- Clear browser cache and refresh the page
- Check that `tailwind.config.js` hasn't been modified
- Verify all CSS imports are present in `index.css`

### Application won't start

**Symptoms**: Dev server fails to start or shows build errors

**Solutions**:
- Ensure Node.js 16+ is installed: `node --version`
- Delete `node_modules` and `package-lock.json`, then run `npm install`
- Check that all required environment variables are in `.env`
- Run `npm run typecheck` to identify TypeScript issues
- Try running `npm run lint` to find code issues

## Support & Contributing

### Getting Help

For issues or questions:

1. **Check the console**: Open DevTools (F12) → Console tab for error details
2. **Verify setup**: Confirm Supabase credentials and database configuration
3. **Review logs**: Check network requests in DevTools → Network tab
4. **Test connection**: Ensure you can access `https://supabase.com`

### Reporting Bugs

When reporting bugs, include:
- Steps to reproduce the issue
- Browser and OS information
- Error messages from the console
- Supabase project status

### Feature Requests

Suggested enhancements are welcome. Some popular requests:
- User authentication and task ownership
- Task filtering and search
- Task prioritization
- Recurring tasks
- Email reminders
- Dark mode support
- Export to PDF/CSV
- Task templates

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Build the project
npm run build

# Deploy the dist folder to Netlify
# Option 1: Use Netlify CLI
npm i -g netlify-cli
netlify deploy --prod --dir=dist

# Option 2: Drag and drop dist folder to app.netlify.com
```

### Environment Variables for Production

When deploying, ensure your hosting platform has:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

These are safe to expose as they're frontend credentials.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Changelog

### Version 1.0.0 (Initial Release)
- Create, read, update, delete tasks
- Task status tracking (todo, doing, done)
- Due date management
- Form validation
- Error handling
- Responsive UI design
- Real-time database integration with Supabase
