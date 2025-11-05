# NexusGK Focus - Pomodoro Timer

A beautiful and modern Pomodoro timer application inspired by [BeeFocus](https://beefocus.su/pomodoro), built with React, TypeScript, and Tailwind CSS.

## Features

### Timer & Focus
- ⏱️ **Smart Pomodoro Timer** - Customizable durations with auto-switching between modes
- 🎯 **Focus Mode** - Distraction-free fullscreen timer view
- ⚙️ **Customizable Settings** - Adjust timer durations, auto-start behavior, and intervals
- 🔔 **Smart Notifications** - Desktop notifications and sound alerts when sessions complete

### Task Management
- ✅ **Task Tracking** - Add, track, and complete tasks with estimated pomodoros
- 📝 **Task Progress** - Monitor pomodoros completed vs. estimated for each task
- ✨ **Task Organization** - Simple and intuitive task management interface

### Analytics & Goals
- 📊 **Analytics Dashboard** - Track daily and total sessions and minutes
- 🎯 **Daily Goals** - Set and track daily pomodoro goals
- 🔥 **Streak Tracking** - Monitor current and longest productivity streaks
- 📅 **Session History** - View detailed timeline of all completed sessions

### Productivity Tools
- 🎵 **Focus Sounds** - Ambient sounds (rain, ocean, wind) with volume control
- ⌨️ **Keyboard Shortcuts** - Quick controls for maximum efficiency
  - `Space/K`: Start/Pause • `R`: Reset • `S`: Skip • `N`: Next Mode • `Shift+,`: Settings
- 🎨 **Multiple Themes** - 6 beautiful color themes (Sunset, Ocean, Forest, Rose, Amber, Midnight)
- 💾 **Data Management** - Export, import, and backup all your data

### Design & UX
- 🎨 **Beautiful UI** - Modern glassmorphism design with smooth animations
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🌈 **Theme Customization** - Choose from multiple color schemes
- ⚡ **Fast & Lightweight** - Built with performance in mind

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm/yarn

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
pnpm build
```

The built files will be in the `dist` directory.

## Usage

### Getting Started
1. **Select a mode**: Choose between Pomodoro, Short Break, or Long Break
2. **Configure settings**: Click the Settings icon to customize timer durations and preferences
3. **Set daily goals**: Define how many pomodoros you want to complete each day
4. **Add tasks**: Create tasks with estimated pomodoros to stay organized

### During Work Sessions
1. **Start timer**: Click play or press `Space`/`K`
2. **Enter focus mode**: Click the fullscreen icon for distraction-free mode
3. **Use focus sounds**: Enable ambient sounds to help concentration
4. **Stay focused**: Work until the timer completes

### After Sessions
1. **Take breaks**: The app automatically switches to break mode
2. **Track progress**: View your stats, streaks, and session history
3. **Manage tasks**: Mark tasks as complete as you finish them
4. **Review history**: Check your session timeline to see your productivity patterns

### Data Management
- **Export Data**: Backup your tasks, sessions, and settings to a JSON file
- **Import Data**: Restore data from a backup file
- **Clear Data**: Reset all data if needed (use with caution!)

## Keyboard Shortcuts

Maximize your productivity with these shortcuts:

| Shortcut | Action |
|----------|--------|
| `Space` or `K` | Start / Pause timer |
| `R` | Reset current timer |
| `S` | Skip current session |
| `N` | Switch to next mode |
| `Shift + ,` | Open settings |
| `Esc` | Exit focus mode |

## Pomodoro Technique

The Pomodoro Technique is a time management method:

1. Work for 25 minutes (1 Pomodoro)
2. Take a 5-minute break
3. After 4 Pomodoros, take a longer 15-minute break

This app lets you customize these durations in the settings!

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Credits

Inspired by [BeeFocus](https://beefocus.su/pomodoro)

## License

MIT License
