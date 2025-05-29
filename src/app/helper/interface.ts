export interface FileResult {
  success: boolean
  message: string
  data: FileResultData
  error: any
  timestamp: string
}

export interface FileResultData {
  summary: Summary
  statistics: Statistics
  results: Result[]
  total_results: number
}

export interface Summary {
  total_processed: number
  risk_distribution: RiskDistribution
  top_triggered_rules: TopTriggeredRule[]
  recommendations: string[]
  processing_errors: number
}

export interface RiskDistribution {
  high_risk: HighRisk
  medium_risk: MediumRisk
  low_risk: LowRisk
}

export interface HighRisk {
  count: number
  percentage: number
}

export interface MediumRisk {
  count: number
  percentage: number
}

export interface LowRisk {
  count: number
  percentage: number
}

export interface TopTriggeredRule {
  rule: string
  count: number
  description: string
}

export interface Statistics {
  total_transactions: number
  processed_transactions: number
  high_risk_count: number
  medium_risk_count: number
  low_risk_count: number
  error_count: number
  rule_statistics: RuleStatistics
  processing_time: string
  settings_applied: SettingsApplied
}

export interface RuleStatistics {
  threshold_exceeded: number
  high_risk_jurisdiction: number
  high_risk_client: number
  unusual_transaction_type: number
  suspicious_activity: number
  structured_transactions: number
}

export interface SettingsApplied {
  max_transactions: number
  risk_threshold: number
  include_low_risk: boolean
}

export interface Result {
  transaction_id: number
  risk_level: string
  risk_score: number
  triggered_rules: string[]
  rule_descriptions: string[]
  analysis_details: AnalysisDetails
  original_index: number
}

export interface AnalysisDetails {
  payer_info: string
  receiver_info: string
  amount: string
  currency: string
  transaction_date: string
  description: string
}
