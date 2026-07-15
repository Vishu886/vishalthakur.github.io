# HOW TO EDIT YOUR WEBSITE (the super simple guide)

Your website is made of 3 files. You only ever need to touch ONE of them:

| File         | What it is                  | Should you edit it? |
| ------------ | --------------------------- | ------------------- |
| `index.html` | ALL the words and links     | YES — edit this one |
| `styles.css` | Colors and design           | Only if you want    |
| `script.js`  | Small animations            | No need             |

---

## Step 1 — Open the file

Right-click `index.html` → **Open with** → **Notepad** (or any editor).

## Step 2 — Find the "EDIT:" notes

Inside the file there are notes that look like this:

```html
<!-- EDIT: YOUR FULL NAME — the biggest text on the site. -->
<h1 id="hero-title">Vishal<br /><em>Thakur.</em></h1>
```

The note tells you what the line below it does.
Change ONLY the words between the tags. In the example above you would
change `Vishal` and `Thakur.` — nothing else.

**Golden rule: never delete anything that is inside `< >` angle brackets.**

## Step 3 — Save and look

Save the file (Ctrl+S), then double-click `index.html` to open it in your
browser. Press F5 to refresh after every change.

---

## How to add your photos

1. Open the `images` folder.
2. Drop your pictures in with these EXACT names:
   - `my-photo.jpg` — your face photo (shows in the About section)
   - `project1.jpg` — a screenshot of The Forgotten Asylum
   - `project2.jpg` — a screenshot of Zorb Fight
3. Refresh the page. Done!

If a photo is missing the site shows built-in artwork instead, so nothing
ever looks broken.

---

## The most common things to change (cheat sheet)

| What you want to change     | What to search for in `index.html`      |
| --------------------------- | --------------------------------------- |
| Your name (big title)       | `EDIT: YOUR FULL NAME`                  |
| Your email                  | `mailto:` (appears 4 times)             |
| Your job title              | `Technical Artist`                      |
| Project names/descriptions  | `PROJECT 1` and `PROJECT 2`             |
| Project links               | `href="https://d3d-studios`             |
| About-me text               | `EDIT: About paragraph`                 |
| Skills                      | `EDIT: Each card = one skill`           |
| Jobs / education            | `EDIT: Each row = one job or school`    |
| LinkedIn / ArtStation links | `EDIT: Your links`                      |

Tip: press **Ctrl+F** in your editor to search for these phrases.

---

## How to add a 3rd project

1. In `index.html`, find the note that says `WANT A THIRD PROJECT?`
2. Copy the whole PROJECT 2 block — from `<article` down to `</article>`.
3. Paste it right below, before the note.
4. Change the name, description, and link.
5. Add `project3.jpg` to the `images` folder and change
   `images/project2.jpg` to `images/project3.jpg` in your new block.

---

## How to change colors (optional)

Open `styles.css`. The colors live at the very top:

```css
--bg: #0b0d10;      /* page background (dark) */
--ink: #e8e6e0;     /* text color (light) */
--accent: #ffb454;  /* the orange highlight color */
```

Change `#ffb454` to any color you like — search "color picker" on Google,
pick a color, and copy its code (it starts with `#`).

---

## How to put your changes on Git

Open a terminal in this folder and run:

```bash
git add -A
git commit -m "Update my portfolio"
```

That saves a snapshot of your work. To publish online, see `README.md`
(section "Deploy to GitHub Pages").
