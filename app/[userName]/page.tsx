/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  IntroStep,
  IdentityStep,
  StoryStep,
  RatingStep,
  MediaStep,
  VerificationStep,
  ReviewStep,
  SuccessStep,
} from "@/components/submit/FormSteps";
import { Step, FormData } from "@/components/submit/types";
import LottieAnimation from "@/components/LottieAnimation";
import { cn } from "@/lib/utils";
import axios from "axios";
import { postTestimonial } from "@/lib/api";
import { sanitizeUsername } from "@/lib/validation";

export default function User() {
  const params = useParams();
  const router = useRouter();
  const extractedUsername = typeof params?.userName === "string" ? params.userName : "Alex";

  const sanitized = sanitizeUsername(extractedUsername);
  console.log(sanitized)

  useEffect(() => {
    if (!sanitized) {
      router.push("/NotFound")
    }
  }, [sanitized, router])


  const [currentStep, setCurrentStep] = useState<Step>("INTRO");
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    company: "",
    avatar: null,
    avatarPreview: null,
    feedback: "",
    rating: 0,
    audioBlob: null,
    audioUrl: null,
    audioFile: null,
    socialType: "linkedin",
    socialLink: "",
  });

  const stepOrder: Step[] = [
    "INTRO",
    "IDENTITY",
    "STORY",
    "RATING",
    "MEDIA",
    "VERIFICATION",
    "REVIEW",
    "SUCCESS",
  ];

  const currentIndex = stepOrder.indexOf(currentStep);

  const validateStep = (step: Step): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (step === "IDENTITY") {
      if (!formData.name.trim())
        newErrors.name = "Your name is required.";
    }

    if (step === "STORY") {
      if (!formData.feedback.trim())
        newErrors.feedback =
          "Please share a few words about your experience.";
      if (formData.feedback.trim().length < 10)
        newErrors.feedback =
          "Please write a bit more (at least 10 characters).";
    }

    if (step === "RATING") {
      if (formData.rating === 0)
        newErrors.rating = "Please select a rating";
    }

    if (step === "VERIFICATION") {
      const url = formData.socialLink.toLowerCase();
      if (!url) {
        newErrors.socialLink =
          "Profile URL is required for verification.";
      } else {
        let isValid = false;

        const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[^\/\s]+\/?$/i;
        const twitterRegex = /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[^\/\s]+\/?$/i;
        const instagramRegex = /^https?:\/\/(www\.)?instagram\.com\/[^\/\s]+\/?$/i;

        if (formData.socialType === "linkedin" && linkedinRegex.test(url))
          isValid = true;

        if (formData.socialType === "twitter" && twitterRegex.test(url))
          isValid = true;

        if (formData.socialType === "instagram" && instagramRegex.test(url))
          isValid = true;

        if (!isValid)
          newErrors.socialLink = `Please enter a valid ${formData.socialType} profile URL.`;
      }
    }

    return newErrors;
  };

  const handleNext = async () => {
    const stepErrors = validateStep(currentStep);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});

    if (currentStep === "REVIEW") {
      setIsSubmitting(true);

      try {
        const audioSource = formData.audioBlob || formData.audioFile || null;

        let audioBase64: string | null = null;

        if (audioSource) {
          audioBase64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(audioSource); // Works for both Blob and File
          });
        }

        await axios.post(
          postTestimonial + `${sanitized}`,
          {
            name: formData.name,
            feedback: formData.feedback,
            stars: formData.rating,
            socialType: formData.socialType,
            socialLink: formData.socialLink,
            audioUrl: audioBase64,                     // base64 string or null
            avatarUrl: formData.avatarPreview || null, // already base64
            company: formData.company || null,
          }
        );

        setCurrentStep("SUCCESS");

      } catch (error: any) {
        console.error("Failed to submit:", error);

        if (error.response?.status === 404) {
          alert("This profile doesn't exist.");
        } else {
          alert("Something went wrong. Please try again.");
        }
      } finally {
        setIsSubmitting(false);
      }

    } else if (currentIndex < stepOrder.length - 1) {
      setDirection(1);
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className={cn(
      "min-h-screen text-white",
      (currentStep === "REVIEW" || currentStep === "SUCCESS")
        ? "flex items-center justify-center"
        : "flex items-center justify-center lg:items-center lg:justify-start"
    )}>

      {/* LEFT SIDE - Form Content (or full width for review/success) */}
      <div className={cn(
        "flex flex-col justify-center items-center px-12 py-20",
        (currentStep === "REVIEW" || currentStep === "SUCCESS")
          ? "w-full"
          : "lg:w-1/2"
      )}>
        <div className={cn(
          "w-full",
          (currentStep === "REVIEW" || currentStep === "SUCCESS")
            ? "max-w-3xl"
            : "max-w-xl"
        )}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              {currentStep === "INTRO" && (
                <IntroStep username={sanitized} onNext={handleNext} />
              )}
              {currentStep === "IDENTITY" && (
                <IdentityStep
                  formData={formData}
                  updateField={updateField}
                  errors={errors}
                />
              )}
              {currentStep === "STORY" && (
                <StoryStep
                  formData={formData}
                  updateField={updateField}
                  errors={errors}
                />
              )}
              {currentStep === "RATING" && (
                <RatingStep
                  formData={formData}
                  updateField={updateField}
                  errors={errors}
                />
              )}
              {currentStep === "MEDIA" && (
                <MediaStep
                  formData={formData}
                  updateField={updateField}
                  errors={errors}
                  onNext={handleNext}
                />
              )}
              {currentStep === "VERIFICATION" && (
                <VerificationStep
                  formData={formData}
                  updateField={updateField}
                  errors={errors}
                />
              )}
              {currentStep === "REVIEW" && (
                <ReviewStep
                  formData={formData}
                  updateField={updateField}
                  errors={errors}
                  onNext={handleNext}
                  isSubmitting={isSubmitting}
                />
              )}
              {currentStep === "SUCCESS" && (
                <SuccessStep username={sanitized} />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          {currentStep !== "INTRO" &&
            currentStep !== "SUCCESS" &&
            currentStep !== "REVIEW" && (
              <div className="flex justify-between items-center mt-12 pt-6 border-t border-zinc-800">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <Button onClick={handleNext}>Continue</Button>
              </div>
            )}
        </div>
      </div>

      {/* RIGHT SIDE - Only show for form steps, not review/success */}
      {currentStep !== "REVIEW" && currentStep !== "SUCCESS" && (
        <div className="w-1/2 lg:flex items-center justify-center px-12 hidden">
          <AnimatePresence mode="wait">
            {currentStep === "INTRO" && (
              <motion.div
                key="intro-animation"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="w-full max-w-2xl"
              >
                <LottieAnimation
                  animationPath="/TakeFeedback.json"
                  className="w-full h-auto"
                />
              </motion.div>
            )}

            {currentStep === "IDENTITY" && (
              <motion.div
                key="orb-animation"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="w-full max-w-2xl"
              >
                <LottieAnimation
                  animationPath="/Login.json"
                  className="w-full h-auto"
                />
              </motion.div>
            )}

            {currentStep === "STORY" && (
              <motion.div
                key="story-animation"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="w-full max-w-2xl"
              >
                <LottieAnimation
                  animationPath="/customerFeedback.json"
                  className="w-full h-auto"
                />
              </motion.div>
            )}

            {currentStep === "RATING" && (
              <motion.div
                key="rating-animation"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="w-full max-w-2xl"
              >
                <LottieAnimation
                  animationPath="/RatingAnimation.json"
                  className="w-full h-auto"
                />
              </motion.div>
            )}

            {currentStep === "MEDIA" && (
              <motion.div
                key="media-animation"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="w-full max-w-2xl"
              >
                <LottieAnimation
                  animationPath="/voice.json"
                  className="w-2/3 h-auto"
                />
              </motion.div>
            )}

            {currentStep === "VERIFICATION" && (
              <motion.div
                key="verification-animation"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="w-full max-w-2xl"
              >
                <LottieAnimation
                  animationPath="/Verified.json"
                  className="w-3/5 h-auto"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

    </div>
  );
}