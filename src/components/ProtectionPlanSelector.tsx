import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, ShieldCheck, Crown, ChevronDown, ChevronUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ProtectionPlan {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  price_per_day: number;
  price_per_week: number | null;
  price_per_month: number | null;
  deductible_amount: number;
  max_coverage_amount: number | null;
  tier: 'basic' | 'standard' | 'premium' | 'ultimate';
  features: string[];
  exclusions: string[];
  coverage_details: any;
  icon_name: string | null;
  color_theme: string | null;
  display_order: number;
}

interface ProtectionPlanSelectorProps {
  selectedPlanId: string | null;
  onSelectPlan: (planId: string | null, plan: ProtectionPlan | null) => void;
  rentalDays: number;
}

const TierIcon = ({ tier, className }: { tier: string; className?: string }) => {
  switch (tier) {
    case 'basic':
      return <Shield className={className} />;
    case 'standard':
      return <ShieldCheck className={className} />;
    case 'premium':
    case 'ultimate':
      return <Crown className={className} />;
    default:
      return <Shield className={className} />;
  }
};

const ProtectionPlanSelector = ({ selectedPlanId, onSelectPlan, rentalDays }: ProtectionPlanSelectorProps) => {
  const [plans, setPlans] = useState<ProtectionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  useEffect(() => {
    loadProtectionPlans();
  }, []);

  const loadProtectionPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("protection_plans")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error("Error loading protection plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePlanCost = (plan: ProtectionPlan) => {
    // Calculate most cost-effective pricing
    if (rentalDays >= 30 && plan.price_per_month) {
      const months = Math.ceil(rentalDays / 30);
      return {
        total: plan.price_per_month * months,
        perDay: plan.price_per_month / 30,
        label: `$${plan.price_per_month}/month`
      };
    } else if (rentalDays >= 7 && plan.price_per_week) {
      const weeks = Math.ceil(rentalDays / 7);
      return {
        total: plan.price_per_week * weeks,
        perDay: plan.price_per_week / 7,
        label: `$${plan.price_per_week}/week`
      };
    } else {
      return {
        total: plan.price_per_day * rentalDays,
        perDay: plan.price_per_day,
        label: `$${plan.price_per_day}/day`
      };
    }
  };

  const getSavingsText = (plan: ProtectionPlan) => {
    // Comparison to typical rental counter prices (usually 2-3x more expensive)
    const ourPrice = calculatePlanCost(plan).total;
    const rentalCounterPrice = ourPrice * 2.5; // Assume rental counter is 2.5x more
    const savings = rentalCounterPrice - ourPrice;
    const savingsPercent = Math.round((savings / rentalCounterPrice) * 100);

    return {
      amount: savings,
      percent: savingsPercent
    };
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-48 bg-muted animate-pulse rounded-lg" />
        <div className="h-48 bg-muted animate-pulse rounded-lg" />
        <div className="h-48 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-2xl md:text-3xl font-display font-semibold mb-2">
          Protect Your Rental
        </h3>
        <p className="text-muted-foreground">
          Add comprehensive protection coverage and save up to 50% compared to rental counter prices
        </p>
      </div>

      {/* No Protection Option */}
      <Card
        className={cn(
          "cursor-pointer transition-all duration-300 border-2",
          selectedPlanId === null
            ? "border-[#C5A572] bg-[#C5A572]/5"
            : "border-border hover:border-[#C5A572]/40"
        )}
        onClick={() => onSelectPlan(null, null)}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center",
                selectedPlanId === null ? "bg-[#C5A572]/20" : "bg-muted"
              )}>
                <Info className={cn("w-6 h-6", selectedPlanId === null ? "text-[#C5A572]" : "text-muted-foreground")} />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Decline Protection</h4>
                <p className="text-sm text-muted-foreground">I'll use my own insurance or accept the risk</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold">$0</div>
                <div className="text-xs text-muted-foreground">No additional cost</div>
              </div>
              {selectedPlanId === null && (
                <div className="w-6 h-6 bg-[#C5A572] rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-black" />
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Protection Plan Cards */}
      {plans.map((plan) => {
        const cost = calculatePlanCost(plan);
        const savings = getSavingsText(plan);
        const isSelected = selectedPlanId === plan.id;
        const isExpanded = expandedPlan === plan.id;
        const isPremium = plan.tier === 'premium' || plan.tier === 'ultimate';

        return (
          <Card
            key={plan.id}
            className={cn(
              "cursor-pointer transition-all duration-300 border-2 relative overflow-hidden",
              isSelected
                ? "border-[#C5A572] bg-[#C5A572]/5 shadow-[0_0_30px_rgba(197,165,114,0.3)]"
                : "border-border hover:border-[#C5A572]/40",
              isPremium && "shadow-[0_0_20px_rgba(197,165,114,0.15)]"
            )}
            onClick={() => onSelectPlan(plan.id, plan)}
          >
            {/* Recommended Badge */}
            {plan.tier === 'standard' && (
              <div className="flex justify-end mt-2 mr-3">
                <Badge className="bg-green-600 text-white">Recommended</Badge>
              </div>
            )}

            {isPremium && (
              <div className="flex justify-end mt-2 mr-3">
                <Badge className="bg-[#C5A572] text-black">Best Value</Badge>
              </div>
            )}

            {/* Gradient overlay for premium */}
            {isPremium && (
              <div
                className=" inset-0 opacity-5 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, ${plan.color_theme}40 0%, transparent 100%)`
                }}
              />
            )}

            <div className="p-6 space-y-4 relative">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: (plan.color_theme || '#60A5FA') + '20' }}
                  >
                    <TierIcon tier={plan.tier} className="w-8 h-8" style={{ color: plan.color_theme || '#60A5FA' }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display text-xl font-semibold mb-1">{plan.display_name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>

                    {/* Deductible Badge */}
                    {plan.deductible_amount === 0 ? (
                      <Badge variant="default" className="bg-green-600 mb-2">ZERO DEDUCTIBLE</Badge>
                    ) : (
                      <Badge variant="secondary" className="mb-2">${plan.deductible_amount.toLocaleString()} Deductible</Badge>
                    )}
                  </div>
                </div>

                {/* Pricing */}
                <div className="text-right flex-shrink-0">
                  <div className="text-3xl font-bold" style={{ color: plan.color_theme || '#60A5FA' }}>
                    ${cost.total.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{cost.label} × {rentalDays} days</div>
                  <div className="text-xs font-medium text-green-600 mt-2">
                    Save {savings.percent}% vs rental counter
                  </div>
                  {isSelected && (
                    <div className="w-8 h-8 bg-[#C5A572] rounded-full flex items-center justify-center mt-3 ml-auto">
                      <Check className="w-5 h-5 text-black" />
                    </div>
                  )}
                </div>
              </div>

              {/* Key Features (Always Visible) */}
              <div className="grid grid-cols-2 gap-2">
                {plan.features.slice(0, 4).map((feature: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Collapsible Details */}
              {(plan.features.length > 4 || plan.exclusions.length > 0) && (
                <Collapsible open={isExpanded} onOpenChange={() => setExpandedPlan(isExpanded ? null : plan.id)}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedPlan(isExpanded ? null : plan.id);
                      }}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-2" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-2" />
                          View Full Coverage Details
                        </>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 pt-4">
                    {/* All Features */}
                    {plan.features.length > 4 && (
                      <div>
                        <h5 className="font-semibold text-sm mb-2">All Features:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {plan.features.map((feature: string, index: number) => (
                            <div key={index} className="flex items-start gap-2 text-sm">
                              <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Exclusions */}
                    {plan.exclusions.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-sm mb-2 text-destructive">Not Covered:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {plan.exclusions.map((exclusion: string, index: number) => (
                            <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="text-destructive">×</span>
                              <span>{exclusion}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Max Coverage */}
                    {plan.max_coverage_amount && (
                      <div className="pt-3 border-t border-border">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Maximum Coverage:</span>
                          <span className="font-semibold">${plan.max_coverage_amount.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* Select Button */}
              {!isSelected && (
                <Button
                  className={cn(
                    "w-full mt-4",
                    isPremium
                      ? "bg-[#C5A572] text-black hover:bg-[#C5A572]/90"
                      : "bg-background border-2 border-[#C5A572] text-[#C5A572] hover:bg-[#C5A572] hover:text-black"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPlan(plan.id, plan);
                  }}
                >
                  Select {plan.display_name}
                </Button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ProtectionPlanSelector;
