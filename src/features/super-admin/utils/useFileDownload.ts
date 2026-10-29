import { useCallback, useState } from 'react';
import { useGenerateS3UrlMutation } from '@/features/super-admin/api/file.api';

export const useFileDownload = () => {
  const [generateS3Url] = useGenerateS3UrlMutation();
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadFile = useCallback(async (s3Key: string, customFilename?: string) => {
    try {
      setIsDownloading(true);
      // Fallback: extract filename from the s3 key string if customFilename not provided
      const fileName = customFilename || s3Key.split('/').pop() || 'downloaded_file';

      // Open a new tab synchronously before the await to bypass popup blockers
      const newWindow = window.open('', '_blank');

      try {
        const response = await generateS3Url({ key: s3Key, filename: fileName }).unwrap();
        
        if (response && response.url) {
          // We received the presigned URL
          const presignedUrl = response.url;
          
          if (newWindow) {
             newWindow.location.href = presignedUrl;
          } else {
             // Fallback if popup blocker blocked the initial synchronous window.open
             window.location.href = presignedUrl;
          }
        } else {
          console.error('Failed to generate S3 URL');
          if (newWindow) newWindow.close();
        }
      } catch (error) {
        if (newWindow) newWindow.close();
        throw error;
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setIsDownloading(false);
    }
  }, [generateS3Url]);

  return { downloadFile, isDownloading };
};
