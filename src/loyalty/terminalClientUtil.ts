import console from "node:console";

export const bufferToText = (buffer: Buffer): string => {
    if(!buffer || !buffer.length) {
        return '';
    }
    const controlChars: { [key: number]: string } = {
        0x00: "<NUL>",
        0x01: "<SOH>",
        0x02: "<STX>",
        0x03: "<ETX>",
        0x04: "<EOT>",
        0x05: "<ENQ>",
        0x06: "<ACK>",
        0x1c: "<FS>"
    };

    return Array.from(buffer)
        .map(byte => (byte < 32 || byte > 126) ? controlChars[byte] || `<0x${byte.toString(16).padStart(2, "0")}>` : String.fromCharCode(byte))
        .join("");
}

export const logBuffer = (buffer: Buffer): void => console.log(bufferToText(buffer));

