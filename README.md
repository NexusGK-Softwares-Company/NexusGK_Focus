# NexusGK Focus - Pomodoro Timer

A beautiful and modern Pomodoro timer application inspired by [BeeFocus](https://beefocus.su/pomodoro), built with React, TypeScript, and Tailwind CSS.

## Features

- ⏱️ **Smart Pomodoro Timer** - 25/5/15 minute intervals with auto-switching
- ✅ **Task Management** - Add, track, and complete tasks with estimated pomodoros
- 📊 **Analytics Dashboard** - Track your daily and total sessions
- 🎵 **Focus Sounds** - Ambient sounds (rain, ocean, wind) to help concentration
- 🎨 **Beautiful UI** - Modern glassmorphism design with smooth animations
- 🔔 **Notifications** - Desktop notifications when timer completes
- 💾 **Data Persistence** - All data saved in browser localStorage
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile

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

1. **Select a mode**: Choose between Pomodoro (25 min), Short Break (5 min), or Long Break (15 min)
2. **Add tasks**: Click "Add Task" to create a new task with estimated pomodoros
3. **Start timer**: Click the play button to start the timer
4. **Stay focused**: Work until the timer completes
5. **Take breaks**: The app automatically switches to break mode after each pomodoro
6. **Track progress**: View your daily and total statistics in the dashboard

## Pomodoro Technique

The Pomodoro Technique is a time management method:

1. Work for 25 minutes (1 Pomodoro)
2. Take a 5-minute break
3. After 4 Pomodoros, take a longer 15-minute break

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
