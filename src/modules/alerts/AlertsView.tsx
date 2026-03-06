import { useState, useEffect, useRef } from 'react';
import { AlertCircle, AlertTriangle, Clock, CheckCircle, Shield, Search, Eye, Activity, Brain, Zap, TrendingUp, ArrowUpCircle, ArrowDownCircle, XCircle } from 'lucide-react';
import { useAlertStore } from '@/store/alertStore';
import { usePatientStore } from '@/store/patientStore';
import { useAuditStore } from '@/store/auditStore';
import { formatDistanceToNow } from 'date-fns';
import { AIAlert } from '@/types';
import { useTheme } from '@/hooks/useTheme';

export function AlertsView() {
  const { glassCard, glassInner, isDark, text } = useTheme();
  const alerts = useAlertStore((state) => state.alerts);
  const addAlert = useAlertStore((state) => state.addAlert);
  const acknowledgeAlert = useAlertStore((state) => state.acknowledgeAlert);
  const applyRecommendation = useAlertStore((state) => state.applyRecommendation);
  const dismissAlert = useAlertStore((state) => state.dismissAlert);
  const patients = usePatientStore((state) => state.patients);
  const updatePatient = usePatientStore((state) => state.updatePatient);
  const addOverride = usePatientStore((state) => state.addOverride);
  const addAuditEntry = useAuditStore((state) => state.addEntry);
  const [filter, setFilter] = useState<'all' | 'active' | 'acknowledged'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const seededRef = useRef(false);

  // Seed demo alerts into the actual store so Apply/Acknowledge/Dismiss work
  useEffect(() => {
    if (seededRef.current || alerts.length > 0) return;
    seededRef.current = true;

    const demoAlerts: Omit<AIAlert, 'id' | 'timestamp' | 'acknowledged'>[] = [
      {
        patientId: '1',
        type: 'DETERIORATION',
        severity: 'CRITICAL',
        message: 'Patient showing signs of deterioration - TEWS score increased from 3 to 7',
        previousCategory: 'YELLOW',
        recommendedCategory: 'RED',
        contributingFactors: ['Increased respiratory rate', 'Dropping SpO2', 'Elevated heart rate'],
      },
      {
        patientId: '2',
        type: 'THRESHOLD_BREACH',
        severity: 'HIGH',
        message: 'Pediatric patient temperature exceeds critical threshold (39.5°C)',
        contributingFactors: ['High fever (39.5°C)', 'Age < 15 years'],
      },
      {
        patientId: '3',
        type: 'TREND_WARNING',
        severity: 'MEDIUM',
        message: 'Declining blood pressure trend detected over last 30 minutes',
        contributingFactors: ['Systolic BP decreasing', 'Patient reports dizziness'],
      },
      {
        patientId: '4',
        type: 'THRESHOLD_BREACH',
        severity: 'HIGH',
        message: 'Patient oxygen saturation below 90% - immediate intervention needed',
        contributingFactors: ['SpO2: 87%', 'Respiratory distress symptoms'],
      },
    ];

    demoAlerts.forEach((a) => addAlert(a));
  }, [alerts.length, addAlert]);

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'active') return !alert.acknowledged;
    if (filter === 'acknowledged') return alert.acknowledged;
    return true;
  }).filter((alert) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return alert.message.toLowerCase().includes(q) || alert.type.toLowerCase().includes(q);
  });

  const stats = {
    total: alerts.length,
    active: alerts.filter((a) => !a.acknowledged).length,
    acknowledged: alerts.filter((a) => a.acknowledged).length,
    critical: alerts.filter((a) => a.severity === 'CRITICAL' && !a.acknowledged).length,
  };

  const getSeverityStyle = (severity: AIAlert['severity'], acknowledged?: boolean) => {
    if (acknowledged) {
      return {
        iconBg: 'rgba(148,163,184,0.12)',
        iconColor: 'text-slate-400',
        badgeBg: 'rgba(148,163,184,0.1)',
        badgeBorder: '1px solid rgba(148,163,184,0.2)',
        badgeText: 'text-slate-500',
        cardBorder: isDark ? '1px solid rgba(2,132,199,0.18)' : '1px solid rgba(203,213,225,0.4)',
        accentColor: 'rgba(148,163,184,0.3)',
      };
    }
    switch (severity) {
      case 'CRITICAL':
        return {
          iconBg: 'rgba(239,68,68,0.1)',
          iconColor: 'text-red-500',
          badgeBg: 'rgba(239,68,68,0.08)',
          badgeBorder: '1px solid rgba(239,68,68,0.2)',
          badgeText: 'text-red-600',
          cardBorder: '1px solid rgba(239,68,68,0.25)',
          accentColor: 'rgba(239,68,68,0.6)',
        };
      case 'HIGH':
        return {
          iconBg: 'rgba(245,158,11,0.1)',
          iconColor: 'text-amber-500',
          badgeBg: 'rgba(245,158,11,0.08)',
          badgeBorder: '1px solid rgba(245,158,11,0.2)',
          badgeText: 'text-amber-600',
          cardBorder: '1px solid rgba(245,158,11,0.25)',
          accentColor: 'rgba(245,158,11,0.6)',
        };
      case 'MEDIUM':
        return {
          iconBg: 'rgba(234,179,8,0.1)',
          iconColor: 'text-yellow-500',
          badgeBg: 'rgba(234,179,8,0.08)',
          badgeBorder: '1px solid rgba(234,179,8,0.2)',
          badgeText: 'text-yellow-600',
          cardBorder: '1px solid rgba(234,179,8,0.25)',
          accentColor: 'rgba(234,179,8,0.6)',
        };
      default:
        return {
          iconBg: 'rgba(148,163,184,0.12)',
          iconColor: 'text-slate-400',
          badgeBg: 'rgba(148,163,184,0.1)',
          badgeBorder: '1px solid rgba(148,163,184,0.2)',
          badgeText: 'text-slate-500',
          cardBorder: isDark ? '1px solid rgba(2,132,199,0.18)' : '1px solid rgba(203,213,225,0.4)',
          accentColor: 'rgba(148,163,184,0.3)',
        };
    }
  };

  return (
    <div className="min-h-full">
      <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-4 animate-fade-in">

        {/* ── Dark Header Banner ── */}
        <div className="glass-card-dark rounded-3xl overflow-hidden animate-fade-up">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white tracking-wide">AI Alert Intelligence</h1>
                  <p className="text-white/70 text-xs font-medium">Real-time automated monitoring & predictive clinical alerts</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white/15 backdrop-blur rounded-xl px-3 py-1.5 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-white/90">AI Active</span>
                </div>
                {stats.critical > 0 && (
                  <div className="bg-red-500/20 backdrop-blur rounded-xl px-3 py-1.5 flex items-center gap-2 border border-red-400/30">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-300" />
                    <span className="text-xs font-bold text-red-200">Critical Active</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── AI Capabilities Panel ── */}
        <div
          className="rounded-2xl p-5 animate-fade-up"
          style={{ ...glassCard, animationDelay: '0.08s' } as any}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-800 tracking-tight">System Overview</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">AI-powered monitoring capabilities and alert summary</p>
            </div>
          </div>
          {/* AI Capabilities Row */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100/60">
            {[
              { icon: Activity, label: 'Vital Sign Monitoring', desc: 'Continuous analysis of patient vitals', color: 'text-cyan-600', bg: 'rgba(6,182,212,0.1)' },
              { icon: TrendingUp, label: 'Predictive Analytics', desc: 'Early-warning deterioration detection', color: 'text-indigo-500', bg: 'rgba(99,102,241,0.1)' },
              { icon: CheckCircle, label: 'Clinical Validation', desc: 'Acknowledge & document interventions', color: 'text-emerald-500', bg: 'rgba(34,197,94,0.1)' },
            ].map((cap) => {
              const Icon = cap.icon;
              return (
                <div key={cap.label} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cap.bg }}>
                    <Icon className={`w-4 h-4 ${cap.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-700 leading-tight">{cap.label}</p>
                    <p className="text-[10px] text-slate-400 font-medium leading-tight">{cap.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Search & Filter Bar ── */}
        <div
          className="rounded-2xl p-4 animate-fade-up"
          style={{ ...glassCard, animationDelay: '0.15s' } as any}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search alerts by message or type..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                style={{
                  background: isDark ? 'rgba(12,74,110,0.18)' : 'rgba(255,255,255,0.7)',
                  border: isDark ? '1px solid rgba(2,132,199,0.22)' : '1px solid rgba(203,213,225,0.5)',
                  boxShadow: isDark ? '0 1px 4px rgba(0,0,0,0.2)' : '0 1px 4px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.8)',
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              {(['all', 'active', 'acknowledged'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold rounded-lg transition-all duration-300 ${filter === f
                    ? 'bg-gradient-to-r from-slate-800 to-slate-700 text-white shadow-md shadow-slate-800/20'
                    : 'text-slate-500 hover:bg-white/60'
                  }`}
                >
                  {f === 'all' && <AlertCircle className="w-3 h-3" />}
                  {f === 'active' && <Clock className="w-3 h-3" />}
                  {f === 'acknowledged' && <CheckCircle className="w-3 h-3" />}
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Alerts List ── */}
        <div className="space-y-3">
          {/* Section Header */}
          <div className="flex items-center justify-between px-1 animate-fade-up" style={{ animationDelay: '0.2s' } as any}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(99,102,241,0.12)' }}>
                <Brain className="w-4 h-4 text-indigo-500" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">AI-Generated Alerts</h3>
                <p className="text-[11px] text-slate-400 font-medium">{filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''} matching your criteria</p>
              </div>
            </div>
          </div>

          {filteredAlerts.length === 0 ? (
            <div
              className="rounded-2xl p-12 text-center animate-fade-up"
              style={{ ...glassCard, animationDelay: '0.25s' } as any}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: 'rgba(34,197,94,0.1)' }}
              >
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-sm font-bold text-slate-700">All Clear</p>
              <p className="text-xs text-slate-400 font-medium mt-1">
                {filter === 'all' && 'No alerts in the system right now'}
                {filter === 'active' && 'No active alerts requiring attention'}
                {filter === 'acknowledged' && 'No acknowledged alerts to display'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAlerts
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .map((alert, idx) => {
                  const style = getSeverityStyle(alert.severity, alert.acknowledged);
                  const patient = patients.find((p) => p.id === alert.patientId);
                  const isCritical = alert.severity === 'CRITICAL' && !alert.acknowledged;

                  return (
                    <div
                      key={alert.id}
                      className={`rounded-2xl p-5 transition-all duration-500 animate-fade-up ${
                        alert.acknowledged ? 'opacity-65' : 'hover:-translate-y-0.5'
                      } ${isCritical ? 'animate-critical-border' : ''}`}
                      style={{
                        ...glassCard,
                        border: style.cardBorder,
                        animationDelay: `${0.25 + idx * 0.06}s`,
                      } as any}
                    >
                      <div className="flex items-start gap-4">
                        {/* Severity Icon */}
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: style.iconBg }}
                        >
                          {alert.severity === 'CRITICAL' ? (
                            <AlertTriangle className={`w-5 h-5 ${style.iconColor}`} />
                          ) : (
                            <AlertCircle className={`w-5 h-5 ${style.iconColor}`} />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Alert Type Label */}
                          <div className="flex items-center gap-2.5 mb-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold rounded-lg ${style.badgeText} uppercase tracking-wider`}
                              style={{ background: style.badgeBg, border: style.badgeBorder }}
                            >
                              {alert.severity}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                            </span>
                          </div>

                          {/* Alert Message */}
                          <p className={`text-[13px] font-bold leading-relaxed ${alert.acknowledged ? 'text-slate-500' : 'text-slate-800'}`}>
                            {alert.message}
                          </p>

                          {patient && (
                            <p className="text-[11px] text-slate-400 font-medium mt-1.5">
                              Patient: <span className="text-slate-600 font-semibold">{patient.fullName}</span>
                            </p>
                          )}

                          {/* Contributing Factors */}
                          {alert.contributingFactors && alert.contributingFactors.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {alert.contributingFactors.map((factor, i) => (
                                <span
                                  key={i}
                                  className="px-2.5 py-1 text-[10px] font-semibold text-slate-600 rounded-lg"
                                  style={{
                                    background: isDark ? 'rgba(12,74,110,0.25)' : 'rgba(255,255,255,0.7)',
                                    border: isDark ? '1px solid rgba(2,132,199,0.2)' : '1px solid rgba(203,213,225,0.4)',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                  }}
                                >
                                  {factor}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Acknowledged Info */}
                          {alert.acknowledged && alert.acknowledgedAt && (
                            <div
                              className="flex items-center gap-2 mt-3 px-3 py-2.5 rounded-xl"
                              style={{
                                background: 'rgba(34,197,94,0.06)',
                                border: '1px solid rgba(34,197,94,0.15)',
                              }}
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                              <span className="text-[11px] text-emerald-700 font-medium">
                                Resolved by <span className="font-bold">{alert.acknowledgedBy}</span> {formatDistanceToNow(alert.acknowledgedAt, { addSuffix: true })}
                                {alert.comment && <span className="text-emerald-600"> — {alert.comment}</span>}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        {!alert.acknowledged && (
                          <div className="flex-shrink-0 pt-1 flex flex-col gap-2">
                            {/* Apply Recommendation Button (if alert has a recommended category) */}
                            {alert.recommendedCategory && alert.previousCategory && (
                              <button
                                onClick={() => {
                                  const result = applyRecommendation(alert.id, 'DR001', 'Dr. Admin');
                                  if (result && result.newCategory) {
                                    updatePatient(result.patientId, { category: result.newCategory });
                                    addOverride(result.patientId, {
                                      id: `OV${Date.now()}`,
                                      timestamp: new Date(),
                                      clinicianId: 'DR001',
                                      clinicianName: 'Dr. Admin',
                                      originalCategory: result.previousCategory!,
                                      newCategory: result.newCategory,
                                      reason: 'AI recommendation applied from alerts dashboard',
                                    });
                                    addAuditEntry({
                                      action: 'CATEGORY_OVERRIDDEN',
                                      performedBy: 'DR001',
                                      performedByName: 'Dr. Admin',
                                      patientId: result.patientId,
                                      details: `Applied AI recommendation: ${result.previousCategory} → ${result.newCategory}`,
                                      previousValue: result.previousCategory,
                                      newValue: result.newCategory,
                                    });
                                  }
                                }}
                                className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white rounded-xl transition-all duration-300 shadow-md hover:-translate-y-0.5 ${
                                  alert.type === 'DETERIORATION'
                                    ? 'bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/15 hover:shadow-red-500/25'
                                    : 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/15 hover:shadow-emerald-500/25'
                                }`}
                              >
                                {alert.type === 'DETERIORATION' ? (
                                  <ArrowUpCircle className="w-3.5 h-3.5" />
                                ) : (
                                  <ArrowDownCircle className="w-3.5 h-3.5" />
                                )}
                                Apply
                              </button>
                            )}
                            <button
                              onClick={() => {
                                const comment = prompt('Add a comment (optional):');
                                acknowledgeAlert(alert.id, 'DR001', comment || undefined);
                                addAuditEntry({
                                  action: 'ALERT_ACKNOWLEDGED',
                                  performedBy: 'DR001',
                                  performedByName: 'Dr. Admin',
                                  patientId: alert.patientId,
                                  details: `${alert.type} alert acknowledged${comment ? ': ' + comment : ''}`,
                                });
                              }}
                              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-slate-800 to-slate-700 hover:shadow-lg hover:-translate-y-0.5 rounded-xl transition-all duration-300 shadow-md shadow-slate-800/15"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Acknowledge
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Reason for dismissing:');
                                if (reason) {
                                  dismissAlert(alert.id, 'DR001', reason);
                                  addAuditEntry({
                                    action: 'ALERT_ACKNOWLEDGED',
                                    performedBy: 'DR001',
                                    performedByName: 'Dr. Admin',
                                    patientId: alert.patientId,
                                    details: `Alert dismissed: ${reason}`,
                                  });
                                }
                              }}
                              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-500 bg-white/60 hover:bg-white/80 border border-slate-200/60 rounded-xl transition-all duration-300"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Dismiss
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
