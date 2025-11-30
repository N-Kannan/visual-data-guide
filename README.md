# 📊 Visual Data Guide

**Master DAX, Excel, and SQL through interactive, step-by-step visual stories.**

### [🔴 Live Demo](https://kannan.github.io/visual-data-guide/)

## 🚀 About The Project

**Visual Data Guide** (by Creator 12 Academy) transforms abstract data formulas into interactive animations. Instead of just reading documentation, you can **watch** how the engine calculates results row-by-row.

**Current Modules:**
* ✅ **DAX:** Context Transition, Iterators (SUMX), Filter Context.
* 🚧 **Excel:** (Coming Soon) Dynamic Arrays, Lookups.
* 🚧 **SQL:** (Coming Soon) Joins, Window Functions.
* 🚧 **M Language:** (Coming Soon) Power Query transformations.

## ✨ Features

* **Visual Execution:** See variables update, rows highlight, and filters apply in real-time.
* **Smart Narration:** Browser-native Text-to-Speech explains *what* is happening.
* **Control the Pace:** Toggle between Slow, Medium, and Fast speeds.
* **Mobile Friendly:** Learn on your phone, tablet, or desktop.
* **Zero-Dependency:** Built with pure HTML, CSS, and Vanilla JavaScript.

## 📂 Project Structure

We use a modular architecture to keep things lightweight.

```text
/
├── index.html                  # Main Landing Page (Portfolio)
├── about.html                  # About the Author
├── assets/
│   ├── style.css               # Centralized Styling
│   └── app.js                  # Shared Logic (Voice, Controls)
│
├── DAX/                        # DAX Module
│   ├── index.html              # DAX Roadmap Menu
│   ├── 01_Aggregation/         # Category Folder
│   │   ├── 01_sum_vs_sumx.html # Individual Lesson
│   │   └── ...
