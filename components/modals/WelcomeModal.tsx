"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TrendingUp,
  Wallet,
  BarChart3,
  Users,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Chào mừng đến WealthTrack!",
      description: "Nền tảng quản lý tài chính chuyên nghiệp giúp bạn làm chủ vận động tiền tệ.",
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            WealthTrack cung cấp công cụ toàn diện để theo dõi chi tiêu, quản lý đầu tư và tối ưu hóa tài chính cá nhân.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium">Bảo mật cao cấp</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-emerald-500/10 rounded-lg">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-medium">Thời gian thực</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Quản lý ví đa dạng",
      description: "Kết nối mọi nguồn tài chính vào một nơi duy nhất.",
      icon: <Wallet className="w-8 h-8 text-blue-500" />,
      content: (
        <div className="space-y-4">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Tích hợp ngân hàng, ví điện tử, tiền mặt</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Tự động phân loại giao dịch</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Cảnh báo chi tiêu thông minh</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Phân tích & Báo cáo",
      description: "Hiểu sâu về thói quen tài chính của bạn.",
      icon: <BarChart3 className="w-8 h-8 text-purple-500" />,
      content: (
        <div className="space-y-4">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <span>Biểu đồ trực quan hóa chi tiêu</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <span>Báo cáo tháng tự động</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <span>Dự báo tài chính AI</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Quỹ nhóm & Tiết kiệm",
      description: "Quản lý tài chính chung và đạt mục tiêu tiết kiệm.",
      icon: <Users className="w-8 h-8 text-emerald-500" />,
      content: (
        <div className="space-y-4">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
              <span>Tạo quỹ gia đình, bạn bè</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
              <span>Đặt mục tiêu tiết kiệm thông minh</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
              <span>Theo dõi tiến độ tự động</span>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            {steps[currentStep].icon}
          </div>
          <DialogTitle className="text-2xl font-bold">
            {steps[currentStep].title}
          </DialogTitle>
          <DialogDescription className="text-base">
            {steps[currentStep].description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          {steps[currentStep].content}
        </div>

        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "w-8 bg-primary"
                    : index < currentStep
                    ? "w-2 bg-primary/50"
                    : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                className="rounded-xl"
              >
                Trước đó
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              className="rounded-xl"
            >
              {currentStep === steps.length - 1 ? "Bắt đầu" : "Tiếp theo"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        <button
          onClick={handleSkip}
          className="absolute top-4 left-4 text-muted-foreground hover:text-foreground text-sm underline"
        >
          Bỏ qua hướng dẫn
        </button>
      </DialogContent>
    </Dialog>
  );
}
