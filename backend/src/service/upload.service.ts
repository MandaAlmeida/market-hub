import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Upload } from "@aws-sdk/lib-storage";
import { Readable } from "stream";
import { UploadDTO } from "src/models/upload.dto";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Image } from "src/entity/image.entity";
import { Repository } from "typeorm";

@Injectable()
export class UploadService {
    private client: S3Client; // Cliente para interagir com o serviço S3
    private readonly allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
    ];
    private readonly maxFileSize = 5 * 1024 * 1024; // 5MB

    // Construtor injeta dependência do serviço de variáveis de ambiente
    constructor(private configService: ConfigService,
        @InjectRepository(Image)
        private imageRepository: Repository<Image>,
    ) {
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
    async upload(files: Express.Multer.File[], ads?: string) {
        for (const file of files) {
            // Valida tipo MIME
            if (!this.allowedMimeTypes.includes(file.mimetype)) {
                throw new BadRequestException(`Tipo de arquivo ${file.originalname} não permitido. Apenas imagens são aceitas.`);
            }

            // Valida tamanho
            if (file.size > this.maxFileSize) {
                throw new BadRequestException(`O arquivo ${file.originalname} excede o tamanho máximo permitido de 5MB.`);
            }

            // Gera nome único
            const uploadId = randomUUID();
            const uniqueFileName = `${uploadId}-${file.originalname}`;

            // Faz o upload para o S3
            const upload = new Upload({
                client: this.client,
                params: {
                    Bucket: this.configService.get("AWS_BUCKET_NAME"),
                    Key: uniqueFileName,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                },
            });

            await upload.done();

            // Cria entidade de imagem
            const image = {
                ads: { id: ads },
                type: file.mimetype,
                title: file.originalname,
                url: uniqueFileName,
            };

            await this.imageRepository.save(image);
        }
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

}
