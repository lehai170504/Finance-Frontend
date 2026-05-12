"use client";

import { useFinancialAdvice } from "@/hooks/useAi";
import {
  Sparkles,
  BrainCircuit,
  Quote,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BadgeItem {
  label: string;
  color: string;
  icon: LucideIcon;
}

export function AiAdvisorCard() {
  const {
    data: adviceText = "",
    isLoading,
    refetch,
    isFetching,
    error,
  } = useFinancialAdvice();

  const getBadges = (text: string = ""): BadgeItem[] => {
    const badges: BadgeItem[] = [];
    const upperText = text.toUpperCase();

    if (
      text.includes("⚠️") ||
      upperText.includes("CẢNH BÁO") ||
      upperText.includes("RỦI RO") ||
      upperText.includes("VƯỢT")
    ) {
      badges.push({
        label: "Cảnh báo chi tiêu",
        color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        icon: AlertCircle,
      });
    }

    if (
      text.includes("✅") ||
      text.includes("🌟") ||
      upperText.includes("ỔN") ||
      upperText.includes("TỐT") ||
      upperText.includes("PHONG ĐỘ")
    ) {
      badges.push({
        label: "Tài chính ổn định",
        color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        icon: CheckCircle2,
      });
    }

    if (
      text.includes("💡") ||
      upperText.includes("GỢI Ý") ||
      upperText.includes("NÊN") ||
      upperText.includes("TIẾT KIỆM")
    ) {
      badges.push({
        label: "Mẹo tiết kiệm",
        color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        icon: Lightbulb,
      });
    }

    return badges;
  };

  const badges = getBadges(adviceText);

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="lg:col-span-3 relative overflow-hidden rounded-[3rem] border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-blue-500/5 p-8 shadow-2xl shadow-primary/10 animate-in fade-in slide-in-from-bottom-10 duration-1000 md:p-12">
      <div className="pointer-events-none absolute right-0 top-0 p-12 opacity-[0.03] transition-opacity duration-700 group-hover:opacity-[0.08]">
        <BrainCircuit size={220} strokeWidth={1} />
      </div>

      <div className="relative z-10 flex flex-col gap-12 md:flex-row">
        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-primary p-3.5 text-white shadow-xl shadow-primary/30 transition-transform">
                <Sparkles size={24} strokeWidth={2.5} />
              </div>

              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  Cố vấn tài chính AI
                </h2>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  Hỗ trợ bởi Homie Intelligence
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isFetching || isLoading}
              className="h-10 rounded-full border border-primary/20 px-5 text-[9px] font-black uppercase tracking-widest text-primary backdrop-blur-sm hover:bg-primary/10"
            >
              Làm mới
              <RefreshCw
                size={12}
                className={cn("ml-2", isFetching && "animate-spin")}
              />
            </Button>
          </div>

          <div className="relative">
            <Quote
              className="absolute -left-6 -top-4 text-primary/10"
              size={56}
            />

            <div className="flex min-h-[140px] items-center">
              {isLoading ? (
                <div className="w-full space-y-4">
                  <div className="h-4 w-[85%] animate-pulse rounded-full bg-primary/10" />
                  <div className="h-4 w-full animate-pulse rounded-full bg-primary/10" />
                  <div className="h-4 w-[60%] animate-pulse rounded-full bg-primary/10" />
                </div>
              ) : error ? (
                <div className="w-full space-y-4 rounded-3xl border-2 border-dashed border-red-500/30 bg-red-500/5 p-6 text-center">
                  <AlertCircle className="mx-auto mb-2 text-red-500" size={32} />

                  <p className="text-sm font-bold uppercase tracking-wider text-red-600/80">
                    Homie ơi, Cố vấn AI đang bận hoặc chưa khởi động!
                  </p>

                  <p className="text-xs italic text-foreground/60">
                    Hãy kiểm tra server AI hoặc thử lại sau nhé.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="whitespace-pre-line text-lg font-medium italic leading-relaxed text-foreground/90 md:text-xl">
                    {adviceText || "Đang chờ lời khuyên từ homie AI..."}
                  </p>

                  {badges.length > 0 && (
                    <div className="flex flex-wrap gap-3 pt-2">
                      {badges.map((badge) => {
                        const Icon = badge.icon;

                        return (
                          <span
                            key={badge.label}
                            className={cn(
                              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-widest animate-in zoom-in duration-500",
                              badge.color
                            )}
                          >
                            <Icon size={12} />
                            {badge.label}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="hidden w-64 items-center justify-center xl:flex">
          <div className="relative h-48 w-48">
            <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-[60px]" />

            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-primary/30 bg-background/80 shadow-2xl backdrop-blur-md transition-colors duration-500">
              <BrainCircuit
                size={80}
                className="text-primary transition-transform duration-700"
                strokeWidth={1.5}
              />

              <div className="absolute inset-2 animate-[spin_15s_linear_infinite] rounded-full border border-dashed border-primary/30" />
              <div className="absolute inset-6 animate-[spin_10s_linear_infinite_reverse] rounded-full border border-dotted border-primary/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}