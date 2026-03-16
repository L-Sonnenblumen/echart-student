import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useAppContext } from './AppContext';
import { MOCK_DATA } from './mockData';

interface ReportModalProps {
  onClose: () => void;
  defaultTab?: string;
}

export default function ReportModal({ onClose, defaultTab }: ReportModalProps) {
  const { reportStatus } = useAppContext();

  const initialTab =
    defaultTab && reportStatus[defaultTab as keyof typeof reportStatus]
      ? defaultTab
      : reportStatus.pre
        ? 'pre'
        : reportStatus.post
          ? 'post'
          : 'initial';

  const [activeTab, setActiveTab] = useState(initialTab);

  const getRadarOption = (data: number[]) => ({
    color: ['#00d084'],
    radar: {
      indicator: [
        { name: '数据感知力', max: 100 },
        { name: '概率建模力', max: 100 },
        { name: '统计推断力', max: 100 },
        { name: '结果解释力', max: 100 },
      ],
      axisName: { color: '#666', fontSize: 13 },
      splitArea: {
        areaStyle: { color: ['rgba(0,208,132,0.02)', 'rgba(0,208,132,0.05)'] },
      },
    },
    series: [
      {
        type: 'radar',
        data: [{ value: data, name: '能力评分' }],
        areaStyle: { color: 'rgba(0, 208, 132, 0.2)' },
      },
    ],
  });

  const reportData =
    MOCK_DATA.reports[activeTab as keyof typeof MOCK_DATA.reports];

  // 渲染初认识的特定表格
  const renderInitialReport = () => (
    <div style={{ animation: 'fadeIn 0.3s' }}>
      <p style={{ color: 'var(--text-sub)', marginBottom: '8px' }}>
        根据你的画像，系统为你生成了以下初始学习路径：
      </p>
      <table className="path-table">
        <thead>
          <tr>
            <th style={{ width: '15%' }}>参数</th>
            <th style={{ width: '35%' }}>设定</th>
            <th style={{ width: '50%' }}>解释</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>路径顺序</td>
            <td>
              统计推断力 → 概率
              <br />
              建模力 → 数据感知
              <br />力 → 结果解释力
            </td>
            <td>
              你数学基础好，先从统计推断力入手，建立用数据说话的思维；再学习概率建模，然后用数据感知力加深理解，最后强化结果解释能力。
            </td>
          </tr>
          <tr>
            <td>台阶粒度</td>
            <td>
              中粒度（每个维度分解
              <br />为 5 个学习台阶）
            </td>
            <td>
              你的基础不错，台阶不需要太细，但考虑到编程初学，也不宜过快，中粒度最适合你。
            </td>
          </tr>
          <tr>
            <td>资源类型</td>
            <td>案例型</td>
            <td>
              你偏好从案例入手，系统将优先推送真实案例和故事，帮助你理解抽象概念。
            </td>
          </tr>
          <tr>
            <td>拓展深度</td>
            <td>
              1（适度推送 AI 相关
              <br />
              发展目标）
            </td>
            <td>
              根据你的 AI 兴趣，系统会适度推送一些 AI
              应用案例，如朴素贝叶斯分类器中的概率基础，但不会过多深入。
            </td>
          </tr>
        </tbody>
      </table>
      <div
        style={{
          textAlign: 'center',
          marginTop: '16px',
          color: '#999',
          fontSize: '13px',
        }}
      >
        <p>
          这个路径不是一成不变的，它会在你的学习过程中，根据你的表现动态优化调整。
        </p>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <h2 style={{ fontSize: '22px', color: 'var(--text-main)' }}>
            学习报告详情
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', fontSize: '24px', color: '#999' }}
          >
            ×
          </button>
        </div>

        {/* Tab 切换栏：加入了 initial */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            borderBottom: '1px solid #eee',
            marginBottom: '24px',
          }}
        >
          {['initial', 'pre', 'in', 'post'].map((tab) => {
            const isUnlocked = reportStatus[tab as keyof typeof reportStatus];
            const labels: Record<string, string> = {
              initial: '初认识画像',
              pre: '课前报告',
              in: '课中报告',
              post: '课后总体报告',
            };
            return (
              <button
                key={tab}
                onClick={() => isUnlocked && setActiveTab(tab)}
                style={{
                  padding: '12px 24px',
                  background: 'none',
                  fontSize: '16px',
                  fontWeight: activeTab === tab ? 'bold' : 'normal',
                  color:
                    activeTab === tab
                      ? 'var(--primary)'
                      : isUnlocked
                        ? 'var(--text-main)'
                        : '#ccc',
                  borderBottom:
                    activeTab === tab
                      ? '3px solid var(--primary)'
                      : '3px solid transparent',
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                }}
              >
                {labels[tab]} {!isUnlocked && '🔒'}
              </button>
            );
          })}
        </div>

        {/* 渲染内容 */}
        {activeTab === 'initial'
          ? renderInitialReport()
          : reportData && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '32px',
                  animation: 'fadeIn 0.3s',
                }}
              >
                <div>
                  <div
                    style={{
                      background: '#f8f9fa',
                      padding: '24px',
                      borderRadius: '12px',
                      textAlign: 'center',
                      marginBottom: '24px',
                    }}
                  >
                    <p style={{ color: 'var(--text-sub)', fontSize: '15px' }}>
                      本阶段总评分
                    </p>
                    <h1
                      style={{
                        fontSize: '48px',
                        color: 'var(--primary)',
                        margin: '8px 0',
                      }}
                    >
                      {reportData.score}{' '}
                      <span style={{ fontSize: '20px' }}>分</span>
                    </h1>
                    {reportData.totalPoints && (
                      <p style={{ fontSize: '13px', color: '#999' }}>
                        加权折算总分: {reportData.totalPoints}
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      border: '1px solid #eee',
                      borderRadius: '12px',
                      padding: '16px',
                    }}
                  >
                    <ReactECharts
                      option={getRadarOption(reportData.radar)}
                      style={{ height: '260px' }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                  }}
                >
                  <div
                    style={{
                      borderLeft: '4px solid #ff9f43',
                      paddingLeft: '16px',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '16px',
                        marginBottom: '12px',
                        color: '#ff9f43',
                      }}
                    >
                      ⚠️ 薄弱点提示
                    </h3>
                    <ul
                      style={{
                        color: 'var(--text-sub)',
                        lineHeight: '1.8',
                        fontSize: '14px',
                        listStyleType: 'disc',
                        paddingLeft: '20px',
                      }}
                    >
                      {reportData.weakness.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>

                  <div
                    style={{
                      borderLeft: '4px solid var(--primary)',
                      paddingLeft: '16px',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '16px',
                        marginBottom: '12px',
                        color: 'var(--primary)',
                      }}
                    >
                      💡 学习建议与下一步行动
                    </h3>
                    <ul
                      style={{
                        color: 'var(--text-sub)',
                        lineHeight: '1.8',
                        fontSize: '14px',
                        listStyleType: 'decimal',
                        paddingLeft: '20px',
                      }}
                    >
                      {reportData.suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
      </div>
    </div>
  );
}
