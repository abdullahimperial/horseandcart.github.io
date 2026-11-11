package com.letsfixmoney.snapshot;

import org.junit.Test;
import static org.junit.Assert.*;

public class ExportPolicyTest {
    @Test public void supportsOnlyAppDocuments() {
        assertEquals("text/plain", ExportPolicy.mimeFor("money-snapshot-2026-09-01-to-2026-09-30.txt"));
        assertEquals("application/json", ExportPolicy.mimeFor("money-snapshot-plan-2026-09-30.json"));
        for (String name : new String[]{"../../private.txt", "money-snapshot-test.html", "report.txt", "money-snapshot-../bad.json"}) {
            assertThrows(IllegalArgumentException.class, () -> ExportPolicy.mimeFor(name));
        }
    }
    @Test public void exportLimitMeasuresUtf8Bytes() {
        assertArrayEquals(new byte[]{65}, ExportPolicy.bytesFor("A"));
        assertEquals(2, ExportPolicy.bytesFor("é").length);
        assertThrows(IllegalArgumentException.class, () -> ExportPolicy.bytesFor("é".repeat(ExportPolicy.MAX_BYTES/2+1)));
        assertThrows(IllegalArgumentException.class, () -> ExportPolicy.bytesFor(null));
    }
}
