"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useProfile } from "@/hooks/useProfile";
import { useWallets } from "@/hooks/useWallets";
import { useReports } from "@/hooks/useReports";
import { useFinancialAdvice } from "@/hooks/useAi";
import { Button } from "@/components/ui/button";
import { QuickTransactionModal } from "@/components/modals/QuickTransactionModal";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Plus,
  Sparkles,
  TrendingUp,
  Activity,
  ChevronRight,
  BrainCircuit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SavingsGoalsCard } from "@/components/dashboard/SavingsGoalsCard";
import { CashFlowChart } from "@/components/dashboard/CashFlowChart";

const CHART_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f43f5e",
];

type ReportStat = {
  categoryName?: string;
  name?: string;
  categoryType?: "INCOME" | "EXPENSE" | string;
  type?: "INCOME" | "EXPENSE" | string;
  totalAmount?: number;
};

const getStatType = (item: ReportStat) => item.categoryType || item.type || "";

const getCategoryName = (item: ReportStat) =>
  item.categoryName || item.name || "Không rõ";

const getAmount = (item: ReportStat) =>
  typeof item.totalAmount === "number" ? item.totalAmount : 0;

export default function DashboardPage() {
  const router = useRouter();

  const { data: user, isLoading: isProfileLoading } = useProfile();
  const { wallets = [], totalBalance = 0, isLoading: isWalletsLoading } =
    useWallets();

  const { data: aiAdvice = "" } = useFinancialAdvice();

  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);

  const [startDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0]
  );

  const [endDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      .toISOString()
      .split("T")[0]
  );

  const { stats = [], isLoadingStats } = useReports(startDate, endDate);

  useEffect(() => {
    const token = Cookies.get("access_token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const { expenseStats, totalExpense, totalIncome } = useMemo(() => {
    const normalizedStats = (stats || []) as ReportStat[];

    const expenses = normalizedStats.filter(
      (item) => getStatType(item).toUpperCase() === "EXPENSE"
    );

    const incomes = normalizedStats.filter(
      (item) => getStatType(item).toUpperCase() === "INCOME"
    );

    return {
      expenseStats: expenses,
      totalExpense: expenses.reduce((sum, item) => sum + getAmount(item), 0),
      totalIncome: incomes.reduce((sum, item) => sum + getAmount(item), 0),
    };
  }, [stats]);

  const { totalDebt, healthScore } = useMemo(() => {
    const debt = wallets.reduce(
      (acc: number, wallet: any) =>
        acc + (wallet.balance < 0 ? Math.abs(wallet.balance) : 0),
      0
    );

    const total = totalIncome + totalExpense;
    const score = total > 0 ? (totalIncome / total) * 100 : 100;

    return {
      totalDebt: debt,
      healthScore: Math.min(Math.max(score, 0), 100),
    };
  }, [wallets, totalIncome, totalExpense]);

  if (isProfileLoading || isWalletsLoading) {
    return (
      <div className="flex h-[70vh] flex-1 flex-col items-center justify-center gap-8">
        <div className="relative">
          <div className="h-20 w-20 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl" />
        </div>

        <div className="flex flex-col items-center gap-3">
          <span className="animate-pulse text-sm font-black uppercase tracking-[0.6em] text-primary">
            Homie Finance
          </span>

          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40">
            Đang đồng bộ dữ liệu...
          </span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative mx-auto mb-40 flex w-full max-w-7xl flex-1 flex-col space-y-16 overflow-x-hidden p-4 font-sans md:p-10">
      <div className="pointer-events-none fixed right-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 opacity-50 blur-[150px]" />
      <div className="pointer-events-none fixed bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/5 opacity-50 blur-[150px]" />

      <div className="relative flex animate-in flex-col justify-between gap-10 fade-in slide-in-from-top-6 duration-1000 ease-out lg:flex-row lg:items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 shadow-sm shadow-primary/5">
              <Sparkles size={14} className="animate-pulse text-primary" />
              <span className="text-[11px] font-black uppercase tracking-wider text-primary">
                Smart Dashboard
              </span>
            </div>

            <div className="h-px w-12 bg-border/40" />

            <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/30">
              v2.5 Release
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-5xl font-black leading-[0.9] tracking-tighter md:text-7xl">
              Chào,{" "}
              <span className="animate-gradient-x bg-gradient-to-r from-primary via-blue-500 to-emerald-500 bg-clip-text text-transparent">
                {user.username}
              </span>
            </h1>

            <p className="max-w-2xl text-lg font-medium leading-relaxed text-muted-foreground/60 md:text-xl">
              Phân tích tài chính cá nhân của bạn đã được cập nhật. Homie sẵn
              sàng hỗ trợ bạn tối ưu hóa chi tiêu!
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button
            type="button"
            onClick={() => setIsQuickCreateOpen(true)}
            size="lg"
            className="group relative h-16 overflow-hidden rounded-2xl bg-primary px-10 text-[12px] font-black uppercase tracking-widest shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95"
          >
            <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-1000 group-hover:translate-x-full" />
            <span className="relative flex items-center gap-3">
              Ghi chép mới <Plus size={20} strokeWidth={3} />
            </span>
          </Button>

          <Link href="/wallets">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-16 rounded-2xl border-2 border-primary/10 bg-card/40 px-10 text-[12px] font-black uppercase tracking-widest backdrop-blur-xl transition-all hover:border-primary/20 hover:bg-primary/5 active:scale-95"
            >
              Xem ví <Wallet size={18} className="ml-2 opacity-70" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid animate-in grid-cols-1 gap-8 fade-in slide-in-from-bottom-10 delay-200 duration-1000 ease-out md:grid-cols-3">
        {[
          {
            title: "Tài sản hiện có",
            amount: totalBalance,
            icon: Wallet,
            gradient: "from-blue-500/10 to-primary/10",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "group-hover:border-blue-500/40",
            link: "/wallets",
            text: "Quản lý dòng tiền",
          },
          {
            title: "Thu nhập tháng này",
            amount: totalIncome,
            icon: ArrowUpRight,
            gradient: "from-emerald-500/10 to-teal-500/10",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            border: "group-hover:border-emerald-500/40",
            link: "/reports",
            text: "Lịch sử thu nhập",
          },
          {
            title: "Đã chi tháng này",
            amount: totalExpense,
            icon: ArrowDownRight,
            gradient: "from-rose-500/10 to-destructive/10",
            color: "text-rose-500",
            bg: "bg-rose-500/10",
            border: "group-hover:border-rose-500/40",
            link: "/reports",
            text: "Phân tích chi tiêu",
          },
        ].map((card, index) => (
          <div
            key={card.title}
            className={cn(
              "group relative flex flex-col justify-between overflow-hidden rounded-[3rem] border-2 border-white/5 bg-card/30 p-8 shadow-2xl backdrop-blur-2xl transition-all duration-700 hover:-translate-y-2",
              card.border
            )}
          >
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-700 group-hover:opacity-100",
                card.gradient
              )}
            />

            <div className="relative z-10">
              <div className="mb-10 flex items-start justify-between">
                <div
                  className={cn(
                    "rounded-2xl border-2 border-white/10 p-4 shadow-lg transition-transform duration-500 group-hover:scale-110",
                    card.bg,
                    card.color
                  )}
                >
                  <card.icon size={26} strokeWidth={2.5} />
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground/40">
                    {card.title}
                  </span>

                  <div
                    className={cn(
                      "ml-auto mt-2 h-1 w-8 rounded-full transition-all duration-500 group-hover:w-16",
                      index === 0
                        ? "bg-blue-500"
                        : index === 1
                          ? "bg-emerald-500"
                          : "bg-rose-500"
                    )}
                  />
                </div>
              </div>

              <p className="flex items-baseline gap-2 text-5xl font-black tracking-tighter">
                {card.amount.toLocaleString()}
                <span className="text-lg font-bold opacity-20">đ</span>
              </p>
            </div>

            <Link
              href={card.link}
              className="group/link relative z-10 mt-12 flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-muted-foreground/40 transition-colors hover:text-foreground"
            >
              <span className="border-b-2 border-transparent pb-0.5 transition-all group-hover/link:border-current">
                {card.text}
              </span>

              <ChevronRight
                size={14}
                strokeWidth={3}
                className="transition-transform group-hover/link:translate-x-2"
              />
            </Link>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
        <div className="flex flex-col gap-10 lg:col-span-8">
          <div className="animate-in fade-in slide-in-from-left-10 delay-300 duration-1000 ease-out">
            <CashFlowChart />
          </div>

          <div className="relative overflow-hidden rounded-[3.5rem] border-2 border-white/5 bg-card/30 p-10 shadow-2xl backdrop-blur-3xl animate-in fade-in slide-in-from-bottom-12 delay-500 duration-1000 ease-out md:p-12">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/10 blur-[120px]" />

            <div className="relative mb-16 flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
              <div className="flex items-center gap-6">
                <div className="rounded-[1.5rem] border-2 border-primary/20 bg-primary/10 p-5 text-primary shadow-2xl shadow-primary/20">
                  <PieChart size={30} strokeWidth={2.5} />
                </div>

                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-foreground/90">
                    Cơ cấu chi tiêu
                  </h2>

                  <div className="mt-2 flex items-center gap-2">
                    <Activity size={14} className="animate-pulse text-primary" />
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                      Phân tích danh mục tháng này
                    </p>
                  </div>
                </div>
              </div>

              <Link href="/reports">
                <Button
                  type="button"
                  variant="ghost"
                  className="group h-12 rounded-2xl border border-white/10 bg-white/5 px-6 text-[11px] font-black uppercase tracking-widest transition-all hover:bg-primary hover:text-white"
                >
                  Xem báo cáo
                  <ChevronRight
                    size={14}
                    className="ml-2 transition-transform group-hover:translate-x-1"
                  />
                </Button>
              </Link>
            </div>

            {isLoadingStats ? (
              <div className="flex flex-col items-center gap-6 py-32 text-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/10 border-t-primary" />
                <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/30">
                  Đang xử lý dữ liệu...
                </span>
              </div>
            ) : expenseStats.length === 0 || totalExpense <= 0 ? (
              <div className="flex flex-col items-center gap-8 rounded-[3rem] border-2 border-dashed border-white/5 bg-white/5 py-24 text-center">
                <TrendingUp
                  size={48}
                  className="text-muted-foreground/10"
                  strokeWidth={1}
                />
                <p className="max-w-xs text-sm font-bold uppercase italic leading-relaxed tracking-[0.2em] text-muted-foreground/30">
                  Homie chưa có chi tiêu nào trong tháng này.
                </p>
              </div>
            ) : (
              <div className="relative z-10 grid grid-cols-1 items-center gap-16 lg:gap-24 xl:grid-cols-2">
                <div className="relative mx-auto flex h-72 w-72 shrink-0 items-center justify-center md:h-80 md:w-80">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-primary/10 blur-[100px]" />

                  <svg
                    viewBox="0 0 100 100"
                    className="relative z-10 h-full w-full -rotate-90 transform"
                  >
                    <defs>
                      <filter
                        id="shadow-donut-v2"
                        x="-20%"
                        y="-20%"
                        width="140%"
                        height="140%"
                      >
                        <feDropShadow
                          dx="0"
                          dy="0"
                          stdDeviation="2"
                          floodOpacity="0.4"
                        />
                      </filter>
                    </defs>

                    {(() => {
                      let cumulativePercent = 0;

                      return expenseStats.map((item, index) => {
                        const itemAmount = getAmount(item);
                        const percent =
                          totalExpense > 0 ? (itemAmount / totalExpense) * 100 : 0;
                        const dashArray = `${
                          (percent * circumference) / 100
                        } ${circumference}`;
                        const dashOffset = -(
                          (cumulativePercent * circumference) /
                          100
                        );

                        cumulativePercent += percent;

                        const color =
                          CHART_COLORS[index % CHART_COLORS.length];

                        return (
                          <circle
                            key={`${getCategoryName(item)}-${index}`}
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="transparent"
                            stroke={color}
                            strokeWidth="11"
                            strokeDasharray={dashArray}
                            strokeDashoffset={dashOffset}
                            strokeLinecap="round"
                            filter="url(#shadow-donut-v2)"
                            className="cursor-pointer transition-all duration-1000 ease-in-out hover:stroke-[14]"
                          />
                        );
                      });
                    })()}
                  </svg>

                  <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center">
                    <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full border-2 border-white/10 bg-card/80 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
                      <span className="mb-1 text-[11px] font-black uppercase tracking-widest text-muted-foreground/40">
                        Tổng chi
                      </span>

                      <span className="text-3xl font-black tracking-tighter text-rose-500 md:text-4xl">
                        {totalExpense >= 1000000
                          ? `${(totalExpense / 1000000).toFixed(1)}M`
                          : `${(totalExpense / 1000).toFixed(0)}K`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="custom-scrollbar-premium max-h-[420px] w-full flex-1 overflow-y-auto scroll-smooth pr-2">
                  <div className="grid grid-cols-1 gap-3">
                    {expenseStats.map((item, index) => {
                      const color = CHART_COLORS[index % CHART_COLORS.length];
                      const itemAmount = getAmount(item);
                      const percent =
                        totalExpense > 0
                          ? ((itemAmount / totalExpense) * 100).toFixed(1)
                          : "0.0";

                      return (
                        <div
                          key={`${getCategoryName(item)}-${index}`}
                          className="group flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-3 transition-all duration-500 hover:translate-x-1 hover:border-white/10 hover:bg-white/[0.08]"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className="h-3 w-3 rounded-full shadow-2xl transition-all duration-700 group-hover:scale-125"
                              style={{
                                backgroundColor: color,
                                boxShadow: `0 0 15px ${color}80`,
                              }}
                            />

                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-[12px] font-black uppercase tracking-tight text-foreground/70 transition-colors group-hover:text-foreground">
                                  {getCategoryName(item)}
                                </span>

                                <span
                                  className="rounded-md bg-white/5 px-1.5 py-0.5 text-[9px] font-black text-muted-foreground/60 transition-colors group-hover:text-foreground"
                                  style={{ color: `${color}cc` }}
                                >
                                  {percent}%
                                </span>
                              </div>

                              <div className="mt-1 h-0.5 w-16 overflow-hidden rounded-full bg-white/5">
                                <div
                                  className="h-full rounded-full transition-all delay-300 duration-1000"
                                  style={{
                                    width: `${percent}%`,
                                    backgroundColor: color,
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-[15px] font-black tracking-tighter text-foreground/90">
                              {itemAmount.toLocaleString()}đ
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-right-10 delay-400 duration-1000 ease-out lg:col-span-4">
          <SavingsGoalsCard />

          <div className="group relative overflow-hidden rounded-[3rem] border-2 border-white/5 bg-card/30 p-10 shadow-2xl backdrop-blur-3xl animate-in fade-in slide-in-from-bottom-12 delay-600 duration-1000 ease-out">
            <div className="absolute right-0 top-0 p-8 opacity-[0.03] transition-opacity duration-700 group-hover:opacity-[0.08]">
              <Activity size={120} strokeWidth={1} />
            </div>

            <div className="mb-10 flex items-center gap-4">
              <div className="rounded-2xl border-2 border-emerald-500/20 bg-emerald-500/10 p-3.5 text-emerald-500 shadow-lg shadow-emerald-500/10">
                <Activity size={24} strokeWidth={2.5} />
              </div>

              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-foreground/90">
                  Sức khỏe tài chính
                </h3>
                <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-emerald-500/60">
                  Phân tích chuyên sâu
                </p>
              </div>
            </div>

            <div className="relative z-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/30">
                    Dư nợ hiện tại
                  </p>
                  <p className="text-3xl font-black tracking-tighter text-foreground">
                    {totalDebt.toLocaleString()}
                    <span className="ml-1 text-xs opacity-20">đ</span>
                  </p>
                </div>

                <div className="space-y-2 text-right">
                  <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/30">
                    Chỉ số an toàn
                  </p>
                  <p
                    className={cn(
                      "text-3xl font-black tracking-tighter",
                      healthScore > 50 ? "text-emerald-500" : "text-amber-500"
                    )}
                  >
                    {healthScore.toFixed(0)}%
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">
                  <span>Rủi ro</span>
                  <span>An toàn</span>
                </div>

                <div className="h-3 w-full overflow-hidden rounded-full border-2 border-white/5 bg-white/5 p-0.5 shadow-inner">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-1500",
                      healthScore > 50
                        ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                        : "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                    )}
                    style={{ width: `${healthScore}%` }}
                  />
                </div>
              </div>

              <div className="group/advice relative overflow-hidden rounded-[2rem] border-2 border-white/5 bg-gradient-to-br from-white/5 to-transparent p-6">
                <div className="absolute -right-4 -top-4 p-6 opacity-[0.05] transition-transform duration-700 group-hover/advice:scale-125">
                  <Sparkles size={40} className="text-primary" />
                </div>

                <div className="mb-4 flex items-center gap-3">
                  <BrainCircuit size={16} className="text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                    Cố vấn AI nói rằng:
                  </span>
                </div>

                <p className="line-clamp-4 text-[12px] font-bold italic leading-relaxed text-muted-foreground/70 transition-all duration-500 group-hover/advice:line-clamp-none">
                  {aiAdvice ||
                    "Đang kết nối với bộ não trung tâm để đưa ra lời khuyên phù hợp nhất cho homie..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <QuickTransactionModal
        isOpen={isQuickCreateOpen}
        onClose={() => setIsQuickCreateOpen(false)}
      />
    </div>
  );
}