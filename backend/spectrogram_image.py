"""Encode a 2D scalar array as a PNG image with no external dependencies.

Used to return a real mel-spectrogram image from the /predict endpoint so the
dashboard displays the exact 128x313 representation fed into the CNN.
"""
import struct
import zlib
import base64


def _gradient_index(value):
    """Piecewise-linear colormap in EchoFactory brand colors.

    0.0 -> deep navy, mid -> cyan, 1.0 -> bright emerald foam.
    """
    stops = [
        (0.00, (6, 20, 30)),      # dark navy
        (0.35, (10, 90, 120)),    # deep cyan
        (0.70, (6, 182, 212)),    # cyan
        (1.00, (0, 229, 163)),    # emerald
    ]
    if value <= stops[0][0]:
        return stops[0][1]
    for i in range(1, len(stops)):
        v1, c1 = stops[i - 1]
        v2, c2 = stops[i]
        if value <= v2:
            t = (value - v1) / (v2 - v1)
            return tuple(int(round(c1[k] + (c2[k] - c1[k]) * t)) for k in range(3))
    return stops[-1][1]


def _chunk(tag, data):
    chunk = tag + data
    return chunk + struct.pack(">I", zlib.crc32(chunk))


def array_to_png_base64(array):
    """array: 2D numpy ndarray (rows=freq, cols=time), normalized ~[0,1].

    Returns a base64-encoded PNG with the rendered spectrogram.
    """
    rows, cols = array.shape
    data = array

    min_v, max_v = float(data.min()), float(data.max())
    span = (max_v - min_v) or 1.0

    scanlines = bytearray()
    for row in range(rows):
        scanlines.append(0)  # filter type: none
        for col in range(cols):
            v = (float(data[row, col]) - min_v) / span
            r, g, b = _gradient_index(v)
            scanlines.extend((r, g, b))

    def png_bytes():
        sig = b"\x89PNG\r\n\x1a\n"
        ihdr = struct.pack(">IIBBBBB", cols, rows, 8, 2, 0, 0, 0)
        idat = zlib.compress(bytes(scanlines), 6)
        return (
            sig
            + _chunk(b"IHDR", ihdr)
            + _chunk(b"IDAT", idat)
            + _chunk(b"IEND", b"")
        )

    import base64

    return base64.b64encode(png_bytes()).decode("ascii")