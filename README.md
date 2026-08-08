# EchoFactory

Predictive maintenance for industrial pumps using acoustic (audio) signal analysis.
The project detects abnormal pump operation from recordings by building a supervised
CNN classifier baseline and an anomaly-detection autoencoder.

## Dataset

Four pump machines (`id_00`, `id_02`, `id_04`, `id_06`) with `normal` and `abnormal`
operation states. Audio is converted to log-mel spectrograms
(`128` mel bands x `313` frames), normalized, and stored in `data/processed/`.

- Total samples: 4205 (3749 normal, 456 abnormal)
- Label convention: `0 = normal`, `1 = abnormal`

## Training split

A single stratified split (`test_size=0.2`, `random_state=42`) is used consistently
across notebooks so the test set is identical everywhere.

| Set | Samples | Normal | Abnormal |
|-----|---------|--------|----------|
| Train + val | 3364 | 2999 | 365 |
| Test | 841 | 750 | 91 |

## Models

### 1. CNN classifier (`cnn_best.keras`)

Supervised baseline. Architecture: 3 Conv blocks (32 -> 64 -> 128 filters, each with
BN + MaxPool), Flatten, Dense(128) + Dropout(0.5), Dense(1, sigmoid).

Training notes:
- The first attempt using `class_weight='balanced'` collapsed into a degenerate solution
  (predicted only the majority class). A milder weight on the abnormal class (`{0: 1.0, 1: 3.0}`)
  and a lower learning rate (`1e-4`) stabilized training.
- 30 epochs, batch 32, 20% validation, EarlyStopping (patience 5).

### 2. Autoencoder (`autoencoder.keras`)

Anomaly detection model. Trained **only on normal recordings**. Reconstruction error is
used as the anomaly score; a sample is flagged abnormal when its reconstruction error
exceeds a threshold (95th percentile of normal validation errors).

## Evaluation

### CNN (test set, threshold 0.5)

| Metric | Value |
|--------|-------|
| Accuracy | 0.960 |
| Precision | 0.901 |
| Recall (abnormal) | 0.703 |
| F1-score | 0.790 |
| ROC AUC | 0.958 |

At the Youden-optimal threshold (0.099), abnormal recall rises to 0.868.

## Project structure

```
EchoFactory/
├── data/
│   ├── raw/                 # original .wav files per machine/state
│   └── processed/           # X.npy, y.npy (mel spectrograms + labels)
├── models/                  # cnn_best.keras, autoencoder.keras
├── notebooks/
│   ├── 01_data_exploration.ipynb
│   ├── 02_preprocessing.ipynb
│   ├── 03_build_dataset.ipynb
│   ├── 04_baseline_model.ipynb
│   ├── 05_cnn_classifier.ipynb
│   ├── 06_evaluation.ipynb
│   └── 07_autoencoder.ipynb
├── experiments/             # training/eval scripts + logs
├── api/app.py               # FastAPI inference service
└── dashboard/app.py         # Streamlit UI
```

## Setup

```bash
# from project root
python -m venv venv
.\venv\Scripts\activate          # Windows
pip install -r requirements.txt
```

## Usage

Run the notebooks in order, or train from the command line:

```bash
# CNN classifier
python experiments/train_cnn_tuned.py

# Autoencoder
python experiments/train_ae.py
```