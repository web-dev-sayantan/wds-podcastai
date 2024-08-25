import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { GenerateThumbnailProps } from "@/types";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useAction, useMutation } from "convex/react";
import { Loader } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const GenerateThumbnail = ({
  setImage,
  setImageStorageId,
  image,
  imagePrompt,
  setImagePrompt,
}: GenerateThumbnailProps) => {
  const [isAiThumbnail, setIsAiThumbnail] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const generateUploadUrlMutation = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrlMutation);
  const getImageUrl = useMutation(api.podcasts.getUrl);
  const handleGenerateThumbnail = useAction(api.freepik.generateFreepikAction);
  // const handleGenerateThumbnail = useAction(api.openai.generateThumbnailAction);
  // const handleGenerateThumbnail = useAction(
  //   api.sdxl.generateTSDXLhumbnailAction
  // );

  const handleImage = async (blob: Blob, fileName: string) => {
    setIsImageLoading(true);
    setImage("");
    try {
      const file = new File([blob], fileName, { type: "image/png" });
      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      setImageStorageId(storageId);
      const imageUrl = await getImageUrl({ storageId });
      setImage(imageUrl!);
      setIsImageLoading(false);
      toast({ title: "Image uploaded successfully", variant: "default" });
    } catch (error) {
      console.error(error);
      toast({ title: "Failed to upload image", variant: "destructive" });
    }
  };
  const generateThumbnail = async () => {
    try {
      setIsImageLoading(true);
      const response = await handleGenerateThumbnail({
        prompt: imagePrompt,
      });
      const blob = new Blob([response], { type: "image/png" });
      handleImage(blob, `thumbnail-${uuidv4()}.png`);
    } catch (error) {
      console.error(error);
      toast({ title: "Failed to generate thumbnail", variant: "destructive" });
    } finally {
      setIsImageLoading(false);
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      const files = e.target.files;
      if (!files || files.length === 0) {
        throw new Error("No files selected");
        return;
      }
      const file = files[0];
      const blob = await file.arrayBuffer().then((b) => new Blob([b]));
      handleImage(blob, file.name);
    } catch (error) {
      console.error(error);
      toast({ title: "Failed to upload image", variant: "destructive" });
    }
  };
  return (
    <>
      <div className="generate_thumbnail">
        <Button
          type="button"
          variant="plain"
          className={cn("", { "bg-black-6": isAiThumbnail })}
          onClick={() => setIsAiThumbnail(true)}
        >
          Use AI to Generate Thumbnail
        </Button>
        <Button
          type="button"
          variant="plain"
          className={cn("", { "bg-black-6": !isAiThumbnail })}
          onClick={() => setIsAiThumbnail(false)}
        >
          Upload Custom Image
        </Button>
      </div>
      {isAiThumbnail ? (
        <div className="flex flex-col gap-5">
          <div>
            <div className="mt-5 flex flex-col gap-2.5">
              <Label htmlFor="" className="text-16 font-bold text-white-1">
                AI prompt to Generate Thumbnail
              </Label>
              <Textarea
                className="input-class font-light focus-visible:ring-offset-orange-1"
                placeholder="Provide text for the thumbnail"
                rows={5}
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
              />
            </div>
            <div className="mt-5 w-full max-w-[200px]">
              <Button
                type="button"
                className="text-16 bg-orange-1 py-4 font-bold text-white-1"
                onClick={generateThumbnail}
              >
                {isImageLoading ? (
                  <>
                    Generating...
                    <Loader size={20} className="animate-spin ml-2" />
                  </>
                ) : (
                  "Generate Thumbnail"
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="image_div" onClick={() => imageRef?.current?.click()}>
          <Input
            type="file"
            className="hidden"
            ref={imageRef}
            onChange={(e) => uploadImage(e)}
          />
          {!isImageLoading ? (
            <Image
              src="/icons/upload-image.svg"
              alt="upload"
              width={40}
              height={40}
            />
          ) : (
            <div className="text-16 text-white-1 text-medium flex items-center gap-2">
              Uploading <Loader size={20} className="animate-spin ml-2" />
            </div>
          )}
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-12 font-bold text-orange-1">Click to upload</h2>
            <p className="text-12 font-normal text-gray-1">
              SVG, PNG, JPG or GIF max(1080x1080)
            </p>
          </div>
        </div>
      )}
      {image && (
        <div className="flex-center w-full">
          <Image
            src={image}
            alt="thumbnail"
            width={200}
            height={200}
            className="rounded-lg mt-5"
          />
        </div>
      )}
    </>
  );
};

export default GenerateThumbnail;
