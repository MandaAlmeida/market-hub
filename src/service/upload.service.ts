import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Upload } from "@aws-sdk/lib-storage";
import { Readable } from "stream";
import { UploadDTO } from "src/models/upload.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UploadService {
    private client: S3Client; // Cliente para interagir com o serviço S3
    private readonly allowedMimeTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    private readonly maxFileSize = 15 * 1024 * 1024; // 15MB

    // Construtor injeta dependência do serviço de variáveis de ambiente
    constructor(private configService: ConfigService) {
        const accountId = this.configService.get<string>("CLOUDFLARE_ACCOUNT_ID");
        const accessKeyId = this.configService.get<string>("AWS_ACCESS_KEY_ID");
        const secretAccessKey = this.configService.get<string>("AWS_SECRET_ACCESS_KEY");

        if (!accountId || !accessKeyId || !secretAccessKey) {
            throw new Error("Cloudflare R2 or AWS credentials are not set properly.");
        }

        this.client = new S3Client({
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            region: "auto",
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
    }


    // Retorna a URL pública do arquivo (não busca o conteúdo)
    async getFile(fileName: string) {
        const url = this.configService.get("URL_PUBLIC_GET_IMAGE");
        const fileURL = `${url}${fileName}`;

        return { url: fileURL };
    }

    /**
     * Realiza upload de um arquivo (usando buffer ou stream)
     */
    async upload(file: UploadDTO) {
        // Valida tipo MIME do arquivo
        if (!this.allowedMimeTypes.includes(file.mimetype)) throw new BadRequestException('Tipo de arquivo não permitido. Somente PDF, imagens e documentos Word são permitidos.');


        // Valida tamanho do arquivo
        if (file.size > this.maxFileSize) throw new BadRequestException('O arquivo excede o tamanho máximo permitido de 15MB.');


        // Gera nome único para o arquivo
        const uploadId = randomUUID();
        const uniqueFileName = `${uploadId}-${file.originalname}`;

        // Decide entre usar Buffer ou Stream
        const body = this.convertToStreamOrBuffer(file);

        // Instancia upload com o cliente S3
        const upload = new Upload({
            client: this.client,
            params: {
                Bucket: this.configService.get("AWS_BUCKET_NAME"),
                Key: uniqueFileName,
                Body: body,
                ContentType: file.mimetype,
            },
        });

        // Realiza o upload
        await upload.done();

        // Retorna metadados do arquivo
        return {
            type: file.mimetype,
            title: file.originalname,
            url: uniqueFileName,
        };
    }

    // Exclui um arquivo do bucket
    async delete(file: string): Promise<{ success: boolean }> {
        const command = new DeleteObjectCommand({
            Bucket: this.configService.get("AWS_BUCKET_NAME"),
            Key: file,
        });
        await this.client.send(command);
        return { success: true };
    }

    /**
     * Retorna o corpo do arquivo como um Stream (útil para downloads)
     */
    async download(fileKey: string) {
        const bucketUrl = this.configService.get('URL_PUBLIC_GET_IMAGE'); // Ex: https://<bucket>.r2.cloudflarestorage.com/
        return { url: `${bucketUrl}${fileKey}` };
    }

    /**
     * Decide se o arquivo será manipulado como Buffer ou como Stream
     */
    private convertToStreamOrBuffer(file: UploadDTO): Buffer | Readable {
        if (file.buffer && file.buffer.length < 5 * 1024 * 1024) { // Se for menor que 5MB, usa Buffer
            return file.buffer;
        }

        // Caso contrário, cria um Stream (melhor para arquivos grandes)
        const stream = new Readable();
        stream.push(file.buffer);
        stream.push(null);
        return stream;
    }
}
