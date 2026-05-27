# MediScan AI

MediScan AI is an intelligent, AI-powered medicine recognition platform. It allows users to instantly identify medicines, understand their composition, uses, dosage guidelines, and potential side effects by simply capturing a photo or uploading an image of the medicine packaging, bottle, or tablet.

Powered by Google's Gemini Vision AI and optional OCR fallbacks, MediScan AI aims to make medicine information accessible, clear, and easy to understand.

## Features

- **AI Image Recognition**: Uses Gemini vision models to analyze the physical appearance, packaging, and labels of medicine.
- **Robust OCR Fallback**: Implements Tesseract.js to reliably extract text from images as a helpful fallback mechanism.
- **Comprehensive Details**: Extracts and structures information into clear categories:
  - Brand and Generic Name
  - Composition (Active Ingredients)
  - Uses and Indications
  - Dosage Guidelines
  - Side Effects and Precautions
  - Purchase Links and Potential Alternatives
- **Responsive UI**: Built with a mobile-first philosophy using React, Vite, and Tailwind CSS.
- **Accessible & Clean Design**: Prioritizes typography, legibility, and a clinical, professional aesthetic.

## Architecture

This project is structured as a full-stack application:
- **Frontend**: A React Single Page Application (SPA) utilizing Vite for lightning-fast builds, Framer Motion for subtle and smooth transitions, and Lucide React for crisp iconography.
- **Backend / API Endpoint layer**: An Express.js server providing standard REST endpoints `/api/analyze-medicine`. The Express server acts as a proxy to safely communicate with the Gemini API, ensuring your `GEMINI_API_KEY` is completely hidden from the browser.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express
- **AI/ML**: Google Gemini API (`gemini-2.5-flash`), Tesseract.js (Optical Character Recognition)
- **Deployment**: Vercel (or any Node.js compatible environment)

## Setup and Installation

1. **Clone the repository**: (If applicable)
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```
4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
5. **Build for Production**:
   ```bash
   npm run build
   ```

## Development Team

This project was built as a part of the IDT Project by **Batch 9**:
- G M AYSHATH AFEEZA
- GAMINI K
- HAMZATHUL KARRAR S H
- HANA FATHIMA SUDHARSHANA K
- SUJAN N

## Disclaimer

**MediScan AI provides informational content only and is not a substitute for professional medical advice, diagnosis, or treatment.** Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or medication.
