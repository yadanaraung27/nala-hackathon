# LearnUs: Reimagine Learning Analytics @ NTU Hackathon

React + Vite web app with React Router, built for Stage 2 of Reimagine Learning Analytics @ NTU Hackathon.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Create a Virtual Environment](#create-a-virtual-environment)
  - [Install Dependencies](#install-dependencies)

## Getting Started <a id="getting-started"></a>

## Prerequisites <a id="prerequisites"></a>

TODO.

### Create a Virtual Environment <a id="create-a-virtual-environment"></a>

**uv (Recommended)**

To manage our project dependencies, we are using uv which is an extremely fast Python package and project manager, written in Rust. For more information on how to get started with uv, please visit the [uv documentation](https://docs.astral.sh/uv/).

To create a virtual environment, run the following command:

```bash
uv venv
```

Once you have created a virtual environment, you may activate it.

On Linux or macOS, run the following command:

```bash
source .venv/bin/activate
```

On Windows, run:

```powershell
.venv/Scripts/activate
```

### Install Dependencies <a id="install-dependencies"></a>

```bash
uv sync
npm install
npm install react-router-dom @mui/material @mui/x-charts
```

### Run Application <a id="run-application"></a>

```bash
npm run dev
```
