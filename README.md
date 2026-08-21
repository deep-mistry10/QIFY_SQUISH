<div align="center">

# SQUISH

### Image compression, directly in your browser.

A lightweight client-side image compressor by **QIFY** that lets you target a file size, choose an output format, and download the result without a dedicated compression backend.

<br>

[![HTML5](https://img.shields.io/badge/HTML5-111111?style=flat-square&logo=html5&logoColor=E34F26)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-111111?style=flat-square&logo=css3&logoColor=1572B6)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-111111?style=flat-square&logo=javascript&logoColor=F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Client Side](https://img.shields.io/badge/Processing-Client--Side-111111?style=flat-square)](#privacy)

<br>

[Overview](#overview) ·
[Features](#features) ·
[How It Works](#how-it-works) ·
[Usage](#usage) ·
[Development](#development)

</div>

---

## Overview

**SQUISH** is a browser-based image compression utility built for the QIFY ecosystem.

The goal is simple:

> Choose an image, choose a target size, compress it, and download the result.

The application keeps the core compression workflow inside the browser using standard web APIs and does not require a dedicated backend for image processing.

### Core workflow

```text
Select image
     │
     ▼
Choose target size
     │
     ▼
Choose output format
     │
     ▼
Compress locally
     │
     ▼
Review result
     │
     ▼
Download
