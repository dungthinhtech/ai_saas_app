// app/api/upload/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Cấu hình API route để không phân tích body
export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseFormData(
  stream: ReadableStream<Uint8Array>,
  contentType: string | null
) {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    const reader = stream.getReader();

    // Đọc toàn bộ dữ liệu từ stream
    reader
      .read()
      .then(function processText({ done, value }) {
        if (done) {
          const buffer = Buffer.concat(chunks);

          // Lấy boundary từ contentType
          const boundaryMatch = contentType?.match(/boundary=([^;]+)/);
          const boundary = boundaryMatch ? boundaryMatch[1] : null;

          if (!boundary) {
            return reject(new Error("No boundary found"));
          }

          const boundaryBuffer = Buffer.from(`--${boundary}`, "utf-8");
          const endBoundaryBuffer = Buffer.from(`--${boundary}--`, "utf-8");

          let start = buffer.indexOf(boundaryBuffer);
          const files = [];

          while (start !== -1) {
            let end = buffer.indexOf(
              boundaryBuffer,
              start + boundaryBuffer.length
            );
            if (end === -1) {
              end = buffer.indexOf(
                endBoundaryBuffer,
                start + boundaryBuffer.length
              );
            }

            const section = buffer.slice(start, end);
            const contentDisposition = section
              .toString("utf-8")
              .match(
                /Content-Disposition: form-data; name="([^"]+)"; filename="([^"]+)"/
              );
            if (contentDisposition) {
              const filename = contentDisposition[2];
              const data = section.slice(section.indexOf("\r\n\r\n") + 4, -2);
              const uploadDir = "./public/uploads";
              if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
              }
              const filePath = path.join(uploadDir, filename);
              fs.writeFileSync(filePath, data);
              files.push({ filename, path: filePath });
            }
            start = buffer.indexOf(boundaryBuffer, end + boundaryBuffer.length);
          }

          resolve(files);
        } else {
          chunks.push(value);
          return reader.read().then(processText).catch(reject);
        }
      })
      .catch(reject);
  });
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type");
    const files = await parseFormData(req.body, contentType);
    return NextResponse.json({ message: "Upload thành công", files });
  } catch (err) {
    console.error("Lỗi:", err);
    return new NextResponse("Có lỗi xảy ra", { status: 500 });
  }
}
