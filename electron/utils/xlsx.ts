import fs from "fs";
import path from "path";
import zlib from "zlib";

interface ZipEntry {
  fileName: string;
  versionMadeBy: number;
  versionNeeded: number;
  generalPurpose: number;
  compressionMethod: number;
  lastModTime: number;
  lastModDate: number;
  crc32: number;
  compressedSize: number;
  uncompressedSize: number;
  diskNumberStart: number;
  internalAttrs: number;
  externalAttrs: number;
  extraField: Buffer;
  fileComment: Buffer;
  localExtraField: Buffer;
  compressedData: Buffer;
  localHeaderOffset: number;
  order: number;
  newLocalHeaderOffset?: number;
}

interface ParsedZip {
  entries: ZipEntry[];
  entryMap: Map<string, ZipEntry>;
}

const ZIP_LOCAL_FILE_HEADER_SIGNATURE = 0x04034b50;
const ZIP_CENTRAL_DIRECTORY_SIGNATURE = 0x02014b50;
const ZIP_END_OF_CENTRAL_DIRECTORY_SIGNATURE = 0x06054b50;

const hasOwn = Object.prototype.hasOwnProperty;

function findEndOfCentralDirectory(buffer: Buffer): number {
  for (let i = buffer.length - 22; i >= 0; i--) {
    if (buffer.readUInt32LE(i) === ZIP_END_OF_CENTRAL_DIRECTORY_SIGNATURE) {
      return i;
    }
  }
  throw new Error("End of central directory not found");
}

function parseZip(buffer: Buffer): ParsedZip {
  const endOffset = findEndOfCentralDirectory(buffer);
  const centralDirectorySize = buffer.readUInt32LE(endOffset + 12);
  const centralDirectoryOffset = buffer.readUInt32LE(endOffset + 16);
  const entries: ZipEntry[] = [];
  const entryMap = new Map<string, ZipEntry>();

  let offset = centralDirectoryOffset;
  let index = 0;

  while (offset < centralDirectoryOffset + centralDirectorySize) {
    const signature = buffer.readUInt32LE(offset);
    if (signature !== ZIP_CENTRAL_DIRECTORY_SIGNATURE) {
      throw new Error("Invalid central directory signature");
    }

    const versionMadeBy = buffer.readUInt16LE(offset + 4);
    const versionNeeded = buffer.readUInt16LE(offset + 6);
    const generalPurpose = buffer.readUInt16LE(offset + 8);
    const compressionMethod = buffer.readUInt16LE(offset + 10);
    const lastModTime = buffer.readUInt16LE(offset + 12);
    const lastModDate = buffer.readUInt16LE(offset + 14);
    const crc32 = buffer.readUInt32LE(offset + 16);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const uncompressedSize = buffer.readUInt32LE(offset + 24);
    const fileNameLength = buffer.readUInt16LE(offset + 28);
    const extraFieldLength = buffer.readUInt16LE(offset + 30);
    const fileCommentLength = buffer.readUInt16LE(offset + 32);
    const diskNumberStart = buffer.readUInt16LE(offset + 34);
    const internalAttrs = buffer.readUInt16LE(offset + 36);
    const externalAttrs = buffer.readUInt32LE(offset + 38);
    const localHeaderOffset = buffer.readUInt32LE(offset + 42);

    const nameStart = offset + 46;
    const nameEnd = nameStart + fileNameLength;
    const fileName = buffer.slice(nameStart, nameEnd).toString("utf8");

    const extraFieldStart = nameEnd;
    const extraFieldEnd = extraFieldStart + extraFieldLength;
    const extraField = buffer.slice(extraFieldStart, extraFieldEnd);

    const commentStart = extraFieldEnd;
    const commentEnd = commentStart + fileCommentLength;
    const fileComment = buffer.slice(commentStart, commentEnd);

    const localSignature = buffer.readUInt32LE(localHeaderOffset);
    if (localSignature !== ZIP_LOCAL_FILE_HEADER_SIGNATURE) {
      throw new Error(`Invalid local header signature for ${fileName}`);
    }

    const localFileNameLength = buffer.readUInt16LE(localHeaderOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localHeaderOffset + 28);

    const dataStart =
      localHeaderOffset + 30 + localFileNameLength + localExtraLength;
    const dataEnd = dataStart + compressedSize;
    const compressedData = buffer.slice(dataStart, dataEnd);
    const localExtraField = buffer.slice(
      localHeaderOffset + 30 + localFileNameLength,
      dataStart
    );

    const entry: ZipEntry = {
      fileName,
      versionMadeBy,
      versionNeeded,
      generalPurpose,
      compressionMethod,
      lastModTime,
      lastModDate,
      crc32,
      compressedSize,
      uncompressedSize,
      diskNumberStart,
      internalAttrs,
      externalAttrs,
      extraField,
      fileComment,
      localExtraField,
      compressedData,
      localHeaderOffset,
      order: index,
    };

    entries.push(entry);
    entryMap.set(fileName, entry);

    offset = commentEnd;
    index += 1;
  }

  return { entries, entryMap };
}

