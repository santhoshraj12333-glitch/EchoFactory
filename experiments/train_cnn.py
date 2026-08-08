import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

import numpy as np
import pickle
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from sklearn.model_selection import train_test_split
from sklearn.utils.class_weight import compute_class_weight

t0 = time.time()

X = np.load(ROOT / "data" / "processed" / "X.npy")
y = np.load(ROOT / "data" / "processed" / "y.npy")
print("X:", X.shape, "y:", y.shape, flush=True)

X = (X - X.min()) / (X.max() - X.min())
X = X[..., np.newaxis]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)
print("X_train:", X_train.shape, "X_test:", X_test.shape, flush=True)

model = keras.Sequential([
    layers.Input(shape=(128, 313, 1)),
    layers.Conv2D(32, kernel_size=3, activation='relu', padding='same'),
    layers.BatchNormalization(),
    layers.MaxPooling2D(),

    layers.Conv2D(64, kernel_size=3, activation='relu', padding='same'),
    layers.BatchNormalization(),
    layers.MaxPooling2D(),

    layers.Conv2D(128, kernel_size=3, activation='relu', padding='same'),
    layers.BatchNormalization(),
    layers.MaxPooling2D(),

    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(1, activation='sigmoid')
])

model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=[
        'accuracy',
        tf.keras.metrics.Precision(name='precision'),
        tf.keras.metrics.Recall(name='recall')
    ]
)

class_weights = compute_class_weight(
    class_weight='balanced',
    classes=np.unique(y_train),
    y=y_train
)
class_weights = dict(zip(np.unique(y_train), class_weights))
print("Class weights:", class_weights, flush=True)

early_stopping = EarlyStopping(
    monitor='val_loss', patience=5, restore_best_weights=True
)
checkpoint = ModelCheckpoint(
    save_best_only=True, filepath=str(ROOT / "models" / "cnn_best.keras")
)

history = model.fit(
    X_train, y_train,
    epochs=30,
    batch_size=32,
    validation_split=0.2,
    class_weight=class_weights,
    callbacks=[early_stopping, checkpoint],
    verbose=1
)

with open(ROOT / "experiments" / "cnn_history.pkl", "wb") as f:
    pickle.dump(history.history, f)

last = {k: v[-1] for k, v in history.history.items()}
print("\n--- Final metrics ---", flush=True)
for k, v in last.items():
    print(f"{k}: {v:.4f}", flush=True)
print(f"Epochs run: {len(history.history['loss'])}", flush=True)
print(f"Elapsed: {time.time() - t0:.1f}s", flush=True)
