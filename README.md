# Learning Analytics Dashboard (Figma Make Export)

This repository contains the code for the Learning Analytics Dashboard, originally designed in [Figma](https://www.figma.com/make/Lxw10CtJdqt4UIYsRb07Cu/Learning-Analytics-Dashboard?fullscreen=1).

All code for testing is located in the `samples/figma_make` directory. You will need to set up dependencies before running the project.

## Getting Started

1. **Navigate to the project directory:**
   ```bash
   cd samples/figma_make
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   This will create a `node_modules` folder in the `figma_make` project.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

   If you encounter an error related to `@vitejs/plugin-react-swc`, install it with:
   ```bash
   npm install --save-dev @vitejs/plugin-react-swc
   ```

4. **Expected Output:**
   - On successful execution, you should see output similar to the screenshot below:

     ![Executed npm run dev](../../media/successful_npm_run_dev.png)
   - The dashboard UI will appear as shown:
   
     ![Figma Make UI](../../media/figma_make_ui.png)
