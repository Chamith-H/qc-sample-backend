import { Injectable } from '@nestjs/common';
import { s3_Bucket } from './aws-s3-bucket.config';
import { AwsS3BucketModel } from './aws-s3-bucket.model';

@Injectable()
export class AwsS3BucketService {
  //!--> Upload files..........................................................|
  async uploadFiles(files: any[], folder: string) {
    if (!files || files.length === 0) {
      return [];
    }

    const uploadPromises = await Promise.all(
      files.map(async (file) => {
        const uploadableObject: AwsS3BucketModel = {
          Bucket: process.env.AWS_USER,
          Key: `${folder}/${file.originalname}`,
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        const uploadedFiles = await this.s3_upload(uploadableObject);
        return uploadedFiles;
      }),
    );

    return uploadPromises;
  }

  private async s3_upload(bucketModel: AwsS3BucketModel) {
    try {
      const s3Response = await s3_Bucket.upload(bucketModel).promise();
      return s3Response.Key;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  //!--> Get files...................................................................|
  async getFiles(keys: string[]) {
    if (!keys || keys.length === 0) {
      return [];
    }

    const imageUrls = await Promise.all(
      keys.map(async (key) => {
        if (key && key !== null) {
          const params = {
            Bucket: process.env.AWS_USER,
            Key: key,
            Expires: 60 * 60 * 24,
          };

          const url = await s3_Bucket.getSignedUrlPromise('getObject', params);

          if (!url) {
            return {};
          }

          return { url: url, key: key, name: key.split('/').pop() };
        }
        return null;
      }),
    );

    return imageUrls;
  }

  //!--> Get single file................................................................|
  async getSingleFile(key: string) {
    if (!key || key === '' || key === null || key === undefined) {
      return { url: null, key: null, name: null };
    }

    const params = {
      Bucket: process.env.AWS_USER,
      Key: key,
      Expires: 60 * 60 * 24,
    };

    const url = await s3_Bucket.getSignedUrlPromise('getObject', params);

    if (!url) {
      return { url: null, key: null, name: null };
    }

    return { url: url, key: key, name: key.split('/').pop() };
  }

  //!--> Compare files and delete.......................................................|
  async fileSyncer(beforeFileList: string[], afterFileList: string[]) {
    const deleteList = beforeFileList.filter(
      (item) => !afterFileList.includes(item),
    );

    if (!deleteList || deleteList.length === 0) {
      return true;
    }

    const response = deleteList.forEach((key) => {
      s3_Bucket.deleteObject(
        {
          Bucket: process.env.AWS_USER,
          Key: key,
        },
        (err, data) => {
          if (err) {
            console.log(err);
            throw err;
          } else {
            return false;
          }
        },
      );
    });

    return response;
  }

  //!--> Delete files..................................................................|
  async removeFiles(
    files: string[],
  ): Promise<{ success: boolean; errors?: string[] }> {
    if (!files || files.length === 0) {
      return { success: false, errors: ['No files provided'] };
    }

    const results = await Promise.all(
      files.map(
        (key) =>
          new Promise<{ success: boolean; error?: string }>((resolve) => {
            s3_Bucket.deleteObject(
              {
                Bucket: process.env.AWS_USER,
                Key: key,
              },
              (err) => {
                if (err) {
                  console.error(`Failed to delete ${key}:`, err);
                  resolve({ success: false, error: `Failed to delete ${key}` });
                } else {
                  resolve({ success: true });
                }
              },
            );
          }),
      ),
    );

    const errors = results.filter((r) => !r.success).map((r) => r.error!);

    return {
      success: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }
}
