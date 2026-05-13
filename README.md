# 🎴 ເກມເປີດໄພ່ - Card Flip Party Game

A fun card-flipping party game built with pure HTML, CSS, and JavaScript.
Features 52 playing cards with per-rank reaction images, Lao party instructions,
and voice playback in Lao.

## ✨ Features
- Floating cards in a true 3D horizontal circle orbit (10 cards visible)
- Smooth 3D flip animation when revealing cards
- 13 unique reaction images (one per rank, 2-A) in 3:4 portrait
- **Lao voice playback** per rank when card opens
- Large rank images and bold text filling each card
- Adjustable rotation speed
- Sound effects (Web Audio API)
- Reset/shuffle button
- Fully responsive (mobile + tablet)
- Lollipop gradient theme (pink-blue-purple)
- Offline support via Service Worker

## 🚀 Deploy to GitHub Pages

1. Create a new repository on GitHub
2. Upload all files (preserve `images/` and `audio/` folders)
3. Go to **Settings → Pages**
4. Under **Source**, select `main` branch and `/ (root)`
5. Click **Save**
6. Your game will be live at `https://<username>.github.io/<repo-name>/`

## 📁 Required Files

### Images (`images/` folder) — 14 files
```
images/
├── 001.jpeg          (card back / cover image)
├── card_2.jpeg       (rank 2 reaction, 3:4 portrait)
├── card_3.jpeg       (rank 3 reaction)
├── card_4.jpeg       ...
├── card_5.jpeg
├── card_6.jpeg
├── card_7.jpeg
├── card_8.jpeg
├── card_9.jpeg
├── card_10.jpeg
├── card_J.jpeg
├── card_Q.jpeg
├── card_K.jpeg
└── card_A.jpeg
```

### Audio (`audio/` folder) — 13 files
```
audio/
├── voice_2.wav       (Lao voice for rank 2)
├── voice_3.wav       ...
├── voice_4.wav
├── voice_5.wav
├── voice_6.wav
├── voice_7.wav
├── voice_8.wav
├── voice_9.wav
├── voice_10.wav
├── voice_J.wav
├── voice_Q.wav
├── voice_K.wav
└── voice_A.wav
```

The game works without the audio files (graceful degrade) — only voice sounds
will be silent if the file is missing.

## 🎙️ Recording the Voice Files

For each rank, record yourself saying the action + message in Lao:

| Rank | What to say |
|------|-------------|
| 2 | ລອດ ເຈົ້າໄດ້ໃຊ້ດວງໄປແລ້ວ 50% |
| 3 | ດື່ມ 1 ຈອກ |
| 4 | ລອດ ຍັງຖືວ່າໂຊດີເນາະ |
| 5 | ລອດ ຄວາມຊວຍອາດແມ່ນຄົນຕໍ່ໄປ |
| 6 | ດື່ມ 1 ຈອກ |
| 7 | ລອດ ດວງດີ ລອງຊື້ເລກເບິ່ງເດີ |
| 8 | ລອດ ລູກເທວະດາມາເກີດບໍ່ນິ |
| 9 | ດື່ມ 1 ຈອກ |
| 10 | ລອດ ເສຍດາຍບໍ່ໄດ້ກິນຊ້ຳ |
| J | ຄົນທາງຊ້າຍດື່ມ 1 ຈອກ |
| Q | ຄົນທາງຂວາດື່ມ 1 ຈອກ |
| K | ຊວນຄົນທາງຊ້າຍ ແລະ ຂວາດື່ມ 1 ຈອກ |
| A | ສັ່ງໃຜກໍ່ໄດ້ດື່ມ 1 ຈອກ ຫຼື ສັ່ງທັງໝົດດື່ມກໍ່ໄດ້ |

**Tips for recording**:
- Use a quiet room
- Keep each file under 7 seconds for snappy gameplay
- Use a phone recorder app or Audacity (free)
- Export as `.wav` (mono, 22050 or 44100 Hz is fine)
- Keep file size small (under 100 KB each if possible)

## 📁 Full File Structure
```
.
├── index.html
├── style.css
├── game.js
├── sw.js              (service worker for offline support)
├── README.md
├── images/            (14 image files)
└── audio/             (13 voice files)
```

## 🎮 How to Play
1. Click **ເລີ່ມເກມ** to start
2. Tap any floating card to flip it
3. Listen to the Lao voice and read the action!
4. Click **ຕົກລົງ** to continue
5. Use **ລ້າງໄພ່** to reset the deck

## 📡 Offline Support

After the **first visit with internet**, the game automatically caches all
files via a service worker. After that, **the game works completely offline**:

- ✅ Refresh page with no internet → still works
- ✅ All 14 images load from cache
- ✅ All 13 voice files load from cache
- ✅ Lao fonts (Noto Sans Lao) cached after first online visit
- ✅ Add to Home Screen on mobile for app-like offline experience
- ✅ Game logic, sound effects, animations — all work offline

**Important**: Service workers only work over **HTTPS** or **localhost**.
They don't work when opening `index.html` directly via `file://`.
GitHub Pages serves over HTTPS automatically so offline support works.

**Cache strategy**:
- App shell (HTML/CSS/JS/images/audio) — pre-cached on install
- Google Fonts — cached opportunistically on first online use
- All fetches go cache-first, network fallback
- Graceful fallback for missing images (transparent SVG)

## 🛠️ Tech
- Pure HTML/CSS/JavaScript (no frameworks)
- HTML5 Audio API for voice playback
- Service Worker for offline support
- No build step required
- 100% client-side
