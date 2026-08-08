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

# Train autoencoder on normal recordings only
X_normal = X_train[y_train == 0]
X_ae_train, X_ae_val = train_test_split(X_normal, test_size=0.2, random_state=42)
print("AE train:", X_ae_train.shape, "AE val:", X_ae_val.shape, flush=True)

def pad_spectrograms(x):
    pad = np.zeros((x.shape[0], x.shape[1], 320, 1), dtype=x.dtype)
    pad[:, :, :x.shape[2], :] = x
    return pad

X_ae_train_p = pad_spectrograms(X_ae_train)
X_ae_val_p = pad_spectrograms(X_ae_val)
print("Padded AE train:", X_ae_train_p.shape, flush=True)

input_shape = (128, 320, 1)

# --- Encoder ---
enc_in = layers.Input(shape=input_shape)
x = layers.Conv2D(32, kernel_size=3, activation='relu', padding='same')(enc_in)
x = layers.BatchNormalization()(x)
x = layers.MaxPooling2D()(x)

x = layers.Conv2D(64, kernel_size=3, activation='relu', padding='same')(x)
x = layers.BatchNormalization()(x)
x = layers.MaxPooling2D()(x)

x = layers.Conv2D(128, kernel_size=3, activation='relu', padding='same')(x)
x = layers.BatchNormalization()(x)
x = layers.MaxPooling2D()(x)

x = layers.Conv2D(256, kernel_size=3, activation='relu', padding='same')(x)
x = layers.BatchNormalization()(x)

encoder = keras.Model(enc_in, x, name="encoder")

# --- Decoder ---
dec_in = layers.Input(shape=encoder.output_shape[1:])
x = layers.Conv2DTranspose(128, kernel_size=3, strides=2, activation='relu', padding='same')(dec_in)
x = layers.BatchNormalization()(x)
x = layers.Conv2DTranspose(64, kernel_size=3, strides=2, activation='relu', padding='same')(x)
x = layers.BatchNormalization()(x)
x = layers.Conv2DTranspose(32, kernel_size=3, strides=2, activation='relu', padding='same')(x)
x = layers.BatchNormalization()(x)
x = layers.Conv2D(1, kernel_size=3, activation='sigmoid', padding='same')(x)

decoder = keras.Model(dec_in, x, name="decoder")

class AE(keras.Model):
    def __init__(self, encoder, decoder, width=313, **kwargs):
        super().__init__(**kwargs)
        self.encoder = encoder
        self.decoder = decoder
        self.width = width

    def call(self, inputs):
        z = self.encoder(inputs)
        recon = self.decoder(z)
        return recon

    def get_config(self):
        config = super().get_config()
        config.update({
            "encoder": keras.utils.serialize_keras_object(self.encoder),
            "decoder": keras.utils.serialize_keras_object(self.decoder),
            "width": self.width,
        })
        return config

    @classmethod
    def from_config(cls, config):
        config = dict(config)
        config["encoder"] = keras.utils.deserialize_keras_object(config["encoder"])
        config["decoder"] = keras.utils.deserialize_keras_object(config["decoder"])
        return cls(**config)

ae = AE(encoder, decoder)
ae.compile(optimizer='adam', loss='mse')
ae.build(input_shape=(None, *input_shape))

early_stopping = EarlyStopping(
    monitor='val_loss', patience=5, restore_best_weights=True
)
checkpoint = ModelCheckpoint(
    save_best_only=True, filepath=str(ROOT / "models" / "autoencoder.keras")
)

history = ae.fit(
    X_ae_train_p, X_ae_train_p,
    epochs=30,
    batch_size=32,
    validation_data=(X_ae_val_p, X_ae_val_p),
    callbacks=[early_stopping, checkpoint],
    verbose=1
)

with open(ROOT / "experiments" / "ae_history.pkl", "wb") as f:
    pickle.dump(history.history, f)

def reconstruction_error(model, x, width=313):
    recon = model.predict(x, verbose=0)
    err = np.mean(np.square(x[:, :, :width, :] - recon[:, :, :width, :]), axis=(1, 2, 3))
    return err, recon

val_err, _ = reconstruction_error(ae, X_ae_val_p)
threshold = np.percentile(val_err, 95)
print(f"\nAE threshold (95th pct of val normal error): {threshold:.6f}", flush=True)
np.save(ROOT / "experiments" / "ae_threshold.npy", np.array(threshold))
np.save(ROOT / "experiments" / "ae_val_err.npy", val_err)

X_test_p = pad_spectrograms(X_test)
test_err, _ = reconstruction_error(ae, X_test_p)
np.save(ROOT / "experiments" / "ae_test_err.npy", test_err)
np.save(ROOT / "experiments" / "ae_test_y.npy", y_test)
print("AE evaluation saved.", flush=True)

last = {k: v[-1] for k, v in history.history.items()}
print("\n--- Final AE metrics ---", flush=True)
for k, v in last.items():
    print(f"{k}: {v:.6f}", flush=True)
print(f"Epochs run: {len(history.history['loss'])}", flush=True)
print(f"Elapsed: {time.time() - t0:.1f}s", flush=True)
