## 📝 Description

<!-- Provide a clear, concise summary of the changes introduced in this Pull Request and why they were necessary. -->

### 🛠️ Type of Change
- [ ] ✨ New Feature (non-breaking change which adds functionality)
- [ ] 🐛 Bug Fix (non-breaking change which fixes an issue)
- [ ] 🧹 Refactor (codebase optimization or restructuring)
- [ ] 📖 Documentation Update

---

## 🧪 How Has This Been Tested?

<!-- Describe the steps you took to test your changes. Please include details of your local environment configuration. -->

1. **Local Environment:** Simulated network throttling (Fast 3G/Slow 3G) inside Chrome/Firefox DevTools.
2. **Behavioral Check:** Verified that three (3) animated skeleton loader cards render during the API fetch process.
3. **Layout Stability:** Confirmed that loading placeholders perfectly match final card layouts, preventing Content Layout Shift (CLS).

---

## 📸 Screenshots / Demos

<!-- If applicable, add screenshots, GIFs, or videos showing the visual layout before and after the change. -->

| Loading State (Skeleton) | Resolved State (Live Data) |
| --- | --- |
| *[Insert Image / GIF]* | *[Insert Image / GIF]* |

---

## 📋 Checklist
- [ ] My code follows the style guidelines of this project.
- [ ] I have performed a self-review of my own code.
- [ ] My changes generate no new compilation warnings or console errors.