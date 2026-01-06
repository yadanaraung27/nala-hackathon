# Learning Analytics Dashboard

This repository contains the code for the Learning Analytics Dashboard, originally designed in [Figma](https://www.figma.com/make/Lxw10CtJdqt4UIYsRb07Cu/Learning-Analytics-Dashboard?fullscreen=1).

## Prerequisites

### Install Ollama

This application uses Ollama with the llama3.2-vision model for AI-powered chat functionality.

1. **Download Ollama:**
   - Visit [https://ollama.ai](https://ollama.ai) and download the installer for your operating system
   - Run the installer and follow the installation instructions

2. **Verify Installation:**
   ```bash
   ollama --version
   ```

3. **Pull the llama3.2-vision model:**
   ```bash
   ollama pull llama3.2-vision
   ```
   This will download the model (this may take several minutes depending on your connection).

4. **Start Ollama server:**
   ```bash
   ollama serve
   ```
   The server will run on `http://localhost:11434` by default.

5. **Verify Ollama is running:**
   ```bash
   curl http://localhost:11434/api/tags
   ```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
   This will create a `node_modules` folder.

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   The default configuration uses:
   - `VITE_OLLAMA_URL=http://localhost:11434`
   - `VITE_OLLAMA_MODEL=llama3.2-vision`

3. **Run the development server:**
   ```bash
   npm run dev
   ```

   If you encounter an error related to `@vitejs/plugin-react-swc`, install it with:
   ```bash
   npm install --save-dev @vitejs/plugin-react-swc
   ```

4. **Ensure Ollama is running:**
   Make sure the Ollama server is running in a separate terminal:
   ```bash
   ollama serve
   ```

5. **Expected Output:**
   - On successful execution, you should see output similar to the screenshot below:

     ![Executed npm run dev](media/successful_npm_run_dev.png)
   - The dashboard UI will appear as shown:
   
     ![Figma Make UI](media/homepage_ui.png)
