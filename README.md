# LearnUs: Reimagine Learning Analytics @ NTU Hackathon

React + Vite web app with React Router, built for Stage 2 of Reimagine Learning Analytics @ NTU Hackathon.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Create a Virtual Environment](#create-a-virtual-environment)
  - [Install Dependencies](#install-dependencies)

## Getting Started <a id="getting-started"></a>

## Prerequisites <a id="prerequisites"></a>

The following command is to be ran by one developer in the team to initialise the Repository to be a Vite + React Project.

```bash
npx create-vite@latest nala-hackathon -- --template react
```

### Install Dependencies <a id="install-dependencies"></a>

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

npm install

# Install MU
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

# Install MUI X
npm install @mui/x-data-grid @mui/x-charts

# Install API helper
npm install axios
```

### Run Application <a id="run-application"></a>

```bash
# Run dev server
npm run dev
```
