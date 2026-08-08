import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

import numpy as np
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.metrics import (classification_report, confusion_matrix,
                             accuracy_score, precision_score, recall_score,
                             f1_score, roc_auc_score, roc_curve,
                             precision_recall_curve, average_precision_score)

t0 = time.time()

X = np.load(ROOT / "data" / "processed" / "X.npy")
y = np.load(ROOT / "data" / "processed" / "y.npy")

X = (X - X.min()) / (X.max() - X.min())
X = X[..., np.newaxis]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)
print("X_test:", X_test.shape)
print("normal in test:", (y_test == 0).sum(), "abnormal in test:", (y_test == 1).sum())

model = tf.keras.models.load_model(ROOT / "models" / "cnn_best.keras")
y_proba = model.predict(X_test, verbose=0).ravel()

np.save(ROOT / "experiments" / "cnn_test_y.npy", y_test)
np.save(ROOT / "experiments" / "cnn_test_proba.npy", y_proba)

y_pred = (y_proba >= 0.5).astype(int)

print("\n=== Threshold 0.5 ===")
print(classification_report(y_test, y_pred, target_names=["normal", "abnormal"], digits=4))
print("Accuracy: ", accuracy_score(y_test, y_pred))
print("Precision:", precision_score(y_test, y_pred))
print("Recall:   ", recall_score(y_test, y_pred))
print("F1:       ", f1_score(y_test, y_pred))
print("ROC AUC:  ", roc_auc_score(y_test, y_proba))
print("AP:       ", average_precision_score(y_test, y_proba))
print("Confusion matrix:\n", confusion_matrix(y_test, y_pred))

# Optimal threshold via Youden's J
fpr, tpr, thresholds = roc_curve(y_test, y_proba)
youden = tpr - fpr
best_idx = np.argmax(youden)
best_thr = thresholds[best_idx]
y_pred_opt = (y_proba >= best_thr).astype(int)

print(f"\n=== Optimal threshold (Youden J) = {best_thr:.4f} ===")
print(classification_report(y_test, y_pred_opt, target_names=["normal", "abnormal"], digits=4))
print("Accuracy: ", accuracy_score(y_test, y_pred_opt))
print("Precision:", precision_score(y_test, y_pred_opt))
print("Recall:   ", recall_score(y_test, y_pred_opt))
print("F1:       ", f1_score(y_test, y_pred_opt))
print("Confusion matrix:\n", confusion_matrix(y_test, y_pred_opt))

print(f"\nElapsed: {time.time() - t0:.1f}s")
