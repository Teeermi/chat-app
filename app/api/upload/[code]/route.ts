import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const fileName = req.headers.get("X-File-Name");

    if (!fileName) {
      return NextResponse.json({ error: "Missing file name" }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await req.arrayBuffer());

    const uploadDir = path.join(process.cwd(), "public", (await params).code);
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, fileBuffer);

    return NextResponse.json({
      message: "File uploaded successfully",
      path: filePath,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
