# SQUISH

### Browser-based image compression by QIFY

Compress images to the size you need — directly in your browser.

SQUISH lets you choose an image, set a target size, select an output format, and download the compressed result without requiring a dedicated compression backend.

<p align="center">
  <a href="#features">Features</a>
  ·
  <a href="#how-it-works">How It Works</a>
  ·
  <a href="#usage">Usage</a>
  ·
  <a href="#development">Development</a>
</p>

---

## Overview

SQUISH is a lightweight image compression utility built with:

- HTML
- CSS
- Vanilla JavaScript
- Browser-native File APIs
- Canvas API

The project is intentionally dependency-light and keeps the core compression workflow inside the browser.

### The workflow

```text
Choose image
    ↓
Set target size
    ↓
Choose output format
    ↓
SQUISH processes the image
    ↓
Review result
    ↓
Download compressed image