function crc32(data: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    const byte = data[i];
    crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ byte) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      if ((c & 1) !== 0) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c >>>= 1;
      }
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function inflateEntry(entry: ZipEntry): Buffer {
  if (entry.compressionMethod === 0) {
    return Buffer.from(entry.compressedData);
  }
  if (entry.compressionMethod === 8) {
    return zlib.inflateRawSync(entry.compressedData);
  }
  throw new Error(`Unsupported compression method: ${entry.compressionMethod}`);
}

function deflateBuffer(data: Buffer, method: number): Buffer {
  if (method === 0) {
    return data;
  }
  if (method === 8) {
    return zlib.deflateRawSync(data);
  }
  throw new Error(`Unsupported compression method: ${method}`);
}

function decodeXml(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function encodeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseSharedStrings(xml: string): string[] {
  const result: string[] = [];
  const siRegex = /<si>([\s\S]*?)<\/si>/g;
  let siMatch: RegExpExecArray | null;
  while ((siMatch = siRegex.exec(xml)) !== null) {
    const siContent = siMatch[1];
    const tRegex = /<t[^>]*>([\s\S]*?)<\/t>/g;
    let text = "";
    let tMatch: RegExpExecArray | null;
    while ((tMatch = tRegex.exec(siContent)) !== null) {
      text += decodeXml(tMatch[1]);
    }
    result.push(text);
  }
  return result;
}

function parseAttributes(raw: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const attrRegex = /(\w+)=\"([^\"]*)\"/g;
  let match: RegExpExecArray | null;
  while ((match = attrRegex.exec(raw)) !== null) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}

function buildAttributeString(attrs: Record<string, string>): string {
  const entries = Object.entries(attrs);
  if (entries.length === 0) return "";
  return entries.map(([key, value]) => `${key}="${value}"`).join(" ");
}

function columnLabelToIndex(label: string): number {
  let result = 0;
  for (let i = 0; i < label.length; i++) {
    const code = label.charCodeAt(i);
    if (code >= 65 && code <= 90) {
      result = result * 26 + (code - 64);
    } else if (code >= 97 && code <= 122) {
      result = result * 26 + (code - 96);
    }
  }
  return result - 1;
}

function extractCellValue(
  content: string,
  type: string | undefined,
  sharedStrings: string[]
): string {
  if (type === "s") {
    const match = content.match(/<v>([\s\S]*?)<\/v>/);
    if (!match) return "";
    const index = Number.parseInt(match[1], 10);
    if (Number.isNaN(index)) return "";
    return sharedStrings[index] ?? "";
  }

  if (type === "inlineStr") {
    const match = content.match(/<t[^>]*>([\s\S]*?)<\/t>/);
    return match ? decodeXml(match[1]) : "";
  }

  const match = content.match(/<v>([\s\S]*?)<\/v>/);
  if (!match) return "";
  return decodeXml(match[1]);
}

function hasMeaningfulValue(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return true;
}

function updateSheetXml(
  sheetXml: string,
  sharedStrings: string[],
  values: Record<string, string>
): string {
  const rowKeyMap = new Map<number, string>();
  const replacements: { start: number; end: number; text: string }[] = [];

  let cursor = 0;
  while (true) {
    const start = sheetXml.indexOf("<c", cursor);
    if (start === -1) break;

    const tagEnd = sheetXml.indexOf(">", start);
    if (tagEnd === -1) break;

    let tagContent = sheetXml.slice(start + 2, tagEnd);
    let selfClosing = false;

    if (tagContent.endsWith("/")) {
      selfClosing = true;
      tagContent = tagContent.slice(0, -1);
    }

    const attrs = parseAttributes(tagContent);
    const ref = attrs.r;

    let inner = "";
    let fullEnd = tagEnd + 1;

    if (!selfClosing) {
      const closeIndex = sheetXml.indexOf("</c>", tagEnd);
      if (closeIndex === -1) break;
      inner = sheetXml.slice(tagEnd + 1, closeIndex);
      fullEnd = closeIndex + 4;
    }

    if (ref) {
      const match = /^([A-Z]+)(\d+)$/.exec(ref);
      if (match) {
        const column = match[1];
        const row = parseInt(match[2], 10);
        const columnIndex = columnLabelToIndex(column);

        if (columnIndex === 0) {
          const valueMatch = inner.match(/<v>([\s\S]*?)<\/v>/);
          if (valueMatch) {
            const index = Number.parseInt(valueMatch[1], 10);
            const key = sharedStrings[index];
            if (key) {
              rowKeyMap.set(row, key.trim());
            }
          }
        } else if (columnIndex === 1) {
          const key = rowKeyMap.get(row);
          const resolveValue = (rawKey?: string) => {
            if (!rawKey) return undefined;
            const variants = new Set<string>();
            variants.add(rawKey);
            const trimmedKey = rawKey.trim();
            if (trimmedKey) variants.add(trimmedKey);
            const withoutParens = trimmedKey.replace(/[()]/g, "").trim();
            if (withoutParens) variants.add(withoutParens);
            if (trimmedKey.startsWith("(") && trimmedKey.endsWith(")")) {
              const inner = trimmedKey.slice(1, -1).trim();
              if (inner) variants.add(inner);
            }
            for (const variant of variants) {
              if (hasOwn.call(values, variant)) {
                return values[variant];
              }
            }
            return undefined;
          };

          const lookupKey = key ?? (row === 1 ? "SFC" : undefined);
          const newValue = resolveValue(lookupKey);
          if (lookupKey && newValue !== undefined) {
            const attrCopy = { ...attrs };
            const attrString = buildAttributeString(attrCopy);

            let replacement: string;
            if (!hasMeaningfulValue(newValue)) {
              replacement = `<c${attrString ? ` ${attrString}` : ""}/>`;
            } else {
              const trimmed = `${newValue}`;
              const numericValue = Number(trimmed);
              const isNumeric =
                trimmed.trim().length > 0 && !Number.isNaN(numericValue);

              if (isNumeric) {
                delete attrCopy.t;
                const updatedAttrString = buildAttributeString(attrCopy);
                replacement = `<c${
                  updatedAttrString ? ` ${updatedAttrString}` : ""
                }><v>${trimmed}</v></c>`;
              } else {
                attrCopy.t = "inlineStr";
                const updatedAttrString = buildAttributeString(attrCopy);
                replacement = `<c${
                  updatedAttrString ? ` ${updatedAttrString}` : ""
                }><is><t>${encodeXml(trimmed)}</t></is></c>`;
              }
            }

            replacements.push({ start, end: fullEnd, text: replacement });
          }
        } else {
          // Drop any cells beyond column B so they are not surfaced to the executable
          replacements.push({ start, end: fullEnd, text: "" });
        }
      }
    }

    cursor = fullEnd;
  }

  if (replacements.length === 0) {
    return sheetXml;
  }

  replacements.sort((a, b) => a.start - b.start);
  let result = "";
  let lastIndex = 0;

  for (const replacement of replacements) {
    result += sheetXml.slice(lastIndex, replacement.start);
    result += replacement.text;
    lastIndex = replacement.end;
  }

  result += sheetXml.slice(lastIndex);
  return result;
}

function rebuildZip(parsed: ParsedZip): Buffer {
  const ordered = [...parsed.entries].sort(
    (a, b) => a.localHeaderOffset - b.localHeaderOffset
  );

  const chunks: Buffer[] = [];
  let offset = 0;

  for (const entry of ordered) {
    const fileNameBuffer = Buffer.from(entry.fileName, "utf8");
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(ZIP_LOCAL_FILE_HEADER_SIGNATURE, 0);
    localHeader.writeUInt16LE(entry.versionNeeded, 4);
    localHeader.writeUInt16LE(entry.generalPurpose, 6);
    localHeader.writeUInt16LE(entry.compressionMethod, 8);
    localHeader.writeUInt16LE(entry.lastModTime, 10);
    localHeader.writeUInt16LE(entry.lastModDate, 12);
    localHeader.writeUInt32LE(entry.crc32, 14);
    localHeader.writeUInt32LE(entry.compressedSize, 18);
    localHeader.writeUInt32LE(entry.uncompressedSize, 22);
    localHeader.writeUInt16LE(fileNameBuffer.length, 26);
    localHeader.writeUInt16LE(entry.localExtraField.length, 28);

    chunks.push(
      localHeader,
      fileNameBuffer,
      entry.localExtraField,
      entry.compressedData
    );
    entry.newLocalHeaderOffset = offset;
    offset +=
      localHeader.length +
      fileNameBuffer.length +
      entry.localExtraField.length +
      entry.compressedData.length;
  }

  const centralDirectoryOffset = offset;
  const centralChunks: Buffer[] = [];

  for (const entry of ordered) {
    const fileNameBuffer = Buffer.from(entry.fileName, "utf8");
    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(ZIP_CENTRAL_DIRECTORY_SIGNATURE, 0);
    centralHeader.writeUInt16LE(entry.versionMadeBy, 4);
    centralHeader.writeUInt16LE(entry.versionNeeded, 6);
    centralHeader.writeUInt16LE(entry.generalPurpose, 8);
    centralHeader.writeUInt16LE(entry.compressionMethod, 10);
    centralHeader.writeUInt16LE(entry.lastModTime, 12);
    centralHeader.writeUInt16LE(entry.lastModDate, 14);
    centralHeader.writeUInt32LE(entry.crc32, 16);
    centralHeader.writeUInt32LE(entry.compressedSize, 20);
    centralHeader.writeUInt32LE(entry.uncompressedSize, 24);
    centralHeader.writeUInt16LE(fileNameBuffer.length, 28);
    centralHeader.writeUInt16LE(entry.extraField.length, 30);
    centralHeader.writeUInt16LE(entry.fileComment.length, 32);
    centralHeader.writeUInt16LE(entry.diskNumberStart, 34);
    centralHeader.writeUInt16LE(entry.internalAttrs, 36);
    centralHeader.writeUInt32LE(entry.externalAttrs, 38);
    centralHeader.writeUInt32LE(entry.newLocalHeaderOffset ?? 0, 42);

    centralChunks.push(
      centralHeader,
      fileNameBuffer,
      entry.extraField,
      entry.fileComment
    );
    offset +=
      centralHeader.length +
      fileNameBuffer.length +
      entry.extraField.length +
      entry.fileComment.length;
  }

  const centralDirectorySize = offset - centralDirectoryOffset;
  const endRecord = Buffer.alloc(22);
  endRecord.writeUInt32LE(ZIP_END_OF_CENTRAL_DIRECTORY_SIGNATURE, 0);
  endRecord.writeUInt16LE(0, 4);
  endRecord.writeUInt16LE(0, 6);
  endRecord.writeUInt16LE(ordered.length, 8);
  endRecord.writeUInt16LE(ordered.length, 10);
  endRecord.writeUInt32LE(centralDirectorySize, 12);
  endRecord.writeUInt32LE(centralDirectoryOffset, 16);
  endRecord.writeUInt16LE(0, 20);

  return Buffer.concat([...chunks, ...centralChunks, endRecord]);
}

function normalizeValues(
  scenarioValues: Record<string, string>,
  sfc?: string | null
): Record<string, string> {
  const normalized: Record<string, string> = {};
  if (sfc) {
    normalized.SFC = sfc;
  }
  for (const [key, value] of Object.entries(scenarioValues)) {
    if (hasMeaningfulValue(value)) {
      normalized[key] = value;
    }
  }
  return normalized;
}

export function updateInputTotalWorkbook(
  workbookPath: string,
  scenarioValues: Record<string, string>,
  sfc?: string | null
): void {
  if (!fs.existsSync(workbookPath)) {
    throw new Error(`Workbook not found: ${workbookPath}`);
  }

  const buffer = fs.readFileSync(workbookPath);
  const parsed = parseZip(buffer);

  const sheetEntry = parsed.entryMap.get("xl/worksheets/sheet1.xml");
  const sharedEntry = parsed.entryMap.get("xl/sharedStrings.xml");

  if (!sheetEntry || !sharedEntry) {
    throw new Error("Workbook is missing required worksheet or shared strings");
  }

  const sharedStringsXml = inflateEntry(sharedEntry).toString("utf8");
  const sharedStrings = parseSharedStrings(sharedStringsXml);
  const sheetXml = inflateEntry(sheetEntry).toString("utf8");

  const normalizedValues = normalizeValues(scenarioValues, sfc);
  const updatedSheetXml = updateSheetXml(
    sheetXml,
    sharedStrings,
    normalizedValues
  );

  if (updatedSheetXml === sheetXml) {
    return;
  }

  const updatedBuffer = Buffer.from(updatedSheetXml, "utf8");
  const compressed = deflateBuffer(updatedBuffer, sheetEntry.compressionMethod);
  sheetEntry.compressedData = compressed;
  sheetEntry.compressedSize = compressed.length;
  sheetEntry.uncompressedSize = updatedBuffer.length;
  sheetEntry.crc32 = crc32(updatedBuffer);

  const rebuilt = rebuildZip(parsed);
  const tempPath = `${workbookPath}.tmp`;
  fs.writeFileSync(tempPath, rebuilt);
  fs.renameSync(tempPath, workbookPath);
}

export function readWorksheetRows(
  workbookPath: string,
  sheetFile = "xl/worksheets/sheet1.xml"
): string[][] {
  if (!fs.existsSync(workbookPath)) {
    throw new Error(`Workbook not found: ${workbookPath}`);
  }

  const buffer = fs.readFileSync(workbookPath);
  const parsed = parseZip(buffer);
  const sheetEntry = parsed.entryMap.get(sheetFile);
  if (!sheetEntry) {
    throw new Error(`Worksheet not found: ${sheetFile}`);
  }

  const sharedEntry = parsed.entryMap.get("xl/sharedStrings.xml");
  const sharedStrings = sharedEntry
    ? parseSharedStrings(inflateEntry(sharedEntry).toString("utf8"))
    : [];

  const sheetXml = inflateEntry(sheetEntry).toString("utf8");
  const rows: string[][] = [];

  const rowRegex = /<row[^>]*>([\s\S]*?)<\/row>/g;
  let rowMatch: RegExpExecArray | null;

  while ((rowMatch = rowRegex.exec(sheetXml)) !== null) {
    const rowContent = rowMatch[1];
    const cells: string[] = [];
    let maxIndex = -1;

    const cellRegex = /<c([^>]*)>([\s\S]*?)<\/c>/g;
    let cellMatch: RegExpExecArray | null;

    while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
      const attrRaw = cellMatch[1];
      const content = cellMatch[2];
      const attrs = parseAttributes(attrRaw);
      const reference = attrs.r;
      let columnIndex = -1;

      if (reference) {
        const columnLabel = reference.replace(/\d+/g, "");
        columnIndex = columnLabelToIndex(columnLabel);
      } else {
        columnIndex = cells.length;
      }

      if (columnIndex < 0) {
        continue;
      }

      const value = extractCellValue(content, attrs.t, sharedStrings);
      cells[columnIndex] = value;
      if (columnIndex > maxIndex) {
        maxIndex = columnIndex;
      }
    }

    if (maxIndex >= 0) {
      for (let i = 0; i <= maxIndex; i += 1) {
        if (cells[i] === undefined) {
          cells[i] = "";
        }
      }
    }

    rows.push(cells);
  }

  return rows;
}

