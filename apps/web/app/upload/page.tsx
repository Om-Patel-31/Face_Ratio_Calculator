import { AdvicePanel } from "@/components/advice-panel";
import { UploadStudio } from "@/components/upload-studio";
import { SiteFrame } from "@/components/site-frame";

const uploadSteps = [
  "Upload a front-facing image with even lighting.",
  "Optionally connect the webcam for live landmark extraction.",
  "FaceRatio AI detects landmarks, maps ratios, and generates an advisory report."
];

const advice = [
  "Use soft front lighting to minimize harsh shadow falloff across the midface.",
  "Keep the head level and camera centered to preserve landmark accuracy.",
  "A plain background improves face segmentation and overlay precision."
];

export default function UploadPage() {
  return (
    <SiteFrame>
      <UploadStudio />
      <section className="mt-6 lg:max-w-3xl">
        <AdvicePanel title="Preview-level suggestions" suggestions={advice} />
      </section>
    </SiteFrame>
  );
}
