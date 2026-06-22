# TurtleRocket Time Twister

Optimize your calendar around your energy levels. Import a `.ics` file from Google Calendar, Outlook, or Apple Calendar, tell the app when you feel most focused, and it will reorder your events to match — then export the result back as an `.ics` file.

Everything runs in the browser. No account, no server, no data leaves your computer.

---

## Prerequisites

You need two things installed before you can run this project:

### 1. Node.js (v16 or higher)

Node.js is a JavaScript runtime that lets you run the development server and tools on your computer.

1. Go to https://nodejs.org
2. Download the **LTS** version (the one labeled "Recommended For Most Users")
3. Run the installer and follow the default steps
4. Verify it worked: open a terminal and run:
   ```
   node --version
   ```
   You should see something like `v20.x.x`.

### 2. npm (comes with Node.js)

npm is the package manager that downloads the project's dependencies. It is installed automatically alongside Node.js. Verify it:

```
npm --version
```

You should see something like `10.x.x`.

> **What is a terminal?**
> - **Windows**: press `Win + R`, type `cmd`, press Enter — or search for "Command Prompt" in the Start menu.
> - **Mac**: open Spotlight (`Cmd + Space`), type "Terminal", press Enter.

---

## Running the App

### Step 1 — Get the code

If you received a zip file, unzip it. If the project is in a Git repository, clone it:

```
git clone <repository-url>
cd vibe-coding-turtle-rocket
```

### Step 2 — Go into the app folder

```
cd turtlerocket-time-twister
```

### Step 3 — Install dependencies

This downloads all the libraries the project needs. You only need to do this once.

```
npm install
```

This may take a minute or two. You will see a lot of output — that is normal.

### Step 4 — Start the development server

```
npm start
```

The terminal will print something like:

```
Compiled successfully!

You can now view turtlerocket-time-twister in the browser.

  Local:            http://localhost:3000
```

A browser tab will open automatically at `http://localhost:3000`. If it does not, open your browser and navigate there manually.

> Press `Ctrl + C` in the terminal to stop the server when you are done.

---

## Using the App

1. **Set your energy levels** — The grid shows hours from 8 AM to 8 PM. Click each hour block to mark it as low 🐢, medium 😐, or high 🚀 energy. Hover over a block to see a tooltip explaining the options. Click "Reset to Default" to start over.

2. **Upload your calendar** — Click "Choose an .ics file" and select an `.ics` file exported from your calendar app. Need a sample? There is a "Download a sample calendar" link below the upload button.
   - **Google Calendar**: Settings → Import & Export → Export
   - **Outlook**: File → Open & Export → Import/Export → Export to a file → iCalendar
   - **Apple Calendar**: File → Export → Export…

3. **Review the results** — The app shows your original schedule alongside the optimized one. Events are moved to hours that match their cognitive load (heavy meetings → your high-energy hours; light tasks → low-energy hours).

4. **Export** — Click "Export Optimized Schedule" to download the new `.ics` file. Import it back into your calendar app the same way you exported it.

> **Tip:** Pressing `Escape` while a file is loaded will clear it so you can upload a different one.

---

## Running the Tests

To verify everything is working correctly:

```
npm test -- --watchAll=false
```

You should see `196 tests passed` with no failures.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `npm: command not found` | Node.js is not installed. Follow the prerequisites above. |
| `npm install` fails with permission errors (Mac/Linux) | Do not use `sudo npm install`. Instead, fix npm permissions: https://docs.npmjs.com/resolving-enoent-errors |
| Port 3000 already in use | The terminal will ask if you want to use a different port — press `Y`. |
| Browser shows a blank page | Open the browser console (`F12` → Console tab) and check for errors. Try stopping and restarting `npm start`. |
| App compiles but shows an error on screen | Refresh the page. If it persists, stop the server, delete the `node_modules` folder, run `npm install` again, then `npm start`. |

---

## Project Structure (for reference)

```
turtlerocket-time-twister/
├── public/
│   └── sample.ics          ← sample calendar file you can use for testing
├── src/
│   ├── components/         ← UI components (EnergySelector, FileUpload, etc.)
│   ├── utils/              ← business logic (parser, classifier, optimizer, exporter)
│   ├── config/             ← keyword lists for event classification
│   ├── types/              ← TypeScript type definitions
│   └── App.tsx             ← main application
└── package.json            ← project metadata and scripts
```
