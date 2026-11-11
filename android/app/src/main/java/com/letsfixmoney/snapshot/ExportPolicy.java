package com.letsfixmoney.snapshot;

import java.nio.charset.StandardCharsets;

/** Export only the two document formats produced by the local application. */
final class ExportPolicy {
    static final int MAX_BYTES = 8 * 1024 * 1024;
    private ExportPolicy() {}
    static String mimeFor(String filename) {
        if (filename == null || !filename.matches("money-snapshot(?:-plan)?-[A-Za-z0-9-]+\\.(txt|json)")) {
            throw new IllegalArgumentException("Unsupported export filename.");
        }
        return filename.endsWith(".json") ? "application/json" : "text/plain";
    }
    static byte[] bytesFor(String text) {
        if (text == null || text.length() > MAX_BYTES) throw new IllegalArgumentException("Export is too large.");
        byte[] bytes = text.getBytes(StandardCharsets.UTF_8);
        if (bytes.length > MAX_BYTES) throw new IllegalArgumentException("Export is too large.");
        return bytes;
    }
}