export function ensureInputTotalWorkbook(baseDir: string): string {
  const workbookPath = path.join(baseDir, "Input_Total.xlsx");
  if (!fs.existsSync(workbookPath)) {
    const templatePath = path.join(baseDir, "Input_Plant.xlsx");
    if (!fs.existsSync(templatePath)) {
      throw new Error("No template available to create Input_Total.xlsx");
    }
    fs.copyFileSync(templatePath, workbookPath);
  }
  return workbookPath;
}

function updateEntryXml(entry: ZipEntry, xml: string) {
  const buffer = Buffer.from(xml, "utf8");
  const compressed = deflateBuffer(buffer, entry.compressionMethod);
  entry.compressedData = compressed;
  entry.compressedSize = compressed.length;
  entry.uncompressedSize = buffer.length;
  entry.crc32 = crc32(buffer);
}

function removeWorksheetByName(parsed: ParsedZip, sheetName: string) {
  const workbookEntry = parsed.entryMap.get("xl/workbook.xml");
  if (!workbookEntry) {
    return;
  }

  const workbookXml = inflateEntry(workbookEntry).toString("utf8");
  const sheetRegex = new RegExp(
    `<sheet[^>]*name="${sheetName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*/>`,
    "i"
  );
  const sheetMatch = workbookXml.match(sheetRegex);
  if (!sheetMatch) {
    return;
  }

  const sheetTag = sheetMatch[0];
  const attrRaw = sheetTag
    .replace(/^<sheet\s*/i, "")
    .replace(/\s*\/?\>$/i, "")
    .trim();
  const sheetAttrs = parseAttributes(attrRaw);
  const relId = sheetAttrs["r:id"];

  let updatedWorkbookXml = workbookXml.replace(sheetTag, "");
  updatedWorkbookXml = updatedWorkbookXml.replace(/\n\s*\n+/g, "\n");
  updateEntryXml(workbookEntry, updatedWorkbookXml);

  let worksheetTargetPath: string | null = null;

  if (relId) {
    const relEntry = parsed.entryMap.get("xl/_rels/workbook.xml.rels");
    if (relEntry) {
      const relXml = inflateEntry(relEntry).toString("utf8");
      const relRegex = new RegExp(
        `<Relationship[^>]*Id="${relId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*/>`,
        "i"
      );
      const relMatch = relXml.match(relRegex);
      if (relMatch) {
        const relAttrRaw = relMatch[0]
          .replace(/^<Relationship\s*/i, "")
          .replace(/\s*\/?\>$/i, "")
          .trim();
        const relAttrs = parseAttributes(relAttrRaw);
        worksheetTargetPath = relAttrs.Target
          ? relAttrs.Target.replace(/^\//, "")
          : null;

        const updatedRelXml = relXml.replace(relMatch[0], "");
        updateEntryXml(relEntry, updatedRelXml);
      }
    }
  }

  if (worksheetTargetPath) {
    let normalizedPath = worksheetTargetPath.replace(/\\/g, "/");
    if (!normalizedPath.startsWith("xl/")) {
      normalizedPath = path.posix.join("xl", normalizedPath);
    }
    normalizedPath = path.posix.normalize(normalizedPath);
    parsed.entryMap.delete(normalizedPath);
    const index = parsed.entries.findIndex(
      (entry) => entry.fileName === normalizedPath
    );
    if (index >= 0) {
      parsed.entries.splice(index, 1);
    }
  }
}

export function copyWorkbookWithoutSheet(
  sourcePath: string,
  destinationPath: string,
  sheetName = "Meta"
): void {
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Workbook not found: ${sourcePath}`);
  }

  const buffer = fs.readFileSync(sourcePath);
  const parsed = parseZip(buffer);
  removeWorksheetByName(parsed, sheetName);
  const rebuilt = rebuildZip(parsed);

  const tempPath = `${destinationPath}.tmp`;
  fs.writeFileSync(tempPath, rebuilt);
  fs.renameSync(tempPath, destinationPath);
}

export type ScenarioValueMap = Record<string, string>;
